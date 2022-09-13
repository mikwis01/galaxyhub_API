const puppeteer = require('puppeteer')
const News = require('./models/newsModel')
let moment = require('moment')

async function scrapeCryptonews_EN() {
	let cryptoNewsResultArray = []
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto('https://cryptonews.com/news/')

	const headers = await page.$$eval(
		'#load_more_target > div > article > div > div.col-8.col-md-12 > a > h4',
		(linksAll) => {
			return linksAll.map((element) => element.textContent)
		}
	)

	const links = await page.$$eval(
		'#load_more_target > div > article > div > div.col-8.col-md-12 > a',
		(linksAll) => {
			return linksAll.map((element) => element.href)
		}
	)

	let imgURLs = await page.$$eval(
		'#load_more_target > div > article > div > div.col-4.col-md-12 > a > div',
		(imgsAll) => {
			return imgsAll.map((x) =>
				x.innerHTML.substring(
					x.innerHTML.indexOf('https'),
					x.innerHTML.length - 1
				)
			)
		}
	)

	imgURLs.forEach((imgUrl, i) => {
		imgURLs[i] = imgUrl.split(' ')[0]

		if (imgURLs[i][imgURLs[i].length - 1] === '"') {
			imgURLs[i] = imgURLs[i].substring(0, imgURLs[i].length - 1)
		}
	})

	const dates = await page.$$eval(
		'#load_more_target > div > article > div > div.col-8.col-md-12 > div > div',
		(linksAll) => {
			return linksAll.map(
				(element) => element.dataset.utctime.split(' ')[0]
			)
		}
	)

	for (let i = 0; i < headers.length; i++) {
		cryptoNewsResultArray.push({
			header: headers[i],
			image: imgURLs[i],
			link: links[i],
			created_at: dates[i],
			service: 'Cryptonews',
			language: 'EN'
		})
	}

	browser.close()

	return cryptoNewsResultArray
}

async function scrapeCryptodaily_EN() {
	let cryptoDailyResultArray = []
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto('https://cryptodaily.co.uk/')

	const headers = await page.$$eval(
		'#wrapper > section:nth-child(7) > div.more-list > div.row > div > h3 > a',
		(linksAll) => {
			return linksAll.map((element) => element.textContent)
		}
	)

	const links = await page.$$eval(
		'#wrapper > section:nth-child(7) > div.more-list > div.row > div > h3 > a',
		(linksAll) => {
			return linksAll.map((element) => element.href)
		}
	)

	let imgURLs = await page.$$eval(
		'#wrapper > section:nth-child(7) > div.more-list > div.row > div > div > a',
		(imgsAll) => {
			return imgsAll.map(
				(x) =>
					x.innerHTML.split(' ')[2] &&
					x.innerHTML
						.split(' ')[2]
						.substring(
							x.innerHTML.split(' ')[2].indexOf('"') + 1,
							x.innerHTML.split(' ')[2].lastIndexOf('"')
						)
			)
		}
	)

	imgURLs.forEach((imgUrl, i) => {
		if (!imgUrl) {
			imgURLs.splice(i, 1)
		}
	})

	const dates = await page.$$eval(
		'#wrapper > section:nth-child(7) > div.more-list > div.row > div > a',
		(linksAll) => {
			return linksAll.map((element) => element.textContent.trim())
		}
	)

	dates.forEach((date, i) => {
		const formatedDate = moment(date, 'MMMM DD, YYYY').format('YYYY-MM-DD')
		dates[i] = formatedDate
	})

	for (let i = 0; i < headers.length; i++) {
		cryptoDailyResultArray.push({
			header: headers[i],
			image: imgURLs[i],
			link: links[i],
			created_at: dates[i],
			service: 'CryptoDaily',
			language: 'EN'
		})
	}

	browser.close()

	return cryptoDailyResultArray
}

async function scrapeBitcoin_PL() {
	let bitcoinResultArray = []
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto('https://bitcoin.pl/wiadomosci')

	const headers = await page.$$eval(
		'#__nuxt > div > main > section > section > div > div > div > div > article > header > a > div > h2',
		(linksAll) => {
			return linksAll.map((element) => element.textContent)
		}
	)

	const links = await page.$$eval(
		'#__nuxt > div > main > section > section > div > div > div > div > article > header > a',
		(linksAll) => {
			return linksAll.map((element) => element.href)
		}
	)

	let imgURLs = await page.$$eval(
		'#__nuxt > div > main > section > section > div > div > div > div > article > header > a > img',
		(imgsAll) => {
			return imgsAll.map((element) => element.src)
		}
	)

	const dates = await page.$$eval('#datetime', (linksAll) => {
		return linksAll.map((element) => element.textContent)
	})

	for (let i = 0; i < headers.length; i++) {
		bitcoinResultArray.push({
			header: headers[i],
			image: imgURLs[i],
			link: links[i],
			created_at: dates[i],
			service: 'Bitcoin',
			language: 'PL'
		})
	}

	browser.close()

	return bitcoinResultArray
}

const Cryptonews = scrapeCryptonews_EN()
const Cryptodaily = scrapeCryptodaily_EN()
const Bitcoin = scrapeBitcoin_PL()

const scrapeAll = () => {
	Cryptonews.then((result) => {
		result.forEach(async (singleNews) => {
			if (
				singleNews.header &&
				singleNews.image &&
				singleNews.link &&
				singleNews.created_at
			) {
				const exist = await News.findOne({
					header: singleNews.header
				})

				if (!exist) {
					await News.create({
						header: singleNews.header,
						image: singleNews.image,
						link: singleNews.link,
						created_at: singleNews.created_at,
						service: singleNews.service,
						language: singleNews.language
					})
				}
			}
		})
	})

	Cryptodaily.then((result) => {
		result.forEach(async (singleNews) => {
			if (
				singleNews.header &&
				singleNews.image &&
				singleNews.link &&
				singleNews.created_at
			) {
				const exist = await News.findOne({
					header: singleNews.header
				})

				if (!exist) {
					await News.create({
						header: singleNews.header,
						image: singleNews.image,
						link: singleNews.link,
						created_at: singleNews.created_at,
						service: singleNews.service,
						language: singleNews.language
					})
				}
			}
		})
	})

	Bitcoin.then((result) => {
		result.forEach(async (singleNews) => {
			if (
				singleNews.header &&
				singleNews.image &&
				singleNews.link &&
				singleNews.created_at
			) {
				const exist = await News.findOne({
					header: singleNews.header
				})

				if (!exist) {
					await News.create({
						header: singleNews.header,
						image: singleNews.image,
						link: singleNews.link,
						created_at: singleNews.created_at,
						service: singleNews.service,
						language: singleNews.language
					})
				}
			}
		})
	})
}

module.exports = {
	scrapeAll
}
