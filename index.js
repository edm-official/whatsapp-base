
const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType ,
	jidDecode
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { state, saveState } = useSingleFileAuthState('./session.json')
const config = require('./config')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep } = require('./lib/functions')
const { fetchJson} = require('./lib/myfunc')
const prefix = '.'
const axios = require('axios');
const owner = ['94766866297']
const connectToWA = () => {
	const conn = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
	})
	
	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
				connectToWA()
			}
		} else if (connection === 'open') {
			console.log('Bot Connected')
		}
	})
	
	conn.ev.on('creds.update', saveState)
	
	conn.ev.on('messages.upsert', async(mek) => {
		try {
			mek = mek.messages[0]
			if (!mek.message) return
			
			mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			if (mek.key && mek.key.remoteJid === 'status@broadcast') return
			const type = getContentType(mek.message)
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			
			const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : ( type == 'listResponseMessage') && mek.message.listResponseMessage.singleSelectReply.selectedRowId? mek.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId  ? mek.message.buttonsResponseMessage.selectedButtonId  : (type == "templateButtonReplyMessage") && mek.message.templateButtonReplyMessage.selectedId ? mek.message.templateButtonReplyMessage.selectedId  :  (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
			const isCmd = body.startsWith(prefix)
			const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
			const args = body.trim().split(/ +/).slice(1)
			const q = args.join(' ')
			const isGroup = from.endsWith('@g.us')
			const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
			const senderNumber = sender.split('@')[0]
			const botNumber = conn.user.id.split(':')[0]
			const pushname = mek.pushName || 'Sin Nombre'
			const isMe = botNumber.includes(senderNumber)
			const isowner = owner.includes(senderNumber) || isMe
			
			const reply = (teks) => {
				conn.sendMessage(from, { text: teks }, { quoted: mek })
			}
			switch (command) {
					
//........................................................Alive................................................................\\

				case 'alive' :  {
					let anu = await fetchJson('https://raw.githubusercontent.com/vihangayt0/server-/main/settings.json')
					await conn.sendMessage(from, { react: { text: `${anu.alive}`, key: m.key }})
						  const templateButtons = [
						  { urlButton: {displayText: anu.BTN , url: anu.GIT}},
						  { urlButton: {displayText: config.BUTTON , url: config.BUTTONURL }},
						  { quickReplyButton: {displayText: 'MENU 📝', id: prefix +'menu' }} , 
						  { quickReplyButton: {displayText: 'OWNER 🙇‍♂️', id: prefix +'owner' }}   
												  ]
						   const buttonMessage = {
						   caption: config.ALIVE_MSG ,
						   footer: config.FOOTER,
						   templateButtons: templateButtons,
						   image: {url: config.ALIVE_LOGO}
												  }                             
							 await conn.sendMessage(from, buttonMessage )
				}
//____________________________________________menu___________________________________________________________\\
break
case 'help': case 'h': case 'menu': case 'allmenu': case 'listmenu':{
await conn.sendMessage(from, { react: { text: `📝`, key: m.key }})  
	const helpmenu = `
*━━━〈  ⭕ Group ⭕  〉━━━*	
🎈promote
🎈demote
*━━━〈  🔍 Search 🔍  〉━━━*
♠️play
♠️song
♠️video
♠️apk
*━━━〈  🌌 Downloader 🌌  〉━━━*
🎗yt
🎗song
🎗video
🎗ytmp3
🎗ytmp4
🎗fb
🎗tiktok
🎗ig
🎗twitter
🎗apk
🎗dapk
🎗mediafire  

  『  *${config.BOT_NAME}*  』
    _Powered by:_ *VihangaYT*
`
	let buttonshelpm = [
	{buttonId: `${prefix } owner`, buttonText: {displayText: 'Bot Owner'}, type: 1},
	{buttonId: `${prefix } ping`, buttonText: {displayText: 'Speed'}, type: 1}]
				   let buttonMessage = {
					text: helpmenu,
					footer: config.FOOTER,
					templateButtons: buttonshelpm   
				   }
			   conn.sendMessage(from, buttonMessage,{ quoted:mek })
				   }
				   
   break
					
//........................................................Settings................................................................\\

case 'owner' : {
const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + `FN:` + config.OWNER_NAME + `\n`
            + 'TEL;type=CELL;type=VOICE;waid=' + config.OWNER_NUMBER + ':+' + config.OWNER_NUMBER + '\n' 
            + 'END:VCARD'
 await conn.sendMessage(from,{ contacts: { displayName: config.OWNER_NAME , contacts: [{ vcard }]  }} , { quoted: mek })
  }
break
case 'ping':{     
                
	AstroMD.sendMessage(m.chat, { react: { text: `⚙️`, key: m.key }})
	const start = new Date().getTime()
	 reply ('*Testing speed...*')
	const end = new Date().getTime()
	await reply('```Pong``` ' + (end - start) + ' *MS*')
	}
	break  				
	case 'runtime':{          
		AstroMD.sendMessage(m.chat, { react: { text: `⚙️`, key: m.key }})
		 reply (runtime)
		}
		break  	
//........................................................Youtube................................................................\\

				case 'play': case 'yt': {     
    conn.sendMessage(from, { react: { text: '🔍', key: mek.key }})
    if (!q) return reply('Example : ' + prefix + command + ' lelena')
let yts = require("yt-search")
let search = await yts(q)
let anu = search.videos[0]
let buttons = [
{buttonId: prefix + 'ytmp4 ' +  anu.url + ' 360p', buttonText: {displayText: 'VIDEO'}, type: 1},
{buttonId: '.ytmp3 ' + anu.url + ' 128kbps', buttonText: {displayText: 'AUDIO'}, type: 1}
]
let buttonMessage = {
image: { url: anu.thumbnail },
caption: '┌───[🐉🐉Astro-MD🐉🐉]\n\n  *YOUTUBE DOWNLODER*\n\n│🧚🏻‍♀️ᴛɪᴛʟᴇ: ' + anu.title + '\n\n│ 👀ᴠɪᴇᴡs: ' + anu.views + '\n\n│🖇️ᴜʀʟ: ' + anu.url + '\n\n└───────────◉',
footer: 'sᴇʟᴇᴄᴛ ꜰᴏʀᴍᴀᴛ:',
buttons: buttons,
headerType: 4,
}
conn.sendMessage(from, buttonMessage, { quoted: mek })
}
break
					case 'song':  {
            
    conn.sendMessage(from, { react: { text: '🎧', key: mek.key }})
    if (!q) return reply('Example : ' + prefix + command + ' lelena')
let yts = require("yt-search")
let search = await yts(q)
let anu = search.videos[0]
let buttons = [
{buttonId: prefix + 'ytdoc ' +  anu.url , buttonText: {displayText: 'DOCUMENT'}, type: 1},
{buttonId: prefix + 'ytmp3 ' + anu.url , buttonText: {displayText: 'AUDIO'}, type: 1}
]
let buttonMessage = {
image: { url: anu.thumbnail },
caption: '┌───[🐉Astro-MD🐉]\n\n  *SONG DOWNLODER*\n\n│🎧sᴏɴɢ: ' + anu.title + '\n\n│ 👀ᴠɪᴇᴡs: ' + anu.views + '\n\n│🖇️ᴜʀʟ: ' + anu.url + '\n\n└───────────◉',
footer: 'sᴇʟᴇᴄᴛ ꜰᴏʀᴍᴀᴛ:',
buttons: buttons,
headerType: 4,
}
conn.sendMessage(from, buttonMessage, { quoted: mek })
}
break
					
					
					case 'video':  {
            
    conn.sendMessage(from, { react: { text: '📽️', key: mek.key }})
    if (!q) return reply('Example : ' + prefix + command + ' lelena')
let yts = require("yt-search")
let search = await yts(q)
let anu = search.videos[0]
let buttons = [
{buttonId: prefix + 'ytmp4 ' +  anu.url + '360p', buttonText: {displayText: '360p'}, type: 1},
{buttonId: prefix + 'ytmp4 ' + anu.url + '480p', buttonText: {displayText: '480p'}, type: 1},
{buttonId: prefix + 'ytmp4 ' + anu.url + '720p', buttonText: {displayText: '720p'}, type: 1}
]
let buttonMessage = {
image: { url: anu.thumbnail },
caption: '┌───[🐉Astro-MD🐉]\n\n  *YT VIDEO DOWNLODER*\n\n│📽️ᴠɪᴅᴇᴏ: ' + anu.title + '\n\n│ 👀ᴠɪᴇᴡs: ' + anu.views + '\n\n│🖇️ᴜʀʟ: ' + anu.url + '\n\n└───────────◉',
footer: 'sᴇʟᴇᴄᴛ Qᴜᴀʟɪᴛʏ:',
buttons: buttons,
headerType: 4,
}
conn.sendMessage(from, buttonMessage, { quoted: mek })
}
break


case 'ytdoc': {
	await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key }})
	if ( !q.includes('youtu') ) return await conn.sendMessage(from , { text: '*Need yt link*' }, { quoted: mek } )  
			  let { yta } = require('./lib/y2mate')
					  let quality = args[1] ? args[1] : '256kbps'
					  let media = await yta(q, quality)
					  if (media.filesize >= 100000) {
					  const msg = '*SONG SIZE UP TO 100MB ⛔*'
                      const templateButtons = [
						{ urlButton: {displayText: 'ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ 🎯' , url: media.dl_link+'.mp4' }},
					  ]

					  const templateMessage = {
					  text: msg,
					  footer: config.FOOTER,
					  templateButtons: templateButtons
					  }

					  await conn.sendMessage(from, templateMessage, { quoted: mek })   
					}
	const docdown = await conn.sendMessage(from , { text: pushname + ' ' + config.SONG_DOWN }, { quoted: mek } )
	await conn.sendMessage(from, { delete: docdown.key })
	const docup = await conn.sendMessage(from , { text: pushname + ' ' + config.SONG_UP }, { quoted: mek } )
    const doc= await conn.sendMessage(from, { document: { url: media.dl_link }, mimetype: 'audio/mpeg', fileName: media.title + '.mp3' }, { quoted: mek })
	await  conn.sendMessage(from, { delete: docup.key })
    await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }})
    conn.sendMessage(from, { react: { text: `🎼`, key: doc.key }})
				  }
				  break

				  case 'ytmp3': {
					await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key }})
					if ( !q.includes('youtu') ) return await conn.sendMessage(from , { text: '*Need yt link*' }, { quoted: mek } )  
							  let { yta } = require('./lib/y2mate')
									  let quality = args[1] ? args[1] : '256kbps'
									  let media = await yta(q, quality)
									  if (media.filesize >= 100000) {
									  const msg = '*SONG SIZE UP TO 100MB ⛔*'
									  const templateButtons = [
										{ urlButton: {displayText: 'ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ 🎯' , url: media.dl_link+'.mp4' }},
									  ]
				
									  const templateMessage = {
									  text: msg,
									  footer: config.FOOTER,
									  templateButtons: templateButtons
									  }
				
									  await conn.sendMessage(from, templateMessage, { quoted: mek })   
									}
					const auddown = await conn.sendMessage(from , { text: pushname + ' ' + config.SONG_DOWN }, { quoted: mek } )
					await conn.sendMessage(from, { delete: auddown.key })
					const audup = await conn.sendMessage(from , { text: pushname + ' ' + config.SONG_UP }, { quoted: mek } )
					const au = await conn.sendMessage(from, { audio: { url: media.dl_link }, mimetype: 'audio/mpeg', fileName: media.title + '.mp3' }, { quoted: mek })
					await  conn.sendMessage(from, { delete: audup.key })
                    await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }})
                    conn.sendMessage(from, { react: { text: `🎼`, key: au.key }})
								  }
								  break
					
					case 'ytmp4': {
					await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key }})
					if ( !q.includes('youtu') ) return await conn.sendMessage(from , { text: '*Need yt link*' }, { quoted: mek } )  
							   let { ytv } = require('./lib/y2mate')
									  let quality = args[1] ? args[1] : '360p'
									  let media = await ytv(q, quality)
									  if (media.filesize >= 100000) {
									  const msg = '*VIDEO SIZE UP TO 100MB ⛔*'
									  const templateButtons = [
										{ urlButton: {displayText: 'ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ 🎯' , url: media.dl_link + '.mp4' }},
									  ]
				
									  const templateMessage = {
									  text: msg,
									  footer: config.FOOTER,
									  templateButtons: templateButtons
									  }
				
									  await conn.sendMessage(from, templateMessage, { quoted: mek })   
									}
					const viddown = await conn.sendMessage(from , { text: pushname + ' ' + config.VIDEO_DOWN }, { quoted: mek } )
					await conn.sendMessage(from, { delete: viddown.key })
					const vidup = await conn.sendMessage(from , { text: pushname + ' ' + config.VIDEO_UP }, { quoted: mek } )
					const vid = await conn.sendMessage(from, { video: { url: media.dl_link }, mimetype: 'video/mp4', fileName: media.title + '.mp4', caption: config.CAPTION }, { quoted: mek })
					await  conn.sendMessage(from, { delete: vidup.key })
                    await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }})
                    conn.sendMessage(from, { react: { text: `🎞️`, key: vid.key }})
								  }
								  break
