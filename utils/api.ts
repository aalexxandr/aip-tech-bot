import { BOT_TOKEN } from './constants';

export async function sendDataToGoogleSheet(data: string[]) {
	const url =
		'https://script.google.com/macros/s/AKfycby8P10VmOilHNg-QupNAQUdPjRxXldzFaIUwbOlK1rZ2Tt0Ce05d9fkGB4plmlpHPGPXQ/exec';

	fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then(response => response.text())
		.then(data => {
			console.log('Success:', data);
		})
		.catch(error => {
			console.error('Error:', error);
		});
}

export async function downloadFile(fileId: string): Promise<string> {
	const url = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Ошибка получения файла: ${response.statusText}`);
		}

		const data = await response.json();
		const filePath = data.result.file_path;
		const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

		return fileUrl;
	} catch (error) {
		console.error('Ошибка при загрузке файла:', error);
		throw error;
	}
}
