const pool = require('../utils/db');

const getUserInfo = async (req, res) => {
    const { id } = req.user;
    res.json({ id });
};

module.exports = {
    getUserInfo
};
