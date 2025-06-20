const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'backend', 'datos', 'productos.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const productos = JSON.parse(data);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron cargar los productos.' });
  }
} 