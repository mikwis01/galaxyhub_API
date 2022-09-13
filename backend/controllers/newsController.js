const asyncHandler = require('express-async-handler')
const News = require('../models/newsModel')

//@desc     Get all aggregated news
//@route    GET /news
//@access   Public
const getAllNews = asyncHandler(async (req, res) => {
	const allNews = await News.find()

	res.json(allNews)
})

//@desc     Get particular news by id
//@route    GET /news/:id
//@access   Public
const getNews = asyncHandler(async (req, res) => {
	const news = await News.findById(req.params.id)

	res.json(news)
})

module.exports = {
	getNews,
	getAllNews
}
