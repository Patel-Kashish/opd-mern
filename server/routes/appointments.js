const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },

    doctor: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
      minlength: [2, 'Doctor name must be at least 2 characters'],
      maxlength: [100, 'Doctor name cannot exceed 100 characters'],
      match: [
        /^[A-Za-z][A-Za-z .'-]*$/,
        'Doctor name contains invalid characters',
      ],
    },

    dateTime: {
      type: Date,
      required: [true, 'Appointment date and time is required'],
    },

    status: {
      type: String,
      enum: ['Scheduled', 'Completed'],
      default: 'Scheduled',
    },

    vitals: {
      bp: {
        type: String,
        match: [
          /^\d{2,3}\/\d{2,3}$/,
          'BP must be in format 120/80',
        ],
      },

      temperature: {
        type: String,
      },
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);