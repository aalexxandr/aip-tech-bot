import { Telegraf, type Context, type Scenes } from 'telegraf';
import type { Message } from 'telegraf/typings/core/types/typegram';
import {
	isTextMessage,
	getUserState,
	handleFileMessage,
} from './utils/helpers';
import { BOT_TOKEN, QUESTIONS, userSessions } from './utils/constants';
import { askNextQuestion } from './utils/botActions';

const bot = new Telegraf<Scenes.WizardContext>(BOT_TOKEN);

bot.start((ctx: Context) => {
	console.log('bot start');

	const userId = ctx.from?.id;

	if (!userId) return;

	userSessions[userId] = {
		currentQuestionIndex: 0,
		answers: [],
	};

	ctx.reply(QUESTIONS[0]);
});

bot.on('text', (ctx: Context & { message: Message.TextMessage }) => {
	console.log('text message');

	const userState = getUserState(ctx);
	if (userState) {
		userState.answers.push(ctx.message.text);
		userState.currentQuestionIndex++;

		askNextQuestion(ctx);
	}
});

bot.on(
	'document',
	async (ctx: Context & { message: Message.DocumentMessage }) => {
		console.log('document message');
		const fileId = ctx.message.document.file_id;
		await handleFileMessage(ctx, fileId);
	}
);

bot.on('photo', async (ctx: Context & { message: Message.PhotoMessage }) => {
	console.log('photo message');

	const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
	await handleFileMessage(ctx, fileId);
});

bot.on('message', (ctx: Context) => {
	const userState = getUserState(ctx);
	console.log('on message event...');

	const isNotAllowFileAnswer =
		!isTextMessage(ctx) && userState && userState.currentQuestionIndex !== 0;

	const isNotAllowAnswerType =
		!(ctx.message && 'text' in ctx.message) &&
		!(ctx.message && 'document' in ctx.message) &&
		!(ctx.message && 'photo' in ctx.message);

	if (isNotAllowFileAnswer || isNotAllowAnswerType) {
		ctx.reply('Неверный формат ответа. Попробуйте еще раз.');
	}
});

bot
	.launch()
	.then(() => console.log('Бот запущен'))
	.catch(err => console.error('Ошибка при запуске бота:', err));
