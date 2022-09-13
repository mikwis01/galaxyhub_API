const express = require('express')
const router = express.Router()
const { getNews, getAllNews } = require('../controllers/newsController')

router.get('/', getAllNews)

router.get('/:id', getNews)

module.exports = router
