const pool = require('./bdconnect');

const saveAnalisis = async (req, res) => {

    try{

        const { responsables_del_trabajo, otros_gastos, materiales_usados, observaciones, total } = req.body;

        //GUARDAR EN LA TABLA ANALISIS_DE_COSTO LAS OBSERVACIONES Y EL VALOR TOTAL DE ESTE

        await pool.query(`INSERT INTO analisis_de_costo (observaciones, total) VALUES ($1, $2)`, [
            observaciones, total
        ])
        //------------------------------------------
        const result = await pool.query(`SELECT last_value FROM analisisdecosto_id_analisisdecosto_seq`);
        const id_next_analisis_de_costo = parseInt(result.rows[0].last_value);

        
        //GUARDAR EN LA TABLA RESPONSABLES_DEL_TRABAJO LOS TRABAJADORES, SU SALARIO 
        //Y EL ID DE ESTE ANALISIS
        
        for (const i = 0; i < responsables_del_trabajo.length; i++)
        {
            const trabajador = {
                id_empleado : responsables_del_trabajo[i].id_empleado,
                salario : responsables_del_trabajo[i].id_empleado,
            }

            await pool.query(`INSERT INTO responsables_del_trabajo (id_empleado, salario, id_analisisdecosto ) 
                    VALUES (
                    $1, $2, $3)`,
            [trabajador.id_empleado, trabajador.salario, id_next_analisis_de_costo]);
        }
        //-------------------------------------------------
 
        //INSERTAR EN LA TABLA "OTROS_GASTOS" EL DETALLE DE LO INVERTIDO, SU VALOR Y EL ID DEL ANALISIS -------
         for(let i= 0; i< otros_gastos.length; i++){

            const gasto = {
                descripcion : otros_gastos[i].descripcion,
                precio : otros_gastos[i].precio,
            }
            console.log(gasto);

            await pool.query(`INSERT INTO otros_gastos (descripcion, precio, id_analisis_de_costo) VALUES ($1,$2,$3)`,
            [gasto.descripcion, gasto.precio, id_next_analisis_de_costo])
        } 

        //INSERTAR EN LA TABLA "MATERIALES_USADOS" EL DETALLE DE LOS MATERIALES QUE COMPONDRÁN EL PRODUCTO
        for(const i= 0; i<materiales_usados.length; i++){

            const materiales = {
                id_material : materiales_usados[i].id_material,
                precio_total : materiales_usados[i].precio_total,
                longitud : materiales_usados[i].longitud,
                cantidad : materiales_usados[i].cantidad,
            }

            await pool.query(`INSERT INTO materiales_usados (id_material, precio_total, longitud, cantidad, id_analisisdecosto ) 
            VALUES ($1,$2,$3,$4,$5)`,
            [materiales.id_material, materiales.precio_total, materiales.longitud, materiales.cantidad,
                id_next_analisis_de_costo])
        } 

    return res.status(200).json({ message: "Analisis de costo insertado correctamente" })
        

    } catch(e){
        return res.status(500).json(console.log(e))
    }

}

module.exports = {
    saveAnalisis
}