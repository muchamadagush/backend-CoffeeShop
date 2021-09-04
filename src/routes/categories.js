const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categories')

router
  .get('/', categoryController.getAllCategory)
  .get('/:id', categoryController.getCategory)
  .post('/', categoryController.insertCategory)
  .put('/:id', categoryController.updateCategory)
  .delete('/:id', categoryController.deleteCategory)

module.exports = router
