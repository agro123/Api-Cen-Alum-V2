const pool = require('./bdconnect');


const getClients = async (req, res) => {
    try {
        const response = await pool.query(`SELECT * FROM cliente `);
        const clients = await response.rows;
        return res.status(200).json(clients)
    }
    catch (e) {
        return res.json({ message: "FAILED", error: e });
    }
}

const createClient = async (req, res) => {
    try {

        const { name, identify, address, phone, email } = req.body;

        await pool.query(`INSERT INTO cliente (nombre, identificacion, direccion, telefono, email) VALUES ($1,$2,$3,$4,$5)`, [
            name,
            identify,
            address,
            phone,
            email
        ])
        return res.status(200).json({ message: 'Cliente insertado correctamente' })
    }
    catch (e) {
        res.json({ message: "FAILED", error: e });
    }
}

const modifyClient = async (req, res) => {

    try {

        const { name, identify, address, phone, email, id } = req.body;

        await pool.query(`UPDATE cliente 
        SET nombre = $1, 
        identificacion = $2,
        direccion = $3,
        telefono = $4,
        email = $5
        WHERE id_cliente = $6`,
            [name, identify, address, phone, email, id])

        return res.status(200).json({ message: 'Modificado con éxito' })

    }
    catch (e) {
        return res.json({ message: "FAILED", error: e });
    }
}

const deleteClient = async (req, res) => {

    try {
        const id = req.params.id;
        console.log(req.params.id);
        await pool.query(`DELETE FROM cliente WHERE id_cliente= $1`, [id])
        return res.status(200).json({ messaje: "Cliente eliminado con éxito" })

    } catch (e) {
        return res.json({ message: "FAILED", error: e });
    }
}

module.exports = {
    getClients,
    createClient,
    modifyClient,
    deleteClient
};