//__________________________________________fb____________________________________________

//__________________________________________ig_tiktok_tw____________________________________________
case 'twiter' : case 'ig': case 'igvid' : case 'fb': case 'getvid': {
            
    await conn.sendMessage(from, { react: { text: `⬆️`, key: mek.key }})
    if (!q) return await conn.sendMessage(from , { text: '*Need Link*' }, { quoted: mek } )    
let anu = await fetchJson('https://raw.githubusercontent.com/vihangayt0/server-/main/settings.json')
var buf = await getBuffer(anu.THUMB) 
const download = await conn.sendMessage(from , { text: pushname + ' ' + config.VIDEO_DOWN }, { quoted: mek } )
let bicil = require('@bochilteam/scraper')

let urlnya = q

bicil.savefrom(urlnya)

.then(async(result) => {	  	                                	                      	            

for(let i of result.url) {		

if(i.url.includes('mp4')){		           			    				

let link = await getBuffer(i.url)
await conn.sendMessage(from, { delete: download.key })	
const uplode = await conn.sendMessage(from , { text: pushname + ' ' + config.VIDEO_UP }, { quoted: mek } )

conn.sendMessage(from, { video: link, jpegThumbnail:buf,caption: `${config.cap}` }, { quoted: mek }) 
await conn.sendMessage(from, { delete: uplode.key })    
    await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }})          

}

}

}).catch((err) => reply('*SORRY I CANT DOWNLOAD ❗*'))

}	
break
case 'tiktok': {
    await conn.sendMessage(from, { react: { text: `⬆️`, key: mek.key }})
    if (!q) return await conn.sendMessage(from , { text: '*Need Link*' }, { quoted: mek } )           
     let bocil = require('@bochilteam/scraper')   
     if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) throw '*The link you provided is not valid*'                
     bocil.tiktokdlv3(`${q}`).then(async (video) => {           
                         
       buf = await getBuffer(config.tiktokthub)
       const up = await conn.sendMessage(from , { text: pushname + ' ' + config.VIDEO_UP }, { quoted: mek } )
       await conn.sendMessage(from, { video: { url: video.video.no_watermark },caption: `${config.cap}`}, { quoted: mek }) 
       await conn.sendMessage(from,{delete : up.key })  
       await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }}) 
       }).catch((err) => {
		reply('*SORRY I CANT DOWNLOAD ❗*')})
  }
  break
  //__________________________________________________________apk down_____________________________________
  case 'apk' :
    case 'findapk':{
       if (!q) return reply(`*Need Name*\n\n*EG:* _.apk whatsapp_`)
       let search = await fetchJson('https://bobiz-api.herokuapp.com/api/playstore?q=' + q)
let link = search[0].link
let name = search[0].title
let data = await fetchJson(`https://bobiz-api.herokuapp.com/api/apk?url=https://play.google.com${link}`)
let buttons = [
{buttonId: `${prefix}dapk https://play.google.com${link}`, buttonText: {displayText: '📩 Download Apk 📩'}, type: 1}
]
let buttonMessage = {
image: { url: data.icon },
caption: `*╭──[📂 PLAYSTORE DOWN 📂]─◎*
*╭─────────────◎*
*│🚀 App Name :* _${name}_
*│🧑🏻‍💻 Company :* _${data.developer}_
*│⭐ Ratings :* _${data.ratings}_
*│🔎 Apk Url :* _https://play.google.com${link}_
*╰─────────────◎*`,
footer: `${config.FOOTER}`,
buttons: buttons,
headerType: 4,
}
conn.sendMessage(from, buttonMessage, { quoted: mek })        
}     
break
case 'dapk':      
try {
if(!q) return await conn.sendMessage(from , { text: 'need app link' }, { quoted: mek } ) 
await conn.sendMessage(from, { react: { text: `🔄`, key: mek.key }})
    const load_d = await conn.sendMessage(from , { text: pushname + 'Downloading' }, { quoted: mek } )
    await  conn.sendMessage(from, { delete: load_d.key })
    const load_u = await conn.sendMessage(from , { text: pushname + 'Uploading'}, { quoted: mek } )
    if (!args[0]) return reply(`Example: ${prefix + command} `)
let apk = `https://apk-dl2.herokuapp.com/api/apk-dl?url=`+ q
let data = await fetchJson(`https://bobiz-api.herokuapp.com/api/apk?url=`+ q)
const U = await conn.sendMessage(from, {document: { url: apk }, mimetype: `application/vnd.android.package-archive`, fileName: `${data.name}.apk`}, {quoted: mek}) 
await conn.sendMessage(from, { react: { text: `📁`, key: U.key }})     
await  conn.sendMessage(from, { delete: load_u.key })
await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }})
} catch(e) {
 reply(`*ERROR*`)
}      
break
default:
					
					if (isowner && body.startsWith('>')) {
						try {
							await reply(util.format(await eval(`(async () => {${body.slice(1)}})()`)))
						} catch(e) {
							await reply(util.format(e))
						}
					}
					
			}
			
		} catch (e) {
			const isError = String(e)
			
			console.log(isError)
		}
	})
}

connectToWA()
