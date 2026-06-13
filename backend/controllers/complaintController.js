const Complaint = require("../models/complaintModel");
const createComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.create({
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            category: req.body.category,
            priority: req.body.priority,
            department: req.body.department,
            analysis: req.body.analysis
        });
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(
            req.params.id
        );
        if (!complaint) {
            return res.status(404).json({
                message: "Complaint Not Found"
            });
        }
        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    createComplaint,
    getAllComplaints,
    getComplaintById
};