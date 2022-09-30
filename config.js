const fs = require('fs')
const chalk = require('chalk')


//settings
global.ALIVE_LOGO = process.env.ALIVE_LOGO || 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/WhatsApp_logo-color-vertical.svg/220px-WhatsApp_logo-color-vertical.svg.png'
global.ALIVE_MSG = process.env.ALIVE_MSG || 'Alive Now'

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
