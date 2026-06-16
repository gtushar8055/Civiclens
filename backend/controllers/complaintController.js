const Complaint = require("../models/complaintModel");
const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      category: req.body.category,
      priority: req.body.priority,
      department: req.body.department,
      status: req.body.status || "Pending",
      complaintLetter: req.body.complaintLetter,
      analysis: req.body.analysis,
    });
    res.status(201).json({
      success: true,
      message: "Complaint saved successfully.",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(complaints);
  } catch (error) {
    console.log("========== SAVE COMPLAINT ERROR ==========");
    console.log(error);
    console.log(error.message);
    console.log("==========================================");

    res.status(500).json({
      message: error.message,
    });
  }
};
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        message: "Complaint Not Found",
      });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createComplaint,
  getUserComplaints,
  getComplaintById,
};
