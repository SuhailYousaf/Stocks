const express = require('express');
const router = express.Router();
const stockController = require('../controller/stock')

router.post('/create',stockController.StockCreate)
router.get('/getStocks',stockController.findStock)
router.put('/Update/:id',stockController.UpdateStock)

module.exports = router;