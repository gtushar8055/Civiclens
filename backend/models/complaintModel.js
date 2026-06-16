const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    imageUrl: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Pending",
    },

    analysis: {
      type: Object,
      default: {},
    },

    complaintLetter: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Complaint", complaintSchema);
