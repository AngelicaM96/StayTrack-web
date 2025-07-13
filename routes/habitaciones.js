const express = require('express');
const router = express.Router();

router.get('/api/habitaciones', (req, res) => {
    const conexion = req.app.locals.conexion;

    const query = `
        SELECT 
            gh.Id_habitacion AS id,
            gh.Numero_habitacion AS numero,
            eh.Id_estado AS estado,
            rh.cedula_huesped,
            rh.Nombre_huesped,
            rh.Apellido_huesped,
            rh.Telefono_huesped,
            rh.Ciudad_huesped,
            rh.Correo_huesped,
            gr.cedula_reserva,
            gr.nombre_reserva,
            gr.apellido_reserva,
            gr.telefono_reserva,
            gr.ciudad_reserva,
            gr.correo_reserva,
            gr.valor_noche

        FROM gestion_habitaciones gh
        LEFT JOIN estado_habitacion eh ON gh.Id_estado = eh.Id_estado
        LEFT JOIN registro_huespedes rh ON rh.Id_habitacion = gh.Id_habitacion
        LEFT JOIN gestion_reservas gr ON gr.Id_habitacion = gh.Id_habitacion
        ORDER BY gh.Id_habitacion ASC;
    `;

    conexion.query(query, (err, resultados) => {
        if (err) {
            console.error('Error al obtener habitaciones:', err);
            return res.status(500).json({ error: 'Error al obtener habitaciones' });
        }

        const habitaciones = resultados.map((fila) => {
            let estado = 'disponible';
            if (fila.estado === 2) estado = 'ocupada';
            else if (fila.estado === 3) estado = 'sucia';

            const habitacion = {
                id: fila.id,
                numero: fila.numero,
                estado: estado
            };

            if (estado === 'ocupada' && (fila.Nombre_huesped || fila.nombre_reserva)) {
                habitacion.huesped = {
                    cedula: fila.Nombre_huesped ? fila.cedula_huesped : fila.cedula_reserva,
                    nombre: fila.Nombre_huesped ? fila.Nombre_huesped : fila.nombre_reserva,
                    apellido: fila.Nombre_huesped ? fila.Apellido_huesped : fila.apellido_reserva,
                    telefono: fila.Nombre_huesped ? fila.Telefono_huesped : fila.telefono_reserva,
                    ciudad: fila.Nombre_huesped ? fila.Ciudad_huesped : fila.ciudad_reserva,
                    correo: fila.Nombre_huesped ? fila.Correo_huesped : fila.correo_reserva,
                    valorNoche: fila.valor_noche || 0
                };

                habitacion.noches = 1;
                habitacion.productos = [];
            }

            return habitacion;
        });

        res.json(habitaciones);
    });
});

router.post('/api/habitaciones', (req, res) => {
    const conexion = req.app.locals.conexion;
    const { numero_habitacion, id_estado, id_hotel } = req.body;

    
    const verificarQuery = `
        SELECT * FROM gestion_habitaciones 
        WHERE numero_habitacion = ? AND Id_hotel = ?
    `;

    conexion.query(verificarQuery, [numero_habitacion, id_hotel], (err, resultados) => {
        if (err) {
            console.error("Error al verificar habitación:", err);
            return res.status(500).json({ error: 'Error al verificar habitación' });
        }

        if (resultados.length > 0) {
            return res.status(409).json({ error: 'El número de habitación ya existe en este hotel' });
        }

        
        const insertQuery = `
            INSERT INTO gestion_habitaciones (numero_habitacion, Id_estado, Id_hotel)
            VALUES (?, ?, ?)
        `;

        conexion.query(insertQuery, [numero_habitacion, id_estado, id_hotel], (err, result) => {
            if (err) {
                console.error("Error al agregar habitación:", err);
                return res.status(500).json({ error: 'Error al agregar habitación' });
            }
            res.json({ mensaje: 'Habitación agregada correctamente' });
        });
    });
});

