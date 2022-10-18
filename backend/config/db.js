const mongoose = require('mongoose')

//mongodb+srv://bithub_admin:Qjdf26PeiMohvOJk@cluster0.dtgbzow.mongodb.net/?retryWrites=true&w=majority
//process.env.MONGO_URI

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(
			`mongodb+srv://bithub_admin:Qjdf26PeiMohvOJk@cluster0.dtgbzow.mongodb.net/?retryWrites=true&w=majority`
		)

		console.log(`MongoDB Connected: ${conn.connection.host}`)
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}

module.exports = connectDB
