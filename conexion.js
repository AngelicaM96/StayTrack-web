
const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',           
    user: 'root',                
    password: '3312tiamu18',   
    database: 'StayTrack'      
});

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

module.exports = conexion;
