const express = require('express');
const Issue = require('../models/Issue');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// @route   POST /api/issues
// @desc    Create an issue
// @access  Private (Student)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, description, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newIssue = new Issue({
            title,
            description,
            category,
            imageUrl,
            reportedBy: req.user.id,
        });

        const issue = await newIssue.save();
        res.json(issue);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/issues/my-issues
// @desc    Get all issues reported by logged in user
// @access  Private
router.get('/my-issues', authMiddleware, async (req, res) => {
    try {
        const issues = await Issue.find({ reportedBy: req.user.id }).sort({ createdAt: -1 });
        res.json(issues);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/issues
// @desc    Get all issues (Admin or public, but typically Admin)
// @access  Private (Admin)
// NOTE: Requirement says "View all reported issues" for Admin.
// We can allow students to see all too if we want, but let's restrict or just AUTH for now.
// Implemented as Admin only for now to separate roles clearly. A student sees THEIR issues.
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const issues = await Issue.find().populate('reportedBy', ['name', 'email']).sort({ createdAt: -1 });
        res.json(issues);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const { sendStatusUpdateEmail } = require('../utils/emailService');

// @route   PATCH /api/issues/:id/status
// @desc    Update issue status
// @access  Private (Admin)
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
    const { status, remarks } = req.body;

    try {
        // Populate reportedBy to get email
        let issue = await Issue.findById(req.params.id).populate('reportedBy', ['name', 'email']);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        const previousStatus = issue.status;

        if (status) issue.status = status;
        if (remarks) issue.remarks = remarks;

        await issue.save();

        // Send Email if status changed
        if (status && status !== previousStatus && issue.reportedBy && issue.reportedBy.email) {
            sendStatusUpdateEmail(
                issue.reportedBy.email,
                issue.reportedBy.name,
                issue.title,
                issue.status,
                issue.remarks
            );
        }

        res.json(issue);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
