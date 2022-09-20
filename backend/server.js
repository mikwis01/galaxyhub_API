const express = require('express')
const cron = require('node-cron')
const cors = require('cors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const { scrapeAll } = require('./scrape')
const { cleanUpNews } = require('./db_cleanup')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

connectDB()
const app = express()

app.use('/news', require('./routes/newsRoutes'))
app.use(cors())
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))

//--- 5 min after every midnight
cron.schedule('5 0 * * *', scrapeAll)
cron.schedule('5 0 * * *', cleanUpNews)
