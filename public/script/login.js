router.post('/login', (req, res) => {
    const { hotel, usuario, contrasena } = req.body;

    if (!hotel || !usuario || !contrasena) {
        return res.status(400).send('Faltan datos del formulario');
    }

    connection.query(
      'SELECT * FROM HOTEL WHERE Nombre_hotel = ?',
        [hotel],
        (err, resultsHotel) => {
        if (err) return res.status(500).send('Error al buscar hotel');

        if (resultsHotel.length === 0) {
            return res.status(404).send('Hotel no encontrado');
        }
        connection.query(
          'SELECT * FROM USUARIOS WHERE usuario = ? AND contrasena = ?',
            [usuario, contrasena],
            (err, resultsUsuario) => {
            if (err) return res.status(500).send('Error al buscar usuario');

            if (resultsUsuario.length === 0) {
                return res.status(401).send('Usuario o contraseña incorrectos');
            }
            // ✅ Login exitoso → redirige a dashboard.html
            res.redirect('/dashboard.html');
            }
        );
        }
    );
});
