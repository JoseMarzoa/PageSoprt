const { getAllUsers } = require('../backend/datos/usuarios-util');

export default function handler(req, res) {
  const users = getAllUsers();
  res.status(200).json(users);
} 