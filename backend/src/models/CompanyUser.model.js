import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const companyUserSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },

    username: { type: String, required: true },

    email: { type: String, required: true },

    password_hash: { type: String, required: true },

    role: {
      type: String,
      enum: ['super_admin', 'company_admin', 'company_agent'],
      required: true,
    },

    is_online: { type: Boolean, default: false },

    refresh_token: { type: String, default: null },
  },
  { timestamps: true }
);

companyUserSchema.index({ company_id: 1, email: 1 }, { unique: true });
companyUserSchema.index({ company_id: 1, username: 1 }, { unique: true });

companyUserSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 10);
  next();
});

companyUserSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

companyUserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, company_id: this.company_id, role: this.role },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: process.env.ACCESS_SECRET_EXPIRY }
  );
};

companyUserSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: process.env.REFRESH_SECRET_EXPIRY,
  });
};

export const CompanyUser = mongoose.model('CompanyUser', companyUserSchema);
