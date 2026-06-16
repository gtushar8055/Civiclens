const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createComplaint,
  getUserComplaints,
  getComplaintById,
} = require("../controllers/complaintController");
router.post("/", authMiddleware, createComplaint);
router.get("/", authMiddleware, getUserComplaints);
router.get("/:id", authMiddleware, getComplaintById);


module.exports = router;
