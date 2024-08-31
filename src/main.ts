import * as dotenv from 'dotenv'
import TelegramBot, { type Message } from 'node-telegram-bot-api'
import { IFormDetails } from './types/data.types'

dotenv.config()

const token = process.env.BOT_API_TOKEN || ''
const bot: TelegramBot = new TelegramBot(token, { polling: true })
const webAppUrl = process.env.WEB_APP_URL || ''

async function main() {
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
}

main()
