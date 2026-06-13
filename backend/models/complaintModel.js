const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(

    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        imageUrl: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            default: ""
        },

        priority: {
            type: String,
            default: ""
        },

        department: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            default: "Pending"
        },

        analysis: {
            type: Object,
            default: {}
        }

    },

    {
        timestamps: true
    }

);

module.exports = mongoose.model(
    "Complaint",
    complaintSchema
);