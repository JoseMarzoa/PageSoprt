const { saveEncryptedUsers, readEncryptedUsers } = require('./db-util');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const USERS_FILE = 'usuarios.json';

function getAllUsers() {
  try {
    return readEncryptedUsers(USERS_FILE) || [];
  } catch (error) {
    console.error('Error leyendo usuarios:', error);
    return [];
  }
}

function saveAllUsers(users) {
  try {
    saveEncryptedUsers(USERS_FILE, users);
    console.log('Usuarios guardados exitosamente');
  } catch (error) {
    console.error('Error guardando usuarios:', error);
    throw error;
  }
}

function createUser({ nombre, apellido, username, email, password, rol = 'Comprador', celular }) {
  try {
    console.log('Creando usuario:', { nombre, apellido, username, email, celular, rol });
    
    const users = getAllUsers();
    if (users.find(u => u.email === email || u.username === username)) {
      throw new Error('El email o username ya está registrado.');
    }
    
    const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const user = { id, nombre, apellido, username, email, celular, password: hashedPassword, rol };
    users.push(user);
    
    saveAllUsers(users);
    console.log('Usuario creado exitosamente:', { id, nombre, email });
    
    return { ...user, password: undefined };
  } catch (error) {
    console.error('Error en createUser:', error);
    throw error;
  }
}

function authenticateUser({ emailOrUsername, password }) {
  try {
    console.log('Autenticando usuario:', { emailOrUsername });
    
    const users = getAllUsers();
    const user = users.find(u => u.email === emailOrUsername || u.username === emailOrUsername);
    
    if (!user) {
      console.log('Usuario no encontrado');
      return null;
    }
    
    const passwordMatch = bcrypt.compareSync(password, user.password);
    console.log('Contraseña coincide:', passwordMatch);
    
    if (!passwordMatch) return null;
    
    return { ...user, password: undefined };
  } catch (error) {
    console.error('Error en authenticateUser:', error);
    return null;
  }
}

function updateUser({ id, nombre, apellido, username, email, celular, password }) {
  try {
    console.log('Actualizando usuario:', { id, nombre, apellido, username, email, celular });
    
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado.');
    }
    
    // Verificar que el email o username no esté en uso por otro usuario
    const existingUser = users.find(u => (u.email === email || u.username === username) && u.id !== id);
    if (existingUser) {
      throw new Error('El email o username ya está en uso por otro usuario.');
    }
    
    // Actualizar datos del usuario
    users[userIndex] = {
      ...users[userIndex],
      nombre,
      apellido,
      username,
      email,
      celular
    };
    
    // Si se proporciona una nueva contraseña, hashearla
    if (password) {
      users[userIndex].password = bcrypt.hashSync(password, 10);
    }
    
    saveAllUsers(users);
    console.log('Usuario actualizado exitosamente:', { id, nombre, email });
    
    return { ...users[userIndex], password: undefined };
  } catch (error) {
    console.error('Error en updateUser:', error);
    throw error;
  }
}

module.exports = {
  getAllUsers,
  createUser,
  authenticateUser,
  updateUser
}; 