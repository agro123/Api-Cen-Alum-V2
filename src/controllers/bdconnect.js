const { Pool } =  require ('pg'); // libreria de posgrest
const dotenv = require('dotenv');

dotenv.config();

const config = {
  connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
};

const pool = new Pool(config);

try {
  pool.connect();
  console.log("Conexión con bd exitosa")
}catch (e) {
  console.log("Ocurrio un error al conectar la bd")
}


module.exports = pool;


