const config = require('../config');
const prefix = '.'
async function alive(conn , mek) {
  const from = mek.key.remoteJid	
  const templateButtons = [
  { urlButton: {displayText: 'Youtube' , url: '' }},
  { urlButton: {displayText: 'Github' , url: '' }},
  { quickReplyButton: {displayText: 'MENU', id: prefix +'menu' }} , 
  { quickReplyButton: {displayText: 'OWNER', id: prefix +'owner' }}   
 ]
   const buttonMessage = {
    caption: config.ALIVE_MSG ,
    footer: config.FOOTER,
    templateButtons: templateButtons,
    image: {url: config.ALIVE_LOGO}
}                                                 
await conn.sendMessage(from, buttonMessage )
  }


module.exports =  alive ;
