import type { Context } from 'telegraf';
import { userSessions } from './constants';
import { downloadFile } from './api';
import { askNextQuestion } from './botActions';

export const isTextMessage = (ctx: Context): boolean => {
	return !!ctx.message && 'text' in ctx.message;
};

export const getUserState = (ctx: Context) => {
	const userId = ctx.from?.id;

	if (!userId) {
		ctx.reply('Произошла ошибка: не удалось определить ID пользователя.');
		return;
	}

	const userState = userSessions[userId];

	if (!userState) {
		ctx.reply('Начните с команды /start для начала диалога.');
		return;
	}

	return userState;
};

export const handleFileMessage = async (ctx: Context, fileId: string) => {
	console.log('file message');

	const userState = getUserState(ctx);

	if (userState && userState?.currentQuestionIndex === 0) {
		try {
			const fileUrl = await downloadFile(fileId);
			userState.answers.push(fileUrl);

			// Переход к следующему вопросу
			userState.currentQuestionIndex++;
			askNextQuestion(ctx);
		} catch (error) {
			console.error('Ошибка при загрузке файла:', error);
			ctx.reply('Не удалось загрузить файл. Попробуйте еще раз.');
		}
	} else {
		ctx.reply('Пожалуйста, напишите ответ текстом.');
	}
};
