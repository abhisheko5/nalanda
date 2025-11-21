const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const encryptToken = (token) => {
  return CryptoJS.AES.encrypt(token, process.env.JWT_ENCRYPTION_KEY).toString();
};

const decryptToken = (encryptedToken) => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.JWT_ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
  return encryptToken(token);
};

const verifyToken = (encryptedToken) => {
  try {
    const token = decryptToken(encryptedToken);
    if (!token) throw new Error('Invalid token');
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generateToken, verifyToken, encryptToken, decryptToken };