const pool = require('./bdconnect');

const getChargeAccounts = async (req, res) => {

    try {

        const response = await pool.query(`SELECT * FROM cuenta_de_cobro`);
        const cuentas_de_cobro = response.rows;

        let data = [];

        for (let cuenta of cuentas_de_cobro) {

            let productos = [];

            const id_os = cuenta.id_orden_de_servicio;

            const os = await pool.query(`SELECT * FROM orden_de_servicio WHERE id_orden_de_servicio = $1`,
                [id_os]);
            const orden = os.rows[0];

            const clie = await pool.query(`SELECT * FROM cliente WHERE id_cliente = $1`,
                [orden.id_cliente]);
            const cliente = clie.rows[0];

            if (orden.id_cotizacion) {

                const prod = await pool.query(`SELECT * FROM producto WHERE id_cotizacion = $1`,
                    [orden.id_cotizacion]);
                productos = prod.rows;

            } else {

                const prod = await pool.query(`SELECT * FROM producto WHERE id_os = $1`,
                    [cuenta.id_orden_de_servicio]);
                productos = prod.rows;

            }

            data = [...data, { cuenta, cliente, productos }];

        }

        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ message: `Hubo un error con el servidor al traer las cuentas de cobro: ${e}` })
    }

};

const saveChargeAccount = async (req, res) => {

    try {

        const { id_os, fecha, total, observaciones } = req.body;

        await pool.query(`INSERT INTO cuenta_de_cobro (fecha, id_orden_de_servicio, total, observaciones) 
        VALUES ($1,$2,$3,$4)`, [fecha, id_os, total, observaciones]);

        return res.status(200).json({ message: 'La cuenta de cobro ha sido guardada éxitosamente' })

    } catch (e) {

        return res.status(500).json({ message: `Hubo un error con el servidor al guardar la cuenta de cobro: ${e}` })
    }

};

const deleteChargeAccount = async (req, res) => {
    try {

        const { id } = req.params;

        await pool.query(`DELETE FROM cuenta_de_cobro WHERE id_cuenta_de_cobro = $1`, [id]);

        return res.status(200).json({message: `Se ha eliminado la cuenta de cobro con id: ${id}`});

    } catch (e) {
        return res.status(500).json({ message: `Hubo un error con el servidor al eliminar la cuenta de cobro: ${e}` })
    }
};

const updateChargueAccount = async (req, res) => {

    try {

        const id = req.params.id;
        const { id_os, fecha, total, observaciones } = req.body;

        await pool.query(`UPDATE cuenta_de_cobro SET fecha = $1, id_orden_de_servicio = $2, total = $3, 
            observaciones = $4 WHERE id_cuenta_de_cobro = $5`, [fecha, id_os, total, observaciones, id]);

        return res.status(200).json({ message: 'La cuenta de cobro ha sido actualizada éxitosamente' })

    } catch (e) {
        return res.status(500).json({
            message: `Hubo un problema con el servidor al actualizar la cuenta 
                de cobro ${e}`
        })
    }

}

module.exports = {
    getChargeAccounts,
    saveChargeAccount,
    deleteChargeAccount,
    updateChargueAccount
}