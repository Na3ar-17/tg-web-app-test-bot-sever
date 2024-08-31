import bodyParser from 'body-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { Request, Response, type Express } from 'express'
import TelegramBot, { type Message } from 'node-telegram-bot-api'
import { IFormDetails, IWebData } from './types/data.types'

dotenv.config()

async function main() {
	const token = process.env.BOT_API_TOKEN || ''
	const bot: TelegramBot = new TelegramBot(token, { polling: true })
	const webAppUrl = process.env.WEB_APP_URL || ''

	const app: Express = express()

	app.use(bodyParser.json())
	app.use(
		cors({
			origin: ['http://localhost:5173', process.env.WEB_APP_URL || ''],
		})
	)

	bot.on('message', async (msg: Message) => {
		const chatId = msg.chat.id
		const text = msg.text

		if (text === '/start') {
			await bot.sendMessage(chatId, 'Click to the button, and fill the form', {
				reply_markup: {
					keyboard: [
						[{ text: 'Fill the form', web_app: { url: webAppUrl + '/form' } }],
					],
					resize_keyboard: true,
				},
			})
			await bot.sendMessage(chatId, 'See our website', {
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Make an order', web_app: { url: webAppUrl } }],
					],
				},
			})
		}
		if (msg.web_app_data?.data) {
			try {
				const data: IFormDetails = JSON.parse(msg.web_app_data.data)

				await bot.sendMessage(chatId, 'Thanks for you details!')
				await bot.sendMessage(chatId, `Your Name: ${data.name}`)
				await bot.sendMessage(chatId, `Your Surname: ${data.surname}`)
				await bot.sendMessage(chatId, `Your Gender: ${data.gender}`)
			} catch (error) {
				console.log(error)
			}
		}
	})

	const PORT = process.env.PORT || 4200

	app.post('/api/web-data', async (req: Request, res: Response) => {
		const { products, queryId, totalPrice }: IWebData = req.body
		try {
			await bot.answerWebAppQuery(queryId, {
				type: 'article',
				id: queryId,
				title: 'Successful purchase',
				input_message_content: {
					message_text: `Congratulation with successful purchase, you spent ${totalPrice}$`,
				},
			})
		} catch (error) {
			await bot.answerWebAppQuery(queryId, {
				type: 'article',
				id: queryId,
				title: 'Something went wrong(',
				input_message_content: {
					message_text: `Operation failed,try again later`,
				},
			})
			return res.status(500).json({})
		}
		return res.status(200).json({})
	})

	try {
		app.listen(PORT, () => {
			console.log(`Server is running at http://localhost:${PORT}`)
		})
	} catch (error) {
		console.log(error)
	}
}

main()
