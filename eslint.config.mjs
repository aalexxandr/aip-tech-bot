import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			globals: globals.browser,
			ecmaVersion: 'latest',
		},
		env: {
			browser: true,
			es2021: true,
		},
		settings: {
			'typescript-eslint': {
				project: './tsconfig.json',
			},
		},
		...pluginJs.configs.recommended,
		...tseslint.configs.recommended,
	},
];
