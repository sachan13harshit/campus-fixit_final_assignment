const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Electrical', 'Water', 'Internet', 'Infrastructure', 'Other'],
        required: true,
    },
    imageUrl: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved'],
        default: 'Open',
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    remarks: {
        type: String,
        default: '',
    }
}, { timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);
