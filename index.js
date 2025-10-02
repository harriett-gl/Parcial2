const express = require('express');
const fs = require('fs');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

const app = express();
const port = 3000;

// Middleware para errores inesperados
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ "error": "Internal Server Error" });
};

// Carga los datos del archivo libros_1000.json
let libros = [];
try {
    const data = fs.readFileSync('./libros_1000.json', 'utf8');
    libros = JSON.parse(data);
} catch (err) {
    console.error("Error al leer 'libros_1000.json':", err);
    // Este caso se maneja con el middleware de errores global
}

// Middleware para parsear JSON
app.use(express.json());

// Middleware para el manejo de errores global
app.use(errorHandler);

// Rutas de la API REST

// GET /api/libros
// Devuelve la lista completa de libros
app.get('/api/libros', (req, res) => {
    try {
        res.status(200).json(libros); // 200 OK -> Lista obtenida correctamente
    } catch (error) {
        res.status(500).json({ error: 'Error al leer datos' }); // 500 Internal Server Error
    }
});

// GET /api/libros/:id
// Devuelve un libro por su id
app.get('/api/libros/:id', (req, res) => {
    const { id } = req.params;

    // Validación del formato del UUID
    if (!uuidValidate(id)) {
        return res.status(400).json({ error: 'Id inválido' }); // 400 Bad Request
    }

    const libro = libros.find(b => b.id === id);

    if (!libro) {
        return res.status(404).json({ error: 'Libro no existe' }); // 404 Not Found
    }

    res.status(200).json(libro); // 200 OK -> Libro encontrado
});

// POST /api/libros
// Agrega un nuevo libro
app.post('/api/libros', (req, res) => {
    const { title, author, year } = req.body;

    // Validación de campos obligatorios
    if (!title || !author) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (title, author)' }); // 400 Bad Request
    }

    // Validación de duplicados (título y año)
    const libroExistente = libros.find(b => b.title === title && b.year === year);
    if (libroExistente) {
        return res.status(409).json({ error: 'Ya existe un libro con el mismo título y año' }); // 409 Conflict
    }

    // Creación del nuevo libro
    const nuevoLibro = {
        id: uuidv4(),
        title,
        author,
        year: year || null,
    };

    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro); // 201 Created -> Libro creado exitosamente
});

// DELETE /api/libros/:id
// Elimina un libro por su id
app.delete('/api/libros/:id', (req, res) => {
    const { id } = req.params;

    // Validación del formato del UUID
    if (!uuidValidate(id)) {
        return res.status(400).json({ error: 'Id inválido' }); // 400 Bad Request
    }

    const index = libros.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Libro no existe' }); // 404 Not Found
    }

    libros.splice(index, 1);
    res.status(200).json({ message: 'Libro eliminado correctamente' }); // 200 OK -> Libro eliminado correctamente
});


// Inicia el servidor
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});