const usersModels = require('../models/users');

async function allUsers(req, res) {
    try {
        const allUsers = await usersModels.findAll();
        res.json({
            allUsers
        });
    } catch (error) {
        console.error(error)
    }
}

async function getUserById(req, res) {
    try {
        const id = req.params.id;

        const user = await usersModels.findByPk(id);

        if (!user) {
            return res.status(404).json({message : "User not found"});
        }

        res.json({
            user
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    allUsers,
    getUserById
};