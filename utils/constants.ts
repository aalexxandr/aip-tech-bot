import dotenv from 'dotenv';

dotenv.config();

export const QUESTIONS: string[] = [
	'Пожалуйста, отправьте ваше резюме (файл, текст или ссылка).',
	'Сколько у тебя лет опыта с ML?',
	'Можешь коротко описать свою самую сложную задачу, связанную с ML?',
	'Есть ли у тебя высшее техническое/математическое образование?',
];

interface UserSession {
	currentQuestionIndex: number;
	answers: string[];
}

interface UserSessions {
	[userId: number]: UserSession;
}
export const userSessions: UserSessions = {};

export const BOT_TOKEN = process.env.TOKEN || '';
