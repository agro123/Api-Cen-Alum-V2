const pool = require('./bdconnect');

const getChargeAccounts = (req, res) => {

    try {

        const response = await pool.query(`SELECT * FROM cuenta_de_cobro`);
        const cuentas_de_cobro = response.rows;

        return res.status(200).json(cuentas_de_cobro)

    } catch (e) {
        return res.status(500).json({ message: `Hubo un error con el servidor al cargar la cuenta de cobro: ${e}` })
    }

};

const saveChargeAccount = (req, res) => {

    try {

        const { id_os, fecha, total, observaciones } = req.body;

        await pool.query(`INSERT INTO cuenta_de_cobro (fecha, id_orden_de_servicio, total, observaciones) 
        VALUES ($1,$2,$3,$4)`, [fecha, id_os, total, observaciones]);

        return res.status(200).json({message: 'La cuenta de cobro ha sido guardada éxitosamente'})
        
    } catch (e) {

        return res.status(500).json({ message: `Hubo un error con el servidor al guardar la cuenta de cobro: ${e}`})
    }

};

const deleteChargeAccount = (req, res) => {
    try {
        
        const { id } = req.params;
        
        await pool.query(`DELETE FROM cuenta_de_cobro WHERE id_cuenta_de_cobro = $1`, [id]);

    } catch (e) {
        return res.status(500).json({ message: `Hubo un error con el servidor al eliminar la cuenta de cobro: ${e}`})
    }
};

module.exports = {
    getChargeAccounts,
    saveChargeAccount,
    deleteChargeAccount
}