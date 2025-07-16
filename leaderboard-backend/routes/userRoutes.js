const express = require('express');
const router = express.Router();
const User = require('../models/User');
const History = require('../models/History');

// ✅ Create a new user
router.post('/users', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const user = new User({ name, totalPoints: 0 });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all users with ranking
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ totalPoints: -1 });
        const rankedUsers = users.map((user, index) => ({
            ...user.toObject(),
            rank: index + 1
        }));

        res.json(rankedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Claim random points (1–10) for a user
router.post('/claim/:userId', async (req, res) => {
    const { userId } = req.params;
    const points = Math.floor(Math.random() * 10) + 1;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { totalPoints: points } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const history = new History({ userId, points });
        await history.save();

        res.json({ user, points });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all claim history with user names
router.get('/history', async (req, res) => {
    try {
        const history = await History.find()
            .populate('userId', 'name')
            .sort({ timestamp: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
