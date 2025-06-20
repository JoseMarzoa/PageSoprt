const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Clave fija de exactamente 32 bytes para AES-256
const SECRET_KEY = Buffer.from('12345678901234567890123456789012', 'utf8'); // 32 bytes exactos
const IV_LENGTH = 16; // AES block size

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function saveEncryptedJson(filename, data) {
  const json = JSON.stringify(data, null, 2);
  const encrypted = encrypt(json);
  fs.writeFileSync(path.join(__dirname, filename), encrypted, 'utf8');
}

function readEncryptedJson(filename) {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) return null;
  const encrypted = fs.readFileSync(filePath, 'utf8');
  const decrypted = decrypt(encrypted);
  return JSON.parse(decrypted);
}

// Nuevas funciones para manejar usuarios individuales encriptados
function saveEncryptedUsers(filename, users) {
  const filePath = path.join(__dirname, filename);
  const lines = users.map(user => {
    const userJson = JSON.stringify(user);
    return encrypt(userJson);
  });
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

function readEncryptedUsers(filename) {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) return [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.trim()) return [];
    
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map(line => {
      try {
        const decrypted = decrypt(line);
        return JSON.parse(decrypted);
      } catch (error) {
        console.error('Error decrypting user line:', error);
        return null;
      }
    }).filter(user => user !== null);
  } catch (error) {
    console.error('Error reading encrypted users file:', error);
    return [];
  }
}

module.exports = {
  saveEncryptedJson,
  readEncryptedJson,
  saveEncryptedUsers,
  readEncryptedUsers
}; 