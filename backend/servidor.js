const express = require('express');
const cors = require('cors');
const { createUser, authenticateUser, updateUser, getAllUsers } = require('./datos/usuarios-util');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Funciones de ayuda para productos
const productosFile = path.join(__dirname, 'datos', 'productos.json');
function leerProductos() {
  if (!fs.existsSync(productosFile)) return [];
  return JSON.parse(fs.readFileSync(productosFile, 'utf8'));
}
function guardarProductos(productos) {
  fs.writeFileSync(productosFile, JSON.stringify(productos, null, 2));
}

// ================== RUTAS DE PRODUCTOS ==================
app.get('/api/productos', (req, res) => {
  res.json(leerProductos());
});

app.post('/api/productos', (req, res) => {
  const nombre = req.body.nombre;
  const precio = req.body.precio;
  const categoria = req.body.categoria;
  const descripcion = req.body.descripcion;
  const imagen = req.body.imagen;
  const stock = req.body.stock;
  const activo = req.body.activo;

  if (!nombre || !precio || !categoria || !descripcion || !imagen || stock === undefined) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  let productos = leerProductos();
  const nuevoProducto = {
    id: productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1,
    nombre, precio, categoria, descripcion, imagen, stock,
    activo: activo !== undefined ? activo : true
  };
  productos.push(nuevoProducto);
  guardarProductos(productos);
  res.status(201).json({ success: true, producto: nuevoProducto });
});

app.put('/api/productos/:id', (req, res) => {
  const productoId = parseInt(req.params.id, 10);
  let productos = leerProductos();
  const index = productos.findIndex(p => p.id === productoId);
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }
  productos[index] = { ...productos[index], ...req.body };
  guardarProductos(productos);
  res.json({ success: true, producto: productos[index] });
});

app.post('/api/productos/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen.' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// ================== RUTAS DE USUARIOS ==================
app.get('/api/usuarios', (req, res) => {
  res.json(getAllUsers());
});

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

// Servir imágenes estáticas
app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`Servidor API escuchando en http://localhost:${PORT}`);
}); 