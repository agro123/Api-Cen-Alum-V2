const pool = require('./bdconnect');

const getClients = async (req, res) => {
    try {
        const response = await pool.query(`SELECT * FROM cliente `);
        const clients = await response.rows;
        return res.status(200).json(clients)
    }
    catch (e) {
        return res.status(500).json(console.log(e))
    }
}

module.exports = {
    getClients,
    createClient,
    modifyClient,
    deleteClient
};
