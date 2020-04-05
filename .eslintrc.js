module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		"eslint:recommended",
		// "plugin:@typescript-eslint/recommended",
	],
	parserOptions: {
		ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
		sourceType: ""
	},
	rules: {
		indent: ["error", "tab"],
		quotes: ["error", "double"],
		"no-console": "off",
		"semi": ["error", "always"],
	},
};
