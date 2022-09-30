const config = require('../config');
const prefix = '.'


async function alive(conn , mek) {
  const from = mek.key.remoteJid	
  var alivemsg = 'Hi ' + pushname '\n\n' + config.ALIVE_MSG
  const buttons = [
{buttonId: prefix +'menu ', buttonText: {displayText: 'MENU'}, type: 1},
{buttonId: prefix +'owner ', buttonText: {displayText: 'OWNER'}, type: 1}
 ]
   const buttonMessage = {
    caption: config.ALIVE_MSG ,
    footer: config.FOOTER ,
    buttons: buttons,
    image: {url: config.ALIVE_LOGO}
}                             
await conn.sendMessage(from, buttonMessage )
  }


module.exports =  alive ;
