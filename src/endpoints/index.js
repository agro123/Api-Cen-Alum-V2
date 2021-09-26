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
const { saveOrden, getOrden, deleteOrden } = require('../controllers/osController');
const router = Router();

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

//Productos
router.get('/product', getProducts);
router.post('/product', createProduct);
router.put('/product/', modifyProduct);
router.delete('/product/:id', deleteProduct);

//Materiales
router.get('/material', getMaterial);
router.post('/material', createMaterial);
router.put('/material', modifyMaterial);
router.delete('/material/:id', deleteMaterial);

//Analisis De Costo
router.post('/analisis', saveAnalisis);
router.get('/analisis', getAnalisis);
router.put('analisis', updateAnalisis);
router.delete('/analisis', deleteAnalisis);

//Cotizaciones
router.get('/cotizaciones', getCotizaciones);
router.post('/cotizaciones', saveCotizacion);
router.put('/cotizaciones', updateCotizacion);
router.delete('/cotizaciones', deleteCotizacion);

//Ordenes De Servicio
router.post('/os', saveOrden);
router.get('/os', getOrden);
router.delete('/os', deleteOrden);

module.exports = router