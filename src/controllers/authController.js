const jwt = require("jsonwebtoken");
const pool = require('./bdconnect');

const crearToken = (usuario) => {
    return jwt.sign(usuario, process.env.TOKEN)
};

const login = async (req, res) => {
    const { method } = req;
    if (method === 'POST') {
        try {

            const { usuario, contrasena } = req.body;
            const response = await pool.query(
                "SELECT * FROM usuario WHERE usuario = $1",
                [usuario]
            );
            if (response.rowCount > 0) {
                const user = response.rows[0];
                const password = user.contrasena;
                if (contrasena === password) {
                    const userAuth = {
                        id_usuario: user.id_usuario,
                        nombre: user.nombre,
                        usuario: user.usuario,
                        password
                    }
                    return res.send({
                        token: crearToken(userAuth),
                        isAuth: true,
                        userAuth
                    });
                }
            }

            return res.send({ isAuth: false });

        } catch (e) {
            res.status(e.status || 500).end(e.message);
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Metodo ${method} Invalido`);
    }
}

const authToken = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        console.log(bearerHeader)
        if (bearerHeader) {
           /*  const bearer = bearerHeader.split(" ");
           const bearerToken = bearer[1]; */
            req.token = bearerHeader;
            next();
        } else {
            res.status(403);
        }
    } catch (e) {
        res.status(e.status || 500).end(e.message);
    }
}

module.exports = {
    login,
    authToken
}