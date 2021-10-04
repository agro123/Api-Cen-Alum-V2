const pool = require('./bdconnect');

const saveOrden = async (req, res) => {

    try {
        // PROCEDIMIENTO PARA INSERTAR UNA ORDEN DE SERVICIO CUANDO ---- SI --- SE TENGA COTIZACIÓN PREVIA
        const { id_cotizacion, id_analisis_de_costo, id_cliente, productos } = req.body;

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
            // PROCEDIMIENTO PARA INSERTAR UNA ORDEN DE SERVICIO CUANDO ---- NO ----- SE TENGA COTIZACIÓN PREVIA
            await pool.query(`INSERT INTO orden_de_servicio (id_cotizacion, id_analisis_de_costo, id_cliente)
            VALUES ($1,$2,$3)`,
                [id_cotizacion, id_analisis_de_costo, id_cliente]);

            const id_os = await pool.query(`SELECT last_value FROM producto_id_producto_seq`);
            // INSERSIÓN DE LOS PRODUCTOS EN RELACIÓN CON LA ORDEN DE SERVICIO, SIN COTIZACIÓN
            for (let producto of productos) {

                await pool.query(`INSERT INTO producto (descripcion, precio_unidad, ancho, alto, area, preciototal, cantidad, id_os) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [producto.descripcion, producto.precio_unidad, producto.ancho,
                producto.alto, producto.area, producto.preciototal, producto.cantidad, id_os]);

            }

            return res.satus(200).json({ message: 'La orden de servicio SIN cotizacion previa, fue insertada.' })
        }

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e })
    }
};

const getOrdenes = async (req, res) => {

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

        return res.status(200).json({ message: 'La orden de servicio con id: ' + id_orden_de_servicio + ' fue eliminada' })

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e })
    }

}

const updateOrden = async (req, res) => {

    try {
        // PROCEDIMIENTO PARA ACTUALIZAR UNA ORDEN DE SERVICIO CUANDO ---- SI --- SE TENGA COTIZACIÓN PREVIA
        const { id_os ,id_cotizacion, id_analisis_de_costo, id_cliente, productos } = req.body;

        let cliente;

        if (id_cotizacion) {

            const cli = await pool.query(`SELECT id_cliente FROM cotizacion WHERE id_cotizacion = $1`,
                [id_cotizacion]);
            cliente = cli.rows[0];

            await pool.query(`UPDATE orden_de_servicio  SET id_cotizacion = $1, id_analisis_de_costo = $2, id_cliente = $3`,
                [id_cotizacion, id_analisis_de_costo, cliente]);

            return res.satus(200).json({ message: 'La orden de servicio con COTIZACION previa, fue actualizada.' })

        } else {
            // PROCEDIMIENTO PARA ACTUALIZAR UNA ORDEN DE SERVICIO CUANDO ---- NO ----- SE TENGA COTIZACIÓN PREVIA
            await pool.query(`UPDATE orden_de_servicio  SET id_analisis_de_costo = $1, id_cliente = $2`,
                [id_analisis_de_costo, id_cliente]);

            await pool.query(`DELETE * FROM producto WHERE id_os = $1`, [id_os]);

            for (let producto of productos) {

                await pool.query(`INSERT INTO producto (descripcion, precio_unidad, ancho, alto, area, preciototal, cantidad, id_os) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [producto.descripcion, producto.precio_unidad, producto.ancho,
                producto.alto, producto.area, producto.preciototal, producto.cantidad, id_os]);

            }

            return res.satus(200).json({ message: 'La orden de servicio SIN cotizacion previa, fue actualizada.' })
        }

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e })
    }

};

module.exports = {
    saveOrden,
    getOrdenes,
    deleteOrden,
    updateOrden
}