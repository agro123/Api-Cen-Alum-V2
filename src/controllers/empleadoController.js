const pool = require('./bdconnect');

const getEmpleados = async (req, res) => {
  try {
    const response = await pool.query(`SELECT * FROM empleado `);
    const empleados = await response.rows;
    res.json(empleados);
  } catch (e) {
    res.json({ message: "FAILED", error: e });
    console.log("----Ocurrio  un error----", e);
  }
}

const getEmpleadoById = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await pool.query(
      `SELECT * FROM empleado WHERE id = $1 `,
      [id]
    );
    if (response.rowCount >= 1) {
      const empleado = await response.rows;
      res.json(empleado);
    } else {
      res.status(404).json({ message: "NOT EXIST" });
    }

  } catch (e) {
    res.json({ message: "FAILED", error: e });
    console.log("----Ocurrio  un error----", e);
  }
}

const createEmpleado = async (req, res) => {
  try {
    const { nombre, cedula, email, direccion, telefono } = req.body;

    await pool.query(
      `INSERT INTO empleado 
      (cedula,email,direccion,telefono, nombre) 
      VALUES
      ($1, $2, $3, $4, $5)`,
      [cedula, email, direccion, telefono, nombre]
    );

    const id_empleado = await pool.query(`SELECT last_value FROM empleado_id_empleado_seq`)
    const id = parseInt(id_empleado.rows[0].last_value);

    return res.status(200).json({ id, message: 'Empleado insertado correctamente' });

  } catch (e) {
    console.log("----Ocurrio  un error----", e);
    res.json({ message: "FAILED", error: e });
  }
}

const deleteEmpleado = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await pool.query(
      `DELETE FROM empleado WHERE id = $1 `,
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

const updateEmpleado = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, cedula, email, direccion, telefono } = req.body;
    const response = await pool.query(
      `UPDATE empleado 
    SET nombre = $1, 
    cedula = $2,
    email = $3,
    direccion = $4,
    telefono = $5
    WHERE id = $6`,
      [nombre, cedula, email, direccion, telefono, id]
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
  getEmpleados,
  createEmpleado,
  getEmpleadoById,
  deleteEmpleado,
  updateEmpleado
}