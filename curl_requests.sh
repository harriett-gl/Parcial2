
# Obtener todos los libros
curl http://localhost:3000/api/libros

# Obtener un libro por id (asegúrate de usar un id válido del archivo libros_1000.json)
# Ejemplo con un ID de "Cien años de soledad"
curl http://localhost:3000/api/libros/831ceef8-7ea0-44d5-94ce-58c502a8ad4c

# Crear un nuevo libro
curl -X POST -H "Content-Type: application/json" -d '{ "title": "El Hobbit", "author": "J.R.R. Tolkien", "year": 1937 }' http://localhost:3000/api/libros

# Eliminar un libro por id (asegúrate de usar un id válido)
# Ejemplo con el mismo ID usado en el ejemplo de GET
curl -X DELETE http://localhost:3000/api/libros/831ceef8-7ea0-44d5-94ce-58c502a8ad4c