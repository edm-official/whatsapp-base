const fs = require('fs')
const chalk = require('chalk')


//settings
global.ALIVE_MSG = process.env.ALIVE_MSG || 'Alive Now'
global.ALIVE_LOGO = process.env.ALIVE_LOGO || 'https://img.phonandroid.com/2019/05/whatsapp-publicit%C3%A9s-2020.jpg'

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
