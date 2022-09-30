const config = require('../config');
const prefix = '.'
async function alive(conn , mek , q) {
  const from = mek.key.remoteJid
  if (!q) return reply('Example : ${prefix + command} lelena)
let yts = require("yt-search")
let search = await yts(q)
let anu = search.videos[0]
let buttons = [
{buttonId: 'ytmp4 ${anu.url} 360p', buttonText: {displayText: 'VIDEO'}, type: 1},
{buttonId: 'ytdoc ${anu.url} 128kbps', buttonText: {displayText: 'AUDIO'}, type: 1}
]
let buttonMessage = {
image: { url: anu.thumbnail },
caption: '*┏━❬EDM BOT 🐲❭* \n\n*⬇️ YOUTUBE DOWNLOADER* \n\n┃💎Title : ${anu.title} \n\n┃⏳Duration : ${anu.timestamp} \n\n┃✍️Author : ${anu.author.name} \n\n┃👀Viewers : ${anu.views} \n\n┃⬆️Uploded : ${anu.ago} \n\n┃🔗Url : ${anu.url} \n\n┃📄Description : ${anu.description} \n\n┗━━━━━━━━━━━✺',
footer: 'sᴇʟᴇᴄᴛ ꜰᴏʀᴍᴀᴛ:',
buttons: buttons,
headerType: 4,
}
                           
await conn.sendMessage(from, buttonMessage )
  
}

module.exports =  play ;

