const pool = require('./bdconnect');

const saveAnalisis = async (req, res) => {

    try {

        const { responsables_del_trabajo, otros_gastos, materiales_usados, observaciones, total } = req.body;
        console.log(`Otros gastos: ${otros_gastos.length}`);
        console.log(`Responsables del trabajo: ${responsables_del_trabajo.length}`);
        console.log(`materiales_usados: ${materiales_usados.length}`);

        //GUARDAR EN LA TABLA ANALISIS_DE_COSTO LAS OBSERVACIONES Y EL VALOR TOTAL DE ESTE

        await pool.query(`INSERT INTO analisis_de_costo (observaciones, total) VALUES ($1, $2)`, [
            observaciones, total
        ])
        //------------------------------------------

        // OBTENER EL ID DEL ANALISIS RECIEN CREADO PARA VINCULAR LOS DEMÁS ELEMENTOS CON ESTE
        const result = await pool.query(`SELECT last_value FROM analisisdecosto_id_analisisdecosto_seq`);
        const id = parseInt(result.rows[0].last_value);


        //GUARDAR EN LA TABLA RESPONSABLES_DEL_TRABAJO LOS TRABAJADORES, SU SALARIO 
        //Y EL ID DE ESTE ANALISIS

        for (let i = 0; i < responsables_del_trabajo.length; i++) {
            const trabajador = {
                id_empleado: responsables_del_trabajo[i].id_empleado,
                salario: responsables_del_trabajo[i].id_empleado,
            }

            await pool.query(`INSERT INTO responsables_del_trabajo (id_empleado, salario, id_analisisdecosto ) 
                    VALUES (
                    $1, $2, $3)`,
                [trabajador.id_empleado, trabajador.salario, id]);
        }
        //-------------------------------------------------

        //INSERTAR EN LA TABLA "OTROS_GASTOS" EL DETALLE DE LO INVERTIDO, SU VALOR Y EL ID DEL ANALISIS -------

        for (let i = 0; i < otros_gastos.length; i++) {

            const gasto = {
                descripcion: otros_gastos[i].descripcion,
                precio: otros_gastos[i].precio,
            }
            console.log(gasto);

            await pool.query(`INSERT INTO otros_gastos (descripcion, precio, id_analisis_de_costo) VALUES ($1,$2,$3)`,
                [gasto.descripcion, gasto.precio, id])
        }

        //INSERTAR EN LA TABLA "MATERIALES_USADOS" EL DETALLE DE LOS MATERIALES QUE COMPONDRÁN EL PRODUCTO
        for (let i = 0; i < materiales_usados.length; i++) {

            const materiales = {
                id_material: materiales_usados[i].id_material,
                precio_total: materiales_usados[i].precio_total,
                longitud: materiales_usados[i].longitud,
                cantidad: materiales_usados[i].cantidad,
            }

            await pool.query(`INSERT INTO materiales_usados (id_material, precio_total, longitud, cantidad, id_analisisdecosto ) 
            VALUES ($1,$2,$3,$4,$5)`,
                [materiales.id_material, materiales.precio_total, materiales.longitud, materiales.cantidad,
                    id])
        }

        return res.status(200).json({id, message: "Analisis de costo insertado correctamente" })


    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor: ' + e })
    }

}

const getAnalisis = async (req, res) => {

    try {

        const analisis_c = await pool.query(`SELECT * FROM analisis_de_costo`);
        const analisis_de_costo = analisis_c.rows;

        let data = [];

        for (let analisis of analisis_de_costo) {

            const id = analisis.id_analisisdecosto;

            const resp = await pool.query(`SELECT * FROM responsables_del_trabajo WHERE id_analisisdecosto = $1`,
                [id]);
            const responsables = resp.rows;

            const mater = await pool.query(`SELECT * FROM materiales_usados WHERE id_analisisdecosto = $1`,
            [id]);
            const materiales = mater.rows;

            const gast = await pool.query(`SELECT * FROM otros_gastos WHERE id_analisis_de_costo = $1`,
            [id]);
            const otros_gastos = gast.rows;

            data = [...data, {analisis, responsables, materiales, otros_gastos}];

        }

        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e });
    }

}

