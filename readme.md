## Installation

Go to cloned folder with project and run follow [npm](https://www.npmjs.com/get-npm) command. 

```bash
npm install
```

## Config dev-server

Add .app folder in root project directory. Than add in this folder dev-server.js file. You can check folder-name and file-name in server.js file. In this place you need specify api address, so default dev-server content:

```javascript
const bs = require("browser-sync").create(),
	fallbackMiddleware = require("connect-history-api-fallback"),
	proxyMiddleware = require("http-proxy-middleware");

bs.init({
	server: {
		baseDir: "./build",
		middleware: [
			proxyMiddleware("/api", {
				target: "http://192.168.190.12:8080",
				changeOrigin: true,
			}),
			fallbackMiddleware()
		]
	},
	port: 3010
});


```

## Start development
Start build in watch mode. Don't stop this terminal! You can check content /build folder.

```bash
npm run watch
```

For start dev-server run. Don't stop this terminal!

```bash
npm run start
```

## Extention for Visual Studio Code

 * [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
 * [import-sorter](https://marketplace.visualstudio.com/items?itemName=mike-co.import-sorter)
 * [Editor Config](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
 * [ESLint ](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
