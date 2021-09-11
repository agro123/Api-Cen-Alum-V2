const pool = require('./bdconnect');

const getMaterial = async (req,res) => {
    try{

        const response = await pool.query(`SELECT * FROM material`);
        const materials = response.rows;

        return res.status(200).json(materials)

    }catch(e){
        return res.status(500).json({ message: "Ocurrió un error con el servidor" })
    }
}

const createMaterial = async (req, res) => {

    try {

        const { reference, description, price } = req.body;

        await pool.query(`INSERT INTO material (referencia, descripcion, 
                precio) VALUES (
                    $1, $2, $3)`,
            [reference, description, price]);

        return res.status(200).json({ message: "Material insertado correctamente" })

    } catch (e) {
        return res.status(500).json({ message: "Ocurrió un error con el servidor" })
    }
}

const deleteMaterial = async (req, res) => {

    try {

        id = req.params.id;

        await pool.query(`DELETE FROM material WHERE id_material = $1`, [id]);

        return res.status(200).json({ message: "Material eliminado correctamente" })

    } catch (e) {
        return res.status(500).json({ message: "Ocurrió un error con el servidor" })
    }
}

const modifyMaterial= async (req, res) => {

    try {

        const { reference, description, price, id_material } = req.body;

        await pool.query(`UPDATE material SET referencia = $1, descripcion = $2, 
                precio = $3 WHERE id_material = $4`,
            [reference, description, price, id_material]);

        return res.status(200).json({ message: "Material modificado correctamente" })

    } catch (e) {
        return res.status(500).json({ message: "Ocurrió un error con el servidor" })
    }
}


module.exports = {
    getMaterial,
    createMaterial,
    deleteMaterial,
    modifyMaterial
}