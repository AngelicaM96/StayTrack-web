const express = require('express');
const router = express.Router();

router.post('/api/facturas', (req, res) => {
    const conexion = req.app.locals.conexion;
    const {
        nit_cedula,
        nombre_cliente,
        noches,
        valor_noche,
        valor_productos,
        total_pago,
        id_habitacion,
        id_hotel
    } = req.body;

    // Validación simple
    if (!nit_cedula || !nombre_cliente || !total_pago || !id_habitacion || !id_hotel) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const query = `
        INSERT INTO gestion_facturas (
            Nit_cedula, nombre_cliente, noches, valor_noche, 
            valor_productos, total_pago, Id_habitacion, Id_hotel
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        nit_cedula,
        nombre_cliente,
        noches,
        valor_noche,
        valor_productos,
        total_pago,
        id_habitacion,
        id_hotel
    ];

    conexion.query(query, valores, (err, resultado) => {
        if (err) {
            console.error(' Error al guardar la factura:', err);
            return res.status(500).json({ error: 'Error al guardar la factura' });
        }

        console.log(`✅ Factura registrada con ID: ${resultado.insertId}`);

        res.json({
            mensaje: 'Factura registrada correctamente',
            id_factura: resultado.insertId
        });
    });
});

router.get('/api/facturas', (req, res) => {
    const conexion = req.app.locals.conexion;

    const sql = `
        SELECT 
            id_factura,
            Nit_cedula,
            nombre_cliente,
            noches,
            valor_noche,
            valor_productos,
            total_pago,
            Id_habitacion,
            Id_hotel,
            fecha
        FROM gestion_facturas
        ORDER BY fecha DESC
    `;

    conexion.query(sql, (err, resultados) => {
        if (err) {
            console.error(' Error al obtener facturas:', err);
            return res.status(500).json({ error: 'Error al obtener facturas' });
        }

        if (resultados.length === 0) {
            console.warn('⚠ No se encontraron facturas registradas');
        } else {
            console.log(`📦 ${resultados.length} factura(s) recuperadas`);
        }

        res.json(resultados);
    });
});

module.exports = router;
