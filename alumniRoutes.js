const express = require('express');
const router = express.Router();
const Alumni = require('./models/alumni'); // Make sure to adjust the path based on your project structure

// POST route to add new alumni
router.post('/alumni', async (req, res) => {
    try {
        const alumniData = req.body; // Get the data from the request body

        // Create a new Alumni document
        const newAlumni = new Alumni({
            name: alumniData.Name,
            graduationYear: alumniData['Graduation Year'],
            currentPosition: alumniData['Current Job Title'],
            company: alumniData.Company,
            linkedInProfile: alumniData.LinkedIn_Profile,
            email: alumniData.Email,
            bio: alumniData.Bio,
            photo: alumniData.Photo
        });

        // Save to the database
        await newAlumni.save();
        res.status(201).json({ message: 'Alumni data added successfully!', alumni: newAlumni });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding alumni data', error: error.message });
    }
});

// GET route to fetch all alumni
router.get('/alumni', async (req, res) => {
    try {
        const alumni = await Alumni.find();
        res.json(alumni);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching alumni data', error: error.message });
    }
});

module.exports = router;
