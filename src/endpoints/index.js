const { Router } = require('express');
const { getEmpleados, createEmpleado,
    getEmpleadoById, deleteEmpleado,
    updateEmpleado } = require('../controllers/empleadoController');
const { getClients, createClient, deleteClient } = require('../controllers/clientsController');
const { getProducts, createProduct, modifyProduct,
    deleteProduct } = require('../controllers/productsController');
const { getMaterial, createMaterial, modifyMaterial,
    deleteMaterial } = require('../controllers/materialsController');
const { saveAnalisis, getAnalisis, updateAnalisis, deleteAnalisis } = require('../controllers/analisisdecosto');
const { getCotizaciones, updateCotizacion, saveCotizacion, deleteCotizacion } = require('../controllers/cotizationController');
const { saveOrden, getOrdenes, deleteOrden, updateOrden } = require('../controllers/osController');
const { saveChargeAccount, getChargeAccounts, deleteChargeAccount, updateChargueAccount } = require('../controllers/chargeAccountController');
const router = Router();


router.get('/', function (req, res) {
    res.send('Está es la api de cen-alum :D desarrollada por Leonardo Bolaños, Cristian Medina y Nathalia Riascos');
});

//Empleados:
router.get('/empleado', getEmpleados);
router.get('/empleado/:id', getEmpleadoById)
router.post('/empleado', createEmpleado);
router.delete('/empleado/:id', deleteEmpleado);
router.put('/empleado/:id', updateEmpleado);

//Clientes
router.get('/client', getClients);
router.post('/client', createClient);
router.delete('/client/:id', deleteClient);
router.put('/client')

//Productos
router.get('/product', getProducts);
router.post('/product', createProduct);
router.put('/product/', modifyProduct);
router.delete('/product/:id', deleteProduct);

//Materiales
router.get('/material', getMaterial);
router.post('/material', createMaterial);
router.put('/material/:id', modifyMaterial);
router.delete('/material/:id', deleteMaterial);

//Analisis De Costo
router.post('/analisis', saveAnalisis);
router.get('/analisis', getAnalisis);
router.put('/analisis/:id', updateAnalisis);
router.delete('/analisis/:id', deleteAnalisis);

//Cotizaciones
router.get('/cotizaciones', getCotizaciones);
router.post('/cotizaciones', saveCotizacion);
router.put('/cotizaciones/:id', updateCotizacion);
router.delete('/cotizaciones/:id', deleteCotizacion);

//Ordenes De Servicio
router.post('/os', saveOrden);
router.get('/os', getOrdenes);
router.delete('/os/:id', deleteOrden);
router.put('/os', updateOrden);

//Cuentas de Cobro
router.post('/chargue', saveChargeAccount);
router.get('/chargue', getChargeAccounts);
router.delete('/chargue/:id', deleteChargeAccount);
router.put('/chargue/:id', updateChargueAccount);


module.exports = router