const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createUser, authenticateUser, updateUser } = require('./datos/usuarios-util');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de almacenamiento para imágenes
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Productos (almacenados en archivo JSON)
const productosFile = path.join(__dirname, 'datos', 'productos.json');
function leerProductos() {
  if (!fs.existsSync(productosFile)) return [];
  return JSON.parse(fs.readFileSync(productosFile, 'utf8'));
}
function guardarProductos(productos) {
  fs.writeFileSync(productosFile, JSON.stringify(productos, null, 2));
}

// Registro de usuario
app.post('/api/usuarios/register', (req, res) => {
  try {
    console.log('Registro recibido:', req.body);
    const { nombre, apellido, username, email, celular, password } = req.body;
    
    if (!nombre || !apellido || !username || !email || !celular || !password) {
      console.log('Campos faltantes:', { nombre, apellido, username, email, celular, password: password ? '***' : 'FALTANTE' });
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    
    const user = createUser({ nombre, apellido, username, email, password, rol: 'Comprador', celular });
    console.log('Usuario creado exitosamente en endpoint');
    res.json({ success: true, user });
  } catch (e) {
    console.error('Error en endpoint register:', e);
    res.status(400).json({ error: e.message });
  }
});

// Login de usuario
app.post('/api/usuarios/login', (req, res) => {
  try {
    console.log('Login recibido:', { email: req.body.email, password: req.body.password ? '***' : 'FALTANTE' });
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Email o password faltantes');
      return res.status(400).json({ error: 'Email y contraseña requeridos.' });
    }
    
    const user = authenticateUser({ emailOrUsername: email, password });
    if (!user) {
      console.log('Autenticación fallida');
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }
    
    console.log('Login exitoso para:', user.email);
    res.json({ success: true, user });
  } catch (e) {
    console.error('Error en endpoint login:', e);
    res.status(400).json({ error: e.message });
  }
});

// Actualizar perfil de usuario
app.put('/api/usuarios/update', (req, res) => {
  try {
    console.log('Actualización recibida:', req.body);
    const { id, nombre, apellido, username, email, celular, password } = req.body;
    
    if (!id || !nombre || !apellido || !username || !email || !celular) {
      console.log('Campos faltantes en actualización');
      return res.status(400).json({ error: 'Todos los campos son obligatorios excepto la contraseña.' });
    }
    
    const user = updateUser({ id, nombre, apellido, username, email, celular, password });
    console.log('Usuario actualizado exitosamente');
    res.json({ success: true, user });
  } catch (e) {
    console.error('Error en endpoint update:', e);
    res.status(400).json({ error: e.message });
  }
});

// Endpoint para subir imagen
app.post('/api/productos/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen.' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Endpoint para crear producto
app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria, descripcion, imagen, stock, activo } = req.body;
  if (!nombre || !precio || !categoria || !descripcion || !imagen || stock === undefined) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  let productos = leerProductos();
  const nuevoProducto = {
    id: productos.length ? productos[productos.length - 1].id + 1 : 1,
    nombre,
    precio,
    categoria,
    descripcion,
    imagen,
    stock,
    activo: activo !== undefined ? activo : true
  };
  productos.push(nuevoProducto);
  guardarProductos(productos);
  res.json({ success: true, producto: nuevoProducto });
});

// Servir imágenes estáticas
app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`Servidor API escuchando en http://localhost:${PORT}`);
}); 