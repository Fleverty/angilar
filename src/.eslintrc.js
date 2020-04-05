module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		jasmine: true
	},
	globals: {
		APP_VERSION: "readonly"
	},
	parser: "@typescript-eslint/parser",
	plugins: ["autofix"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
	],

	parserOptions: {
		ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
		sourceType: "module", // Allows for the use of imports
	},
	rules: {
		"no-control-regex": 0,
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/indent": ["error", "tab"],
		"@typescript-eslint/no-parameter-properties": "off",
		"@typescript-eslint/semi": ["error", "always"],
		"@typescript-eslint/member-ordering": ["error"],
		'@typescript-eslint/interface-name-prefix': ["error"],
		"@typescript-eslint/explicit-member-accessibility": ["error", {
			accessibility: "explicit",
			overrides: {
				// excludedFiles: "*.spec.ts",
				accessors: "explicit",
				constructors: "no-public",
				methods: "explicit",
				properties: "explicit",
				parameterProperties: "explicit"
			}
		}],

		"@typescript-eslint/no-use-before-define": ["error", {
			"variables": false,
			"typedefs": false,
			"classes": false,
			"functions": false,
		}],
		"no-underscore-dangle": ["error", {
			"allowAfterThis": false
		}],
		"eol-last": ["error", "always"],
		"indent": "off",
		"quotes": ["error", "double"],
		"semi": "off",
		"autofix/sort-vars": "error"
	},
};
