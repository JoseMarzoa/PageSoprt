const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const usersFile = path.join(__dirname, 'usuarios.json');
const aescipher = 'aes-256-cbc';
const key = crypto.scryptSync('SportFlexKey2024!', 'salt', 32);

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const fileContent = fs.readFileSync(usersFile, 'utf8');
  if (!fileContent || fileContent.trim() === '[]' || fileContent.trim() === '') return [];
  
  try {
    const { iv, data } = JSON.parse(fileContent);
    if (!iv || !data) return []; // Archivo JSON sin formato esperado
    const decipher = crypto.createDecipheriv(aescipher, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("Error al leer o descifrar usuarios.json, se devolverá un array vacío.", e);
    return [];
  }
}

function writeUsers(users) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(aescipher, key, iv);
  let encrypted = cipher.update(JSON.stringify(users, null, 2), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  fs.writeFileSync(usersFile, JSON.stringify({ iv: iv.toString('hex'), data: encrypted }));
}

function getAllUsers() {
  const users = readUsers();
  // No devolver las contraseñas
  return users.map(({ password, ...user }) => user);
}

function createUser({ nombre, apellido, username, email, password, rol, celular }) {
  try {
    const users = readUsers();
    if (users.find(u => u.email === email || u.username === username)) {
      throw new Error('El email o nombre de usuario ya existe.');
    }
    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      nombre, apellido, username, email, password, rol, celular
    };
    users.push(newUser);
    writeUsers(users);
    const { password: _, ...userToReturn } = newUser;
    return userToReturn;
  } catch (e) {
    console.error('Error en createUser:', e);
    throw e;
  }
}

function authenticateUser({ emailOrUsername, password }) {
  const users = readUsers();
  const user = users.find(u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password);
  if (!user) return null;
  const { password: _, ...userToReturn } = user;
  return userToReturn;
}

function updateUser({ id, nombre, apellido, username, email, celular, password }) {
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado.');
  }
  const updatedUser = { ...users[userIndex], nombre, apellido, username, email, celular };
  if (password) {
    updatedUser.password = password;
  }
  users[userIndex] = updatedUser;
  writeUsers(users);
  const { password: _, ...userToReturn } = updatedUser;
  return userToReturn;
}

module.exports = {
  createUser,
  authenticateUser,
  updateUser,
  getAllUsers,
}; 