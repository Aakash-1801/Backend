const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  role: { type: String, default: 'User' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  course: { type: String, required: true },
  phone: { type: String, required: true },
  typpe: { type: String, required: true },
  address: { type: String, required: true },
  profilePic: { type: String },
  resetToken: {type: String},
  resetTokenExpires: {type: Date}
});

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

module.exports = mongoose.model('User', userSchema);