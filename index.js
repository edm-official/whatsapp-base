
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
const prefix = '.'
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
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
			
		
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

				case 'alive' : 
				try {
						
						  const templateButtons = [
						  { urlButton: {displayText: config.URL_1NAME , url: config.URL_1LINK }},
						  { urlButton: {displayText: config.URL_2NAME , url: config.URL_2LINK }},
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
break
					
//........................................................Owner................................................................\\

case 'owner' : {
const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + `FN:` + config.OWNER_NAME + `\n`
            + 'TEL;type=CELL;type=VOICE;waid=' + config.OWNER_NUMBER + ':+' + config.OWNER_NUMBER + '\n' 
            + 'END:VCARD'
 await conn.sendMessage(from,{ contacts: { displayName: config.OWNER_NAME , contacts: [{ vcard }]  }} , { quoted: mek })
  }
break
					
//........................................................Youtube................................................................\\

				case 'play': case 'yt': {
            
    conn.sendMessage(from, { react: { text: `🔍`, key: mek.key }})
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
caption: '┌───[EDM BOT]\n\n  *📥SONG DOWNLODER*\n\n│🎧sᴏɴɢ: ' + anu.title + '\n\n│ 👀ᴠɪᴇᴡs: ' + anu.views + '\n\n│ 📹 ᴄʜᴀɴɴᴇʟ: ' + anu.author + '\n\n│🖇️ᴜʀʟ: ' + anu.url + '\n\n└───────────◉',
footer: 'sᴇʟᴇᴄᴛ ꜰᴏʀᴍᴀᴛ:',
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
    const doc= await conn.sendMessage(from, { document: { url: media.dl_link }, mimetype: 'audio/mpeg', fileName: `${media.title}.mp3` }, { quoted: mek })
	await  conn.sendMessage(from, { delete: docup.key })
	
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
					const au = await conn.sendMessage(from, { audio: { url: media.dl_link }, mimetype: 'audio/mpeg', fileName: `${media.title}.mp3` }, { quoted: mek })
					await  conn.sendMessage(from, { delete: audup.key })
					
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
