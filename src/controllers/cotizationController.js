const pool = require('./bdconnect');

const getCotizaciones = async (req, res) => {
    try {

        const cot = await pool.query(`SELECT * FROM cotizacion`);
        const cotizaciones = cot.rows;

        const prod = await pool.query(`SELECT * FROM producto`);
        const productos = prod.rows;

        const dataCotizaciones = { cotizaciones, productos };

        return res.status(200).json(dataCotizaciones);

    }
    catch (e) {
        return res.status(500).json({ messaje: ` Ocurrió un error con el servidor: ` + e })
    }
};

const saveCotizacion = async (req, res) => {

    try {

        const { id_cliente, observaciones, total, id_analisisdecosto, productos } = req.body;

        // VALIDAR SI VIENE UN ID_ANALISIS DE COSTO Y OMITIRLO O NO EN EL QUERY
        if (id_analisisdecosto) {

            await pool.query(`INSERT INTO cotizacion (id_cliente, observaciones, total, id_analisisdecosto) 
                VALUES ($1, $2, $3, $4)`,
                [id_cliente, observaciones, total, id_analisisdecosto]);

        } else {

            await pool.query(`INSERT INTO cotizacion (id_cliente, observaciones, total)
                VALUES ($1, $2, $3)`,
                [id_cliente, observaciones, total]);

        }

        // OBTENGO EL VALOR ID DE LA COTIZACION QUE ACABO DE CREAR PARA REFERENCIAR LOS 
        // PRODUCTOS SIGUIENTES

        const result = await pool.query(`SELECT last_value FROM analisisdecosto_id_analisisdecosto_seq`);
        const id_cotizacion = parseInt(result.rows[0].last_value);

        // SACO TODOS LOS ATRIBUTOS DEL ARREGLO PRODUCTOS Y LOS INSERTO UNO POR UNO
        for (let i = 0; i < productos.length; i++) {

            const producto = {
                descripcion_prod: productos[i].descripcion_prod,
                precio_unidad: productos[i].precio_unidad,
                ancho: productos[i].ancho,
                alto: productos[i].alto,
                area: productos[i].area,
                preciototal: productos[i].preciototal,
                cantidad: productos[i].cantidad
            }

            await pool.query(`INSERT INTO producto (descripcion, precio_unidad, id_cotizacion, ancho,
                alto, area, preciototal, cantidad) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
                [producto.descripcion_prod, producto.precio_unidad, id_cotizacion, producto.ancho,
                producto.alto, producto.area, producto.preciototal, producto.cantidad]);

        }

        return res.status(200).json(req.body);

    } catch (e) {
        return res.status(500).json({ messaje: ` Ocurrió un error con el servidor: ` + e })
    }

};

const updateCotizacion = async (req, res) => {


    try {

        const { id_cliente, observaciones, total, id_analisisdecosto, productos } = req.body;
        const id_cotizacion = req.params.id;

        // ACTUALIZA LAS INFO DE LA TABLA COTIZACION POR ID
        await pool.query(`UPDATE cotizacion SET id_cliente = $1, observaciones = $2, total = $3, 
            id_analisisdecosto = $4 WHERE = $5`,
            [id_cliente, observaciones, total, id_analisisdecosto, id_cotizacion]);

        // ELIMINA TODOS LOS DATOS ANTERIORES DE PRODUCTOS POR SU ID_COTIZACION, PARA INSERTAR DE NUEVO

        await pool.query(`DELETE FROM productos WHERE id_cotizacion = $1`, [id_cotizacion]);

        // RECORRE LOS DATOS DE PRODUCTOS PARA INSERTARLOS DE NUEVO
        for (let i = 0; i < productos.length; i++) {

            const producto = {
                descripcion_prod: productos[i].descripcion_prod,
                precio_unidad: productos[i].precio_unidad,
                ancho: productos[i].ancho,
                alto: productos[i].alto,
                area: productos[i].area,
                preciototal: productos[i].preciototal,
                cantidad: productos[i].cantidad
            }

            await pool.query(`INSERT INTO producto (descripcion, precio_unidad, id_cotizacion, ancho,
                    alto, area, preciototal, cantidad) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
                [producto.descripcion_prod, producto.precio_unidad, id_cotizacion, producto.ancho,
                producto.alto, producto.area, producto.preciototal, producto.cantidad]);

        }

    } catch (e) {
        return res.status(500).json({ messaje: ` Ocurrió un error con el servidor: ` + e })
    }

}

const deleteCotizacion = async (req, res) => {

    try {

        id_cotizacion = req.params.id;

        await pool.query(`DELETE FROM cotizacion WHERE id_cotizacion = $1`, [id_cotizacion]);
        await pool.query(`DELETE FROM producto WHERE id_cotizacion = $1`, [id_cotizacion]);

        return res.status(500).json({ messaje: `La cotización se eliminó correctamente` })

    } catch (e) {
        return res.status(500).json({ messaje: ` Ocurrió un error con el servidor: ` + e })
    }

}

module.exports = {
    getCotizaciones,
    saveCotizacion,
    updateCotizacion,
    deleteCotizacion
};
