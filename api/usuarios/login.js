const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { email, password } = JSON.parse(body);
      const filePath = path.join(process.cwd(), 'backend', 'datos', 'usuarios.json');
      const data = fs.readFileSync(filePath, 'utf8');
      const usuarios = JSON.parse(data);
      const usuario = usuarios.find(u => u.email === email && u.password === password);
      if (usuario) {
        const { password, ...usuarioSinPassword } = usuario;
        res.status(200).json(usuarioSinPassword);
      } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
} 