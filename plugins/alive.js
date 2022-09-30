const config = require('../config');
const prefix = '.'


async function alive(conn , mek) {
  const from = mek.key.remoteJid	  
  const templateButtons = [

  {index: 1, quickReplyButton: {displayText: 'MENU', id: prefix +'menu' }} , 
  {index: 2, quickReplyButton: {displayText: 'OWNER', id: prefix +'owner' }}   
 ]
   const buttonMessage = {
    caption: config.ALIVE_MSG ,
    footer: 'EDM BOT BASE',
    templateButtons: templateButtons,
    image: {url: config.ALIVE_LOGO}
}                             
await conn.sendMessage(from, buttonMessage )
  }


module.exports =  alive ;