const updateAnalisis = async (req, res) => {

    try {

        const { responsables_del_trabajo, otros_gastos, materiales_usados, observaciones, total } = req.body;
        const id = req.params.id;

        if (!total || !responsables_del_trabajo || !materiales_usados) {
            throw new Error('Total, Responsables del trabajo o Materiales son necesarios');
        }

        //GUARDAR EN LA TABLA ANALISIS_DE_COSTO LAS OBSERVACIONES Y EL VALOR TOTAL DE ESTE

        await pool.query(`UPDATE analisis_de_costo SET observaciones= $1, total = $2 WHERE id_analisisdecosto = $3`,
            [observaciones, total, id]);

        //GUARDAR EN LA TABLA RESPONSABLES_DEL_TRABAJO LOS TRABAJADORES, SU SALARIO 

        await pool.query(`DELETE FROM responsables_del_trabajo WHERE id_analisisdecosto= $1`,
            [id]);

        for (let i = 0; i < responsables_del_trabajo.length; i++) {
            const trabajador = {
                id_empleado: responsables_del_trabajo[i].id_empleado,
                salario: responsables_del_trabajo[i].id_empleado,
            }

            await pool.query(`INSERT INTO responsables_del_trabajo (id_empleado, salario, id_analisisdecosto ) 
                    VALUES (
                    $1, $2, $3)`,
                [trabajador.id_empleado, trabajador.salario, id]);
        }
        //-------------------------------------------------

        //INSERTAR EN LA TABLA "OTROS_GASTOS" EL DETALLE DE LO INVERTIDO Y SU VALOR -------

        await pool.query(`DELETE FROM otros_gastos WHERE id_analisis_de_costo = $1`,
            [id]);

        for (let i = 0; i < otros_gastos.length; i++) {

            const gasto = {
                descripcion: otros_gastos[i].descripcion,
                precio: otros_gastos[i].precio,
            }
            console.log(gasto);

            await pool.query(`INSERT INTO otros_gastos (descripcion, precio, id_analisis_de_costo) VALUES ($1,$2,$3)`,
                [gasto.descripcion, gasto.precio, id])
        }

        //INSERTAR EN LA TABLA "MATERIALES_USADOS" EL DETALLE DE LOS MATERIALES QUE COMPONDRÁN EL PRODUCTO

        await pool.query(`DELETE FROM materiales_usados WHERE id_analisisdecosto = $1`, [id]);

        for (let i = 0; i < materiales_usados.length; i++) {

            const materiales = {
                id_material: materiales_usados[i].id_material,
                precio_total: materiales_usados[i].precio_total,
                longitud: materiales_usados[i].longitud,
                cantidad: materiales_usados[i].cantidad,
            }

            await pool.query(`INSERT INTO materiales_usados (id_material, precio_total, longitud, cantidad, id_analisisdecosto ) 
            VALUES ($1,$2,$3,$4,$5)`,
                [materiales.id_material, materiales.precio_total, materiales.longitud, materiales.cantidad,
                    id])
        }

        return res.status(200).json({ message: 'Actualizado con éxito' });

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con la base de datos' + e });
    }

}

const deleteAnalisis = async (req, res) => {

    try {

        const id_analisisdecosto = req.params.id;
        console.log(id_analisisdecosto);

        await pool.query(`DELETE FROM analisis_de_costo WHERE id_analisisdecosto= $1`,
            [id_analisisdecosto]);

        return res.status(200).json({ message: 'Eliminado con éxito' });

    } catch (e) {
        return res.status(500).json({ message: 'Ocurrió un error con el servidor' + e });
    }

}

module.exports = {
    saveAnalisis,
    getAnalisis,
    updateAnalisis,
    deleteAnalisis
}