const bcrypt = require('bcryptjs');
const AdminUser = require('../models/admin.model');

exports.adminlogin = async (req, res) => {
    
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    try {
        // Check if the user exists
        // const user = await AdminUser.find();
        const user = await AdminUser.findOne({ email });
        console.log(user);
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







  