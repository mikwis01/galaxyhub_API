const News = require('./models/newsModel')
const moment = require('moment')

const cleanUpNews = async () => {
	const allNews = await News.find()

	allNews.forEach(async (singleNews) => {
		const now = moment()
		const newsDate = moment(singleNews.created_at)
		const date_diff = now.diff(newsDate, 'days')

		if (date_diff > 7) {
			await News.deleteOne({ _id: singleNews._id })
		}
	})
}

module.exports = {
	cleanUpNews
}
