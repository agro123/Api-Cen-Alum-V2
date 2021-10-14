const pool = require('./bdconnect');
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  try {
    jwt.verify(req.token, process.env.TOKEN, async (err, data) => {
      if (err) {
        res.status(403);
      } else {
        const usuario = await pool.query("SELECT * FROM usuario");
        res.status(200).json(usuario.rows);
      }
    })

  } catch (e) {
    res.json({ message: "FAILED", error: e });
    console.log("----Ocurrio  un error----", e);
  }
};

const createUser = async (req, res) => {
  try {
    const { usuario, nombre, contrasena } = req.body;

    await pool.query(
      `INSERT INTO usuario (usuario, nombre, contrasena)  
      VALUES
      ($1, $2, $3)`,
      [usuario, nombre, contrasena]
    );

    return res.status(200);

  } catch (e) {
    console.log("----Ocurrio  un error----", e);
    res.json({ message: "FAILED", error: e });
  }
}

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await pool.query(
      `DELETE FROM usuario WHERE id = $1 `,
      [id]
    );
    if (response.rowCount >= 1) {
      res.json({ message: "DELETED" });
    } else {
      res.status(404).json({ message: "NOT EXIST" });
    }
  } catch (e) {
    res.json({ message: "FAILED", error: e });
    console.log("----Ocurrio  un error----", e);
  }
}

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { usuario, nombre, contrasena } = req.body;
    const response = await pool.query(
      `UPDATE usuario 
    SET usuario = $1, 
    nombre = $2,
    contrasena = $3,
    WHERE id = $6`,
      [usuario, nombre, contrasena, id]
    )
    if (response.rowCount >= 1) {
      res.json({ message: 'SUCCESS' })
    } else {
      res.status(404).json({ message: 'NOT EXIST' })
    }
  } catch (e) {
    res.json({ message: "FAILED", error: e });
    console.log(e)
  }
}


module.exports = {
  getUser,
  createUser,
  deleteUser,
  updateUser,
}