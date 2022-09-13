const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
	header: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	created_at: {
		type: String,
		required: true
	},
	service: {
		type: String,
		required: true
	},
	language: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('News', newsSchema)
