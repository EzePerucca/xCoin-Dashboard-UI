const express = require('express');
var path = require('path');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'dist/blockchain-dashboard')));

// Todas las rutas serán redirigidas a la aplicación angular
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/blockchain-dashboard/index.html'));
});

app.listen(port, () => {
    console.log('Servidor iniciado');
    console.log(port)
});