const pool = require('./bdconnect');

const saveOrden = async (req, res) => {

    try {
        // PROCEDIMIENTO PARA INSERTAR UNA ORDEN DE SERVICIO CUANDO ---- SI --- SE TENGA COTIZACIÓN PREVIA
        const { id_cotizacion, id_analisis_de_costo, id_cliente, productos } = req.body;

        let cliente;

        let message;

        if (id_cotizacion) {

            const cli = await pool.query(`SELECT id_cliente FROM cotizacion WHERE id_cotizacion = $1`,
                [id_cotizacion]);
            cliente = cli.rows[0];

            await pool.query(`INSERT INTO orden_de_servicio (id_cotizacion, id_analisis_de_costo, id_cliente)
            VALUES ($1,$2,$3)`,
                [id_cotizacion, id_analisis_de_costo, cliente.id_cliente]);

            return res.status(200).json({ message: 'La orden de servicio CON cotizacion previa, fue insertada.' })

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

            return res.status(200).json({ message: 'La orden de servicio SIN cotizacion previa, fue insertada.' })
        }

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e })
    }
};

const getOrdenes = async (req, res) => {

    try {

        let data = [];

        const base = await pool.query(`SELECT * FROM orden_de_servicio`);
        const ordenes_de_servicio = base.rows;

        for (let orden of ordenes_de_servicio) {

            const id_os = orden.id_orden_de_servicio;
            const client_id = orden.id_cliente;
            const id_analisis_de_costo = orden.id_analisis_de_costo;

            let productos;

            const clie = await pool.query(`SELECT * FROM cliente WHERE id_cliente = $1`, 
                [client_id]);
            const cliente = clie.rows[0];

            const mat = await pool.query(`SELECT * FROM materiales_usados WHERE id_analisisdecosto = $1`, 
                [id_analisis_de_costo]);
            const materiales = mat.rows[0];

            const empl = await pool.query(`SELECT * FROM responsables_del_trabajo WHERE id_analisisdecosto = $1`, 
                [id_analisis_de_costo]);
            const empleados = empl.rows[0];

            if (orden.id_cotizacion) {

                const prod = await pool.query(`SELECT * FROM producto WHERE id_cotizacion = $1`,
                    [orden.id_cotizacion]);

                productos = prod.rows;

            }else {

                const prod = await pool.query(`SELECT * FROM producto WHERE id_os = $1`,
                    [id_os]);

                productos = prod.rows;

            }

            data = [...data, {orden, cliente, materiales, empleados, productos}];

        }

        return res.status(200).json({ data });

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e })
    }

}

const deleteOrden = async (req, res) => {

    try {

        const id = req.params.id;

        await pool.query(`DELETE FROM orden_de_servicio WHERE id_orden_de_servicio = $1`,
            [id]);

        return res.status(200).json({ message: 'La orden de servicio con id: ' + id + ' fue eliminada' })

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e })
    }

}

const updateOrden = async (req, res) => {

    try {
        // PROCEDIMIENTO PARA ACTUALIZAR UNA ORDEN DE SERVICIO CUANDO ---- SI --- SE TENGA COTIZACIÓN PREVIA
        const { id_os, id_cotizacion, id_analisis_de_costo, id_cliente, productos } = req.body;

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