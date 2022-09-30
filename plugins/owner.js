const config = require('../config');
const prefix = '.'
async function own(conn , mek ) {
  const from = mek.key.remoteJid
  
 
     const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + `FN:` + config.OWNER_NAME + `\n`
            + 'TEL;type=CELL;type=VOICE;waid=' + config.OWNER_NUMBER + ':+' + config.OWNER_NUMBER + '\n' 
            + 'END:VCARD'
 await conn.sendMessage(from,{ contacts: { displayName: config.OWNER_NAME , contacts: [{ vcard }]  }} , { quoted: mek })
  }
  
  

module.exports = own ;
