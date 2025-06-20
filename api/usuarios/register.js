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
      const nuevoUsuario = JSON.parse(body);
      const filePath = path.join(process.cwd(), 'backend', 'datos', 'usuarios.json');
      const data = fs.readFileSync(filePath, 'utf8');
      const usuarios = JSON.parse(data);
      if (usuarios.find(u => u.email === nuevoUsuario.email)) {
        return res.status(409).json({ error: 'El usuario ya existe' });
      }
      nuevoUsuario.id = usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
      usuarios.push(nuevoUsuario);
      fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));
      const { password, ...usuarioSinPassword } = nuevoUsuario;
      res.status(201).json(usuarioSinPassword);
    } catch (error) {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
} 