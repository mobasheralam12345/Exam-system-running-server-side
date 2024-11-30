const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// User registration controller
exports.registerUser = async (req, res) => {
    const { name, email, password} = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create a new user
        const newUser = new User({ name, email, password });

        // Save user to the database
        await newUser.save();

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });
    } catch (error) {
        console.error('Error in registration:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};
