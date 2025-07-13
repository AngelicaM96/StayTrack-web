const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    const conexion = req.app.locals.conexion;

    const sql = `SELECT * FROM GESTION_RESERVAS`;

    conexion.query(sql, (err, resultados) => {
        if (err) {
            console.error('Error al obtener reservas:', err);
            return res.status(500).json({ error: 'Error al consultar reservas' });
        }

        res.json(resultados);
    });
});

// Se crea una nueva reserva
router.post('/', (req, res) => {
    const conexion = req.app.locals.conexion;
    const {
        checkIn_reservas,
        checkOut_reservas,
        cedula_reserva,
        nombre_reserva,
        apellido_reserva,
        telefono_reserva,
        ciudad_reserva,
        correo_reserva,
        Id_habitacion,
        Id_hotel
    } = req.body;

    if (!checkIn_reservas || !checkOut_reservas || !cedula_reserva || !nombre_reserva || !apellido_reserva || !telefono_reserva || !ciudad_reserva || !correo_reserva || !Id_habitacion || !Id_hotel) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `
        INSERT INTO GESTION_RESERVAS (
            checkIn_reservas, checkOut_reservas, cedula_reserva, nombre_reserva,
            apellido_reserva, telefono_reserva, ciudad_reserva, correo_reserva,
            Id_habitacion, Id_hotel
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        checkIn_reservas,
        checkOut_reservas,
        cedula_reserva,
        nombre_reserva,
        apellido_reserva,
        telefono_reserva,
        ciudad_reserva,
        correo_reserva,
        Id_habitacion,
        Id_hotel
    ];

    conexion.query(sql, valores, (err, result) => {
        if (err) {
            console.error('Error al insertar reserva:', err);
            return res.status(500).json({ error: 'Error al guardar la reserva' });
        }

        res.status(201).json({ mensaje: 'Reserva creada exitosamente' });
    });
});


router.put('/:id', (req, res) => {
    const reservaId = req.params.id;
    const conexion = req.app.locals.conexion;

    
    const buscarSQL = `SELECT Id_habitacion FROM GESTION_RESERVAS WHERE Id_reservas = ?`;

    conexion.query(buscarSQL, [reservaId], (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error al buscar la reserva' });
        if (resultados.length === 0) return res.status(404).json({ error: 'Reserva no encontrada' });

        const idHabitacion = resultados[0].Id_habitacion;

        
        const actualizarSQL = `UPDATE GESTION_HABITACIONES SET Id_estado = 2 WHERE Id_habitacion = ?`;

        conexion.query(actualizarSQL, [idHabitacion], (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar habitación' });

            
            const eliminarSQL = `DELETE FROM GESTION_RESERVAS WHERE Id_reservas = ?`;

            conexion.query(eliminarSQL, [reservaId], (err) => {
                if (err) return res.status(500).json({ error: 'Error al eliminar reserva' });

                return res.json({ mensaje: 'Reserva hecha efectiva y habitación actualizada' });
            });
        });
    });
});

module.exports = router;



router.delete('/:id', (req, res) => {
    const conexion = req.app.locals.conexion;
    const reservaId = req.params.id;

    const sql = `DELETE FROM GESTION_RESERVAS WHERE Id_reservas = ?`;

    conexion.query(sql, [reservaId], (err) => {
        if (err) {
            console.error('Error al eliminar reserva:', err);
            return res.status(500).json({ error: 'Error al eliminar la reserva' });
        }

        res.json({ mensaje: 'Reserva cancelada correctamente' });
    });
});

module.exports = router;
