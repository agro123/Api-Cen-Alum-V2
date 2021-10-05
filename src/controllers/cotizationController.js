const pool = require('./bdconnect');

const getCotizaciones = async (req, res) => {
    try {

        const cot = await pool.query(`SELECT * FROM cotizacion`);
        const cotizaciones = cot.rows;

        let data = [];

        for(let cotizacion of cotizaciones){
            
            const id_cotizacion = cotizacion.id_cotizacion;

            const prod = await pool.query(`SELECT * FROM producto WHERE id_cotizacion = $1`,
                [id_cotizacion]);

            const productos = prod.rows;

            data = [...data, {cotizacion, productos}];

        };

        return res.status(200).json(data);

    }
    catch (e) {
        return res.status(500).json({ messaje: ` Ocurrió un error con el servidor: ` + e })
    }
};

const saveCotizacion = async (req, res) => {

    try {

        const { id_cliente, observaciones, fecha, total, id_analisisdecosto, productos } = req.body;

        // VALIDAR SI VIENE UN ID_ANALISIS DE COSTO Y OMITIRLO O NO EN EL QUERY
        if (id_analisisdecosto) {

            await pool.query(`INSERT INTO cotizacion (id_cliente, observaciones, fecha, total, id_analisisdecosto) 
                VALUES ($1, $2, $3, $4, $5)`,
                [id_cliente, observaciones, fecha, total, id_analisisdecosto]);

        } else {

            await pool.query(`INSERT INTO cotizacion (id_cliente, observaciones, fecha, total)
                VALUES ($1, $2, $3, $4)`,
                [id_cliente, observaciones, fecha, total]);

        }

        // OBTENGO EL VALOR ID DE LA COTIZACION QUE ACABO DE CREAR PARA REFERENCIAR LOS 
        // PRODUCTOS SIGUIENTES

        const result = await pool.query(`SELECT last_value FROM cotizacion_id_cotizacion_seq`);
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

        return res.status(200).json({message: 'La cotización fue guardada correctamente'});

    } catch (e) {
        return res.status(500).json({ messaje: ` Ocurrió un error con el servidor: ` + e })
    }

};

const updateCotizacion = async (req, res) => {

    try {

        const { id_cliente, observaciones, fecha, total, id_analisisdecosto, productos } = req.body;
        const id = req.params.id;
        console.log(req.body);
        console.log(req.params.id);

        // ACTUALIZA LAS INFO DE LA TABLA COTIZACION POR ID
        await pool.query(`UPDATE cotizacion SET id_cliente = $1, observaciones = $2, fecha = $3, total = $4, 
            id_analisisdecosto = $5 WHERE id_cotizacion = $6`,
            [id_cliente, observaciones, fecha, total, id_analisisdecosto, id]);

        // ELIMINA TODOS LOS DATOS ANTERIORES DE PRODUCTOS POR SU ID_COTIZACION, PARA INSERTAR DE NUEVO

        await pool.query(`DELETE FROM producto WHERE id_cotizacion = $1`, [id]);

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
                [producto.descripcion_prod, producto.precio_unidad, id, producto.ancho,
                producto.alto, producto.area, producto.preciototal, producto.cantidad]);

        }

        res.status(200).json({message: `La cotización con id ${id} fué actualizada` })

    } catch (e) {
        return res.status(500).json({ messaje: ` Ocurrió un error con el servidor: ` + e })
    }

}

const deleteCotizacion = async (req, res) => {

    try {

        id = req.params.id;

        await pool.query(`DELETE FROM cotizacion WHERE id_cotizacion = $1`, [id]);

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
