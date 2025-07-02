const mongoose = require('mongoose');

const permissionschema = new mongoose.Schema({
    role: { type: String, required: true },
    perm: [String]
});

module.exports = mongoose.model('Permissions', permissionschema);