router.put('/api/habitaciones/:id/estado', (req, res) => {
    const conexion = req.app.locals.conexion;
    const idHabitacion = req.params.id;
    const nuevoEstado = req.body.estado;

    const query = `UPDATE gestion_habitaciones SET Id_estado = ? WHERE Id_habitacion = ?`;
    conexion.query(query, [nuevoEstado, idHabitacion], (err, resultado) => {
        if (err) {
            console.error('Error al actualizar estado de habitación:', err);
            return res.status(500).json({ error: 'Error al actualizar estado' });
        }

        res.json({ mensaje: 'Estado actualizado correctamente' });
    });
});

router.delete('/api/habitaciones/:id', (req, res) => {
    const conexion = req.app.locals.conexion;
    const idHabitacion = req.params.id;

    const sql = `DELETE FROM gestion_habitaciones WHERE Id_habitacion = ?`;
    conexion.query(sql, [idHabitacion], (err, result) => {
        if (err) {
            console.error("Error al eliminar habitación:", err);
            return res.status(500).json({ error: 'Error al eliminar habitación' });
        }
        res.json({ mensaje: 'Habitación eliminada correctamente' });
    });
});

router.post('/api/facturas', (req, res) => {
    const conexion = req.app.locals.conexion;
    const {
        Nit_cedula,
        Id_habitacion,
        Id_cliente,
        nombre_cliente,
        noches,
        valor_noche,
        valor_productos,
        total_pago,
        Id_hotel
    } = req.body;

    const sql = `
        INSERT INTO GESTION_FACTURAS 
        (Nit_cedula, Id_habitacion, Id_cliente, nombre_cliente, noches, valor_noche, valor_productos, total_pago, Id_hotel)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [Nit_cedula, Id_habitacion, Id_cliente, nombre_cliente, noches, valor_noche, valor_productos, total_pago, Id_hotel];

    conexion.query(sql, valores, (err, resultado) => {
        if (err) {
            console.error('Error al guardar factura:', err);
            return res.status(500).json({ error: 'Error al guardar factura' });
        }

        res.json({ mensaje: 'Factura guardada correctamente' });
    });
});


router.post('/api/habitaciones/:id/checkout', (req, res) => {
    const conexion = req.app.locals.conexion;
    const idHabitacion = req.params.id;

    
    conexion.query('DELETE FROM registro_huespedes WHERE Id_habitacion = ?', [idHabitacion], (err) => {
        if (err) {
            console.error('Error al eliminar huésped:', err);
            return res.status(500).json({ error: 'Error al eliminar huésped en checkout' });
        }

        
        conexion.query('UPDATE gestion_habitaciones SET Id_estado = 3 WHERE Id_habitacion = ?', [idHabitacion], (err) => {
            if (err) {
                console.error('Error al actualizar estado en checkout:', err);
                return res.status(500).json({ error: 'Error al actualizar estado en checkout' });
            }

            res.json({ mensaje: 'Check-out realizado. Habitación marcada como sucia.' });
        });
    });
});

router.delete('/api/huespedes/:idHabitacion', (req, res) => {
    const conexion = req.app.locals.conexion;
    const idHabitacion = req.params.idHabitacion;

    conexion.query('DELETE FROM registro_huespedes WHERE Id_habitacion = ?', [idHabitacion], (err, result) => {
        if (err) {
            console.error('Error al eliminar huésped:', err);
            return res.status(500).json({ error: 'Error al eliminar huésped' });
        }
        res.json({ mensaje: 'Huésped eliminado' });
    });
});

router.get('/api/facturas', (req, res) => {
    const conexion = req.app.locals.conexion;

    const sql = `SELECT * FROM GESTION_FACTURAS ORDER BY fecha DESC`;

    conexion.query(sql, (err, resultado) => {
        if (err) {
            console.error('Error al obtener facturas:', err);
            return res.status(500).json({ error: 'Error al obtener facturas' });
        }

        res.json(resultado); 
    });
});

module.exports = router;
