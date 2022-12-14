const { Sequelize } = require('sequelize');
const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });


function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
	ALIVE_MSG: process.env.ALIVE_MSG === undefined ? 'I Am Alive Now' : process.env.ALIVE_MSG,
	ALIVE_LOGO: process.env.ALIVE_LOGO === undefined ? 'https://i.ibb.co/QJNkFcj/NISHI-1-removebg-preview.png' : process.env.ALIVE_LOGO,
        FOOTER: process.env.FOOTER === undefined ? 'Nishi-Bot' : process.env.FOOTER,
	OWNER_NAME: process.env.OWNER_NAME === undefined ? 'Yoman Saubhagya' : process.env.OWNER_NAME,
	OWNER_NUMBER: process.env.OWNER_NUMBER === undefined ? '94766866297' : process.env.OWNER_NUMBER,
	SONG_DOWN: process.env.SONG_DOWN === undefined ? 'Downloading Your Song...' : process.env.SONG_DOWN,
	SONG_UP: process.env.SONG_UP === undefined ? 'Uploading Your Song...' : process.env.SONG_UP,
	VIDEO_DOWN: process.env.VIDEO_DOWN === undefined ? 'Downloading Your Video...' : process.env.VIDEO_DOWN,
	VIDEO_UP: process.env.VIDEO_UP === undefined ? 'Uploading Your Video...' : process.env.VIDEO_UP,
	CAPTION: process.env.CAPTION === undefined ? 'Generated By EDM Bot' : process.env.CAPTION,
	FILE_DOWN: process.env.FILE_DOWN === undefined ? 'Downloading Your File...' : process.env.FILE_DOWN,
	FILE_UP: process.env.FILE_UP === undefined ? 'Uploading Your File...' : process.env.FILE_UP,
};
