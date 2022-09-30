const fs = require('fs')
const chalk = require('chalk')


config.ALIVE_LOGO = process.env.ALIVE_LOGO || 'https://i.ibb.co/SXgrRRx/dd40818b8613.jpg'
config.ALIVE_MSG = process.env.ALIVE_MSG || 'I am alive'

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
