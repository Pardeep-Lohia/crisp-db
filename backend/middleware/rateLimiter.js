// prevent API abuse by limiting request rate
const rateLimit = require('express-rate-limit');
module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later."
    }
});
        res.status(500).json({
            success: false,
            message: error.message
        });
// --- IGNORE ---
// catches and format all errors

module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred. Please try again later.'
    });
};