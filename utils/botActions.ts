import type { Context } from 'telegraf';
import { QUESTIONS, userSessions } from './constants';
import { sendDataToGoogleSheet } from './api';

export const askNextQuestion = (ctx: Context) => {
	const userId = ctx.from?.id;

	if (!userId) return;

	const userState = userSessions[userId];

	if (userState.currentQuestionIndex >= QUESTIONS.length) {
		console.log('Ответы пользователя:', userState.answers);
		sendDataToGoogleSheet(userState.answers);

		ctx.reply(
			'Спасибо за ответы, информация будет передана нашим прекрасным рекрутерам!'
		);
		delete userSessions[userId];
	} else {
		ctx.reply(QUESTIONS[userState.currentQuestionIndex]);
	}
};
