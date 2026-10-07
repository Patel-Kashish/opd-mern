const router = require('express').Router();
const Patient = require('../models/Patient');

// Add patient
router.post('/', async (req, res) => {
  try {
    const { name, gender, age, phone } = req.body;

    if (!name || !gender || age === undefined || !phone) {
      return res.status(400).json({
        message: 'Name, gender, age and phone are required',
      });
    }

    const patient = await Patient.create({
      name: name.trim(),
      gender,
      age: Number(age),
      phone: phone.trim(),
    });

    res.status(201).json(patient);
  } catch (err) {
    console.error('Add patient error:', err);

    res.status(400).json({
      message: err.message,
    });
  }
});

// Get patients / search patients
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';

    const patients = await Patient.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    res.json(patients);
  } catch (err) {
    console.error('Get patients error:', err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;