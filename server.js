const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;
const path = require('path');

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3312tiamu18',
    database: 'StayTrack' 
});

conexion.connect((err) => {
    if (err) {
    console.error('Error al conectar la base de datos:', err);
    return;
    }
    console.log('Conexión a MySQL exitosa');
});

// Ruta para manejar login
app.post('/login', (req, res) => {
    const { hotel, usuario, contrasena } = req.body;
    console.log("Datos recibidos:", { hotel, usuario, contrasena });

    const hotelQuery = `SELECT * FROM HOTEL WHERE Nombre_hotel = ? OR Id_hotel = ?`;

    conexion.query(hotelQuery, [hotel, hotel], (err, hoteles) => {
        if (err) {
            console.error("Error al buscar hotel:", err);
            return res.status(500).json({ error: 'Error al buscar hotel' });
        }

        if (hoteles.length === 0) {
            console.warn("Hotel no encontrado");
            return res.status(401).json({ error: 'Hotel no encontrado' });
        }

        const idHotel = hoteles[0].Id_hotel;
        console.log("Hotel encontrado con ID:", idHotel);

        const usuarioQuery = `SELECT * FROM USUARIO WHERE Usuario = ? AND Id_hotel = ?`;

        conexion.query(usuarioQuery, [usuario, idHotel], (err, usuarios) => {
            if (err) {
                console.error("Error al buscar usuario:", err);
                return res.status(500).json({ error: 'Error al buscar usuario' });
            }

            if (usuarios.length === 0) {
                console.warn("Usuario no encontrado en ese hotel");
                return res.status(401).json({ error: 'Usuario no encontrado en ese hotel' });
            }

            const user = usuarios[0];
            console.log("Usuario encontrado:", user.Usuario);
            console.log("Hash guardado:", user.Contrasena);
            console.log("Contraseña ingresada:", contrasena);

            bcrypt.compare(contrasena, user.Contrasena, (err, result) => {
                if (err) {
                    console.error("Error al comparar contraseñas:", err);
                    return res.status(500).json({ error: 'Error interno' });
                }

                if (result) {
                    console.log("Login exitoso");
                    return res.status(200).json({ mensaje: 'Login exitoso', redirigir: '/dashboard.html' });
                } else {
                    console.warn("Contraseña incorrecta");
                    return res.status(401).json({ error: 'Contraseña incorrecta' });
                }
            });
        });
    });
});

// Registrar un nuevo usuario
app.post('/api/usuarios', async (req, res) => {
    const { nombre_usuario, usuario, contrasena, id_rol, id_hotel } = req.body;

    if (!nombre_usuario || !usuario || !contrasena || !id_rol || !id_hotel) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const sql = `INSERT INTO USUARIO (Nombre_usuario, Usuario, Contrasena, Id_rol, Id_hotel) 
        VALUES (?, ?, ?, ?, ?)`;

        conexion.query(sql, [nombre_usuario, usuario, hashedPassword, id_rol, id_hotel], (err, result) => {
            if (err) {
                console.error("Error al insertar usuario:", err);
                return res.status(500).json({ error: 'Error al crear el usuario' });
            }
            res.json({ mensaje: 'Usuario creado exitosamente' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cifrar la contraseña' });
    }
});

// Obtener todos los usuarios registrados
app.get('/api/usuarios', (req, res) => {
    const sql = `
        SELECT U.Id_usuario, U.Nombre_usuario, U.Usuario, R.Nombre_rol
        FROM USUARIO U
        JOIN ROLES R ON U.Id_rol = R.Id_rol
    `;

    conexion.query(sql, (err, resultados) => {
        if (err) {
            console.error("Error al obtener usuarios:", err);
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        res.json(resultados);
    });
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.put('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, usuario, contrasena, id_rol } = req.body;

    if (!nombre_usuario || !usuario || !id_rol) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        let sql, valores;
        if (contrasena) {
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            sql = `UPDATE USUARIO SET Nombre_usuario = ?, Usuario = ?, Contrasena = ?, Id_rol = ? WHERE Id_usuario = ?`;
            valores = [nombre_usuario, usuario, hashedPassword, id_rol, id];
        } else {
            sql = `UPDATE USUARIO SET Nombre_usuario = ?, Usuario = ?, Id_rol = ? WHERE Id_usuario = ?`;
            valores = [nombre_usuario, usuario, id_rol, id];
        }

        conexion.query(sql, valores, (err, result) => {
            if (err) {
                console.error("Error al actualizar usuario:", err);
                return res.status(500).json({ error: 'Error al actualizar el usuario' });
            }
            res.json({ mensaje: 'Usuario actualizado exitosamente' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM USUARIO WHERE Id_usuario = ?`;

    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar usuario:", err);
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
