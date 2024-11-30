const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// User Login

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found. Please register.' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Send success response without token
        res.json({ message: 'Login successful', user: { email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

