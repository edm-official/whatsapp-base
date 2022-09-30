const { Sequelize } = require('sequelize');
const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });


function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
	ALIVE_MSG: process.env.ALIVE_MSG === undefined ? 'Alive Now' : process.env.ALIVE_MSG,
	ALIVE_LOGO: process.env.ALIVE_LOGO === undefined ? 'https://img.phonandroid.com/2019/05/whatsapp-publicit%C3%A9s-2020.jpg' : process.env.ALIVE_LOGO,
        FOOTER: process.env.FOOTER === undefined ? 'EDM BOT BASE' : process.env.FOOTER,
	OWNER_NAME: process.env.OWNER_NAME === undefined ? 'BUDDHIKA' : process.env.OWNER_NAME,
	OWNER_NUMBER: process.env.OWNER_NUMBER === undefined ? '94766866297' : process.env.OWNER_NUMBER,
};
