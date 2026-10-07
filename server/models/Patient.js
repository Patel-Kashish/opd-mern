const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      minlength: [2, 'Patient name must be at least 2 characters'],
      maxlength: [100, 'Patient name cannot exceed 100 characters'],
      match: [
        /^[A-Za-z][A-Za-z .'-]*$/,
        'Patient name contains invalid characters',
      ],
    },

    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: 'Invalid gender',
      },
      required: [true, 'Gender is required'],
    },

    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [120, 'Please enter a valid age'],
      validate: {
        validator: Number.isInteger,
        message: 'Age must be a whole number',
      },
    },

    phone: {
  type: String,
  required: [true, 'Phone number is required'],
  trim: true,
  match: [
    /^\d{10}$/,
    'Phone number must contain exactly 10 digits',
  ],
},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);