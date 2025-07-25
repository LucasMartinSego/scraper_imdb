const fs = require('fs');

fs.readFile('./Untitled-1.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        console.log('Contenido del JSON:', jsonData);
    } catch (parseErr) {
        console.error('Error al parsear JSON:', parseErr);
    }
});