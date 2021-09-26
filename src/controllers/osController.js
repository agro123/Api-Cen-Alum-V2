const pool = require('./bdconnect');

const saveOrden = async (req, res) => {

    try {
        const { id_cotizacion, id_analisis_de_costo, id_cliente, productos, materiales } = req.body;

        var cliente;

        if (id_cotizacion) {

            const cli = await pool.query(`SELECT id_cliente FROM cotizacion WHERE id_cotizacion = $1`,
                [id_cotizacion]);
            cliente = cli.rows[0];

            await pool.query(`INSERT INTO orden_de_servicio (id_cotizacion, id_analisis_de_costo, id_cliente)
            VALUES ($1,$2,$3)`,
                [id_cotizacion, id_analisis_de_costo, cliente]);

            return res.satus(200).json({ message: 'La orden de servicio con COTIZACION previa, fue insertada.' })

        } else {
            await pool.query(`INSERT INTO orden_de_servicio (id_cotizacion, id_analisis_de_costo, id_cliente)
            VALUES ($1,$2,$3)`,
                [id_cotizacion, id_analisis_de_costo, id_cliente]);

            return res.satus(200).json({ message: 'La orden de servicio SIN cotizacion previa, fue insertada.' })
        }

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e })
    }
};

const getOrden = async (req, res) => {

    try {

        const base = await pool.query(`SELECT * FROM orden_de_servicio`);
        const ordenes_de_servicio = base.rows;

        return res.status(200).json({ ordenes_de_servicio });

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e })
    }

}

const deleteOrden = async (req, res) => {

    try {

        const id_orden_de_servicio = req.params.id;
        
        await pool.query(`DELETE FROM orden_de_servicio WHERE id_orden_de_servicio = $1`,
        [id_orden_de_servicio]);

        return res.status(200).json({message: 'La orden de servicio con id: '+id_orden_de_servicio+ ' fue eliminada'})

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e })
    }

}

module.exports = {
    saveOrden,
    getOrden,
    deleteOrden
}