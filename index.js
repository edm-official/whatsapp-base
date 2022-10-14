
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
const config = require('./config')
const prefix = '.'
const owner = ['94766866297']
const yts = require( 'yt-search' )
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep } = require('./lib/functions')
const axios = require('axios')
const { xnxxSearch ,  xnxxDown ,  xvideosSearch , xvideosDown } = require('./lib/xnxxdl')
const { smsg, formatp, tanggal, formatDate, getTime, clockString, fetchJson, jsonformat, format, parseMention, } = require('./lib/myfunc')
const { state, saveState } = useSingleFileAuthState('./session.json')


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
			console.log('Bot conected')
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
			const isOwner = owner.includes(senderNumber) || isMe
			
			const reply = (teks) => {
				conn.sendMessage(from, { text: teks }, { quoted: mek })
			}
			
			const groupMetadata = mek.isGroup ? await conn.groupMetadata(mek.chat).catch(e => {}) : ''
        const groupName = mek.isGroup ? groupMetadata.subject : ''
        const participants = mek.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = mek.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
        const groupOwner = mek.isGroup ? groupMetadata.owner : ''
    	const isBotAdmins = mek.isGroup ? groupAdmins.includes(botNumber) : false
    	const isAdmins = mek.isGroup ? groupAdmins.includes(mek.sender) : false
			
			switch (command) {

					
//........................................................Alive................................................................\\

					case 'demote': {
                 
            
		if (!mek.isGroup) return reply('try this in group')
                if (!isBotAdmins) return reply('you are not a bot admin')
                if (!isAdmins) return reply('you are not a admin')
 
		let users = mek.mentionedJid[0] ? mek.mentionedJid[0] : mek.quoted ? mek.quoted.sender : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await conn.groupParticipantsUpdate(mek.chat, [users], 'demote').then((res) => mek.reply(jsonformat(res))).catch((err) => mek.reply(jsonformat(err)))
	}
					
				case 'alive' :  {
						
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
break
					
					case 'menu' :  {
						
						  const templateButtons = [
						  { urlButton: {displayText: 'Youtube' , url: '' }},
						  { urlButton: {displayText: 'Github' , url: '' }},
						  { quickReplyButton: {displayText: 'BOT STATUS', id: prefix +'runtime' }} , 
						  { quickReplyButton: {displayText: 'OWNER', id: prefix +'owner' }}   
						  ]
						  
						  const msg = '*┌───[🐉EDM BOT MENU🐉]* \n\n'
						   const buttonMessage = {
						   caption: msg ,
						   footer: config.FOOTER,
						   templateButtons: templateButtons,
						   image: {url: config.ALIVE_LOGO}
												  }                             
							 await conn.sendMessage(from, buttonMessage )
				}
break
					case 'runtime' : {          
		conn.sendMessage(from, { react: { text: `⚙️`, key: mek.key }})
		 reply (runtime(process.uptime()))
		}
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

				case 'yts': case 'ytsearch': {
    
 conn.sendMessage(from, { react: { text: '🔍', key: mek.key }})
    if (!q) return reply('Example : ' + prefix + command + ' Chanux bro')
 var arama = await yts(q)
 var msg = '';
arama.all.map((video) => {
msg += ' *🖲️' + video.title + '*\n🔗 ' + video.url + '\n\n'
});
const results = await conn.sendMessage(from , { text:  msg }, { quoted: mek } )
}
 break	
					
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
caption: '┌───[🐉EDM BOT🐉]\n\n  *📥YOUTUBE DOWNLODER*\n\n│🧚🏻‍♀️ᴛɪᴛʟᴇ: ' + anu.title + '\n\n│ 👀ᴠɪᴇᴡs: ' + anu.views + '\n\n│ 📹 ᴄʜᴀɴɴᴇʟ: ' + anu.author + '\n\n│🖇️ᴜʀʟ: ' + anu.url + '\n\n└───────────◉',
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
caption: '┌───[🐉EDM BOT🐉]\n\n  *📥SONG DOWNLODER*\n\n│🎧sᴏɴɢ: ' + anu.title + '\n\n│ 👀ᴠɪᴇᴡs: ' + anu.views + '\n\n│ 📹 ᴄʜᴀɴɴᴇʟ: ' + anu.author + '\n\n│🖇️ᴜʀʟ: ' + anu.url + '\n\n└───────────◉',
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
caption: '┌───[🐉EDM BOT🐉]\n\n  *📥YT VIDEO DOWNLODER*\n\n│📽️ᴠɪᴅᴇᴏ: ' + anu.title + '\n\n│ 👀ᴠɪᴇᴡs: ' + anu.views + '\n\n│ 📹 ᴄʜᴀɴɴᴇʟ: ' + anu.author + '\n\n│🖇️ᴜʀʟ: ' + anu.url + '\n\n└───────────◉',
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
	
				  }
				  break
					
					case 'ytdl': {
	conn.sendMessage(from, { react: { text: '🔍', key: mek.key }})
	if (!q) return reply('Example : ' + prefix + command + ' lelena')
	let yts = require("yt-search")
        let search = await yts(q)
        let anu = search.videos[0]
                	   
const listMessage = {
      text: '┌───[🐉EDM BOT🐉]\n\n  *📥ADVANCE DOWNLODER*\n\n│🧚ᴛɪᴛʟᴇ: ' + anu.title + '\n\n│ 👀ᴠɪᴇᴡs: ' + anu.views + '\n\n│ 📹 ᴄʜᴀɴɴᴇʟ: ' + anu.author + '\n\n│🖇️ᴜʀʟ: ' + anu.url + '\n\n└───────────◉',
      footer: config.FOOTER,
      title: 'Hello ' + pushname ,
      buttonText: "Results",
      sections: [{
								"title": "Advance Video Quality",
								"rows": [
									{
										"title": "1080p",
										"description": "",
										"rowId": prefix + 'ytmp4 ' + anu.url + ' 1080p'
									},

                                                                        {
										"title": "720p",
										"description": "",
										"rowId": prefix + 'ytmp4 ' + anu.url + ' 720p'
									},
                                                                        {
										"title": "480p",
										"description": "",
										"rowId": prefix + 'ytmp4 ' + anu.url + ' 480p'
									},
                                                                        {
										"title": "360p",
										"description": "",
										"rowId": prefix + 'ytmp4 ' + anu.url + ' 360p'
									},
                                                                        {
										"title": "240p",
										"description": "",
										"rowId": prefix + 'ytmp4 ' + anu.url + ' 240p'
									},
						                        {
										"title": "144p",
										"description": "",
										"rowId": prefix + 'ytmp4 ' + anu.url + ' 144p'
									}
								]
							},
							{
								"title": "Advance Mp3 Audio",
								"rows": [
									{
										"title": "High",
										"description": "",
										"rowId": prefix + 'ytmp3 ' + anu.url + ' 320kbps'
									},
									{
										"title": "Medium",
										"description": "",
										"rowId": prefix + 'ytmp3 ' + anu.url + ' 256kbps'
										},
									{
										"title": "Low",
										"description": "",
										"rowId": prefix + 'ytmp3 ' + anu.url + ' 128kbps'
										}
										
								]
							},
							{
								"title": "Advance Mp3 Document",
								"rows": [
									{
										"title": "High",
										"description": "",
										"rowId": prefix + 'ytdoc ' + anu.url + ' 320kbps'
									},
									{
										"title": "Medium",
										"description": "",
										"rowId": prefix + 'ytdoc ' + anu.url + ' 256kbps'
										},
									{
										"title": "Low",
										"description": "",
										"rowId": prefix + 'ytdoc ' + anu.url + ' 128kbps'
										}
								]
							}
							
						]
  }
            await conn.sendMessage(from, listMessage, {quoted: mek })
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
					
								  }
								  break
					
//........................................................Playstore................................................................\\
					
					 case 'apk' : case 'findapk' :  {
			 if (!q) return await conn.sendMessage(from , { text: 'Need Query' }, { quoted: mek } )        
		     const data2 = await axios.get('https://bobiz-api.herokuapp.com/api/playstore?q=' + q)
		     const data = data2.data
		     if (data.length < 1) return await  conn.sendMessage(from, { text: 'Not Found' }, { quoted: mek } )
	  var srh = [];  
		   for (var i = 0; i < data.length; i++) {
      srh.push({
          title: data[i].title,
          description: '',
          rowId: prefix + 'sapk ' + q
      });
  }
    const sections = [{
      title: "Playstore Results",
      rows: srh
  }]
    const listMessage = {
      text: ' \n\n name : ' + q + '\n\n ',
      footer: config.FOOTER,
      title: '┌───[🐉EDM BOT🐉]\n\n  *📥APK DOWNLODER*',
      buttonText: "Results",
      sections
  }
    await conn.sendMessage(from, listMessage, {quoted: mek })
		      }
	      break      
				 case 'sapk':{
					 
					
            
let data = await fetchJson('https://bobiz-api.herokuapp.com/api/playstore?q=' + q)


let app = await fetchJson('https://bobiz-api.herokuapp.com/api/apk?url=https://play.google.com' + data[0].link)

let buttons = [
{buttonId: prefix + 'dapk https://play.google.com' + data[0].link , buttonText: {displayText: '📩 Download Apk 📩'}, type: 1}
]
let buttonMessage = {
image: { url: app.icon },
caption: '*╭──[📂 PLAYSTORE DOWN 📂]─◎* \n*╭─────────────◎* \n*│🚀 App Name :* ' + app.name + '\n*│🧑🏻‍💻 Company :* ' + app.developer + '\n*│⭐ Ratings :* ' + app.ratings + '\n*│🔎 Apk Url :* https://play.google.com' + data[0].link + ' ' + '/n*╰─────────────◎*',
footer: config.FOOTER ,
buttons: buttons,
headerType: 4,
}
conn.sendMessage(from, buttonMessage, { quoted: mek })        
}     
break
case 'dapk':   {
if(!q) return await conn.sendMessage(from , { text: 'need app link' }, { quoted: mek } ) 

    const apkdown = await conn.sendMessage(from , { text: pushname + ' ' + config.FILE_DOWN}, { quoted: mek } )
    await  conn.sendMessage(from, { delete: apkdown.key })
    const apkup = await conn.sendMessage(from , { text: pushname + ' ' + config.FILE_UP}, { quoted: mek } )
let data = await fetchJson('https://bobiz-api.herokuapp.com/api/apk?url=' + q)

const apk = await conn.sendMessage(from, {document: { url: 'https://apk-dl2.herokuapp.com/api/apk-dl?url=' + q }, mimetype: 'application/vnd.android.package-archive', fileName: data.name + '.apk'}, {quoted: mek})   
await  conn.sendMessage(from, { delete: apkup.key })   
}
					
break
//........................................................MediaFire................................................................\\
					
					case "mediafire" : case "mfire" :  {
		if (!q) return await conn.sendMessage(from , { text: 'need mediafire link' }, { quoted: mek } )
		if (!q.includes('mediafire.com/file')) return await conn.sendMessage(from , { text: 'need mediafire link' }, { quoted: mek } )
		const data = await axios.get('https://bobiz-api.herokuapp.com/api/mfire?url=' + q)
		const file = data.data
  if ( file.filesize > 150000) return await conn.sendMessage(from , { text: 'max size reached' }, { quoted: mek } )
  const fileup = await conn.sendMessage(from , { text: pushname + config.FILE_DOWN }, { quoted: mek } )
  await conn.sendMessage(from, { delete: fileup.key })
  const filedown = await conn.sendMessage(from , { text: pushname + config.FILE_UP }, { quoted: mek } )
  const doc = await conn.sendMessage(from , { document : { url : file.url  } , mimetype : file.ext , fileName : file.filename } , { quoted: mek })
  await conn.sendMessage(from, { delete: filedown.key })	
		} 
		
		      
	      break
		      
					case 'porn' : 
		   try {
			if (!q) return await conn.sendMessage(from , { text: 'need keyword' }, { quoted: mek } )   
			const buttons = [
{buttonId: prefix +'xnxx ' + q, buttonText: {displayText: 'From xnxx.com'}, type: 1},
{buttonId: prefix +'xvideos ' + q, buttonText: {displayText: 'From Xvideos.com'}, type: 1},
]
			await conn.sendMessage(from, { image: {url: 'https://d2gg9evh47fn9z.cloudfront.net/1600px_COLOURBOX8142847.jpg'  }, caption: 'මොන Website එකෙන්ද ඕනි' , footer: config.FOOTER , buttons: buttons , headerType: 4} , { quoted: mek } )	
			   
		   } 
		      catch(e) {
		      await conn.sendMessage(from , { text: 'error\n\n' + e }, { quoted: mek } )
		      }
		break       

	case 'xnxx': 
		   try {
	      if (!q) return await conn.sendMessage(from , { text: 'Type a keyword  ex : .xnxx japanese' }, { quoted: mek } ) 
	       const data = await xnxxSearch(q)
	       
		     if (data.length < 1) return await  conn.sendMessage(from, { text: e2Lang.N_FOUND }, { quoted: mek } )
	  var srh = [];  
		   for (var i = 0; i < data.length; i++) {
      srh.push({
          title: data[i].title,
          description: data[i].duration + data[i].quality,
          rowId: prefix + 'dxnxx ' + data[i].link
      });
  }
    const sections = [{
      title: "Our Porn Store",
      rows: srh
  }]
    const listMessage = {
      text: " \n Input : " + q + '\n ',
      footer: config.FOOTER,
      title: 'Please Select What do you want',
      buttonText: "Results",
      sections
  }
    await conn.sendMessage(from, listMessage, {quoted: mek })
		      } catch(e) {
await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )  
} 
		      
 break
		      
 //_______________________________________________________________________________________________________________________________________________________   //		      
	// dporn // 
	
	case 'dxnxx' :
	      try {
	     if(!q) return await conn.sendMessage(from , { text: 'need link' }, { quoted: mek } )      
	     
              const data = await xnxxDown(q)      
const waladown = await conn.sendMessage(from , { text: config.VIDEO_DOWN }, { quoted: mek } )
await conn.sendMessage(from, { delete: waladown.key })
const walaup = await conn.sendMessage(from , { text: config.VIDEO_UP }, { quoted: mek } )
await conn.sendMessage(from ,{ video: { url : data.url } , caption: config.CAPTION } , { quoted: mek })
await conn.sendMessage(from, { delete: walaup.key })
		      
	      } catch(e) {
		await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )      
	      }      
	      break  
		     
		
	case 'xvideos': 
		   try {
	      if (!q) return await conn.sendMessage(from , { text: 'Type a keyword  ex : .xvideos japanese' }, { quoted: mek } ) 
	       const data = await xvideosSearch(q)
	       
		     if (data.length < 1) return await  conn.sendMessage(from, { text: e2Lang.N_FOUND }, { quoted: mek } )
	  var srh = [];  
		   for (var i = 0; i < data.length; i++) {
      srh.push({
          title: data[i].title,
          description: data[i].duration + data[i].quality,
          rowId: prefix + 'dxvideos ' + data[i].url
      });
  }
    const sections = [{
      title: "Our Porn Store",
      rows: srh
  }]
    const listMessage = {
      text: " \n Input : " + q + '\n ',
      footer: config.FOOTER,
      title: 'Please Select What do you want',
      buttonText: "Results",
      sections
  }
    await conn.sendMessage(from, listMessage, {quoted: mek })
		      } catch(e) {
await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )  
} 
		      
 break
		      
 //_______________________________________________________________________________________________________________________________________________________   //		      
	// dporn // 
	
	case 'dxvideos' :
	      try {
	     if(!q) return await conn.sendMessage(from , { text: 'need link' }, { quoted: mek } )      
	     
              const data = await xvideosDown(q)      
const waladown = await conn.sendMessage(from , { text: config.VIDEO_DOWN }, { quoted: mek } )
await conn.sendMessage(from, { delete: waladown.key })
const walaup = await conn.sendMessage(from , { text: config.VIDEO_UP }, { quoted: mek } )
await conn.sendMessage(from ,{ video: { url : data.url } , caption: config.CAPTION } , { quoted: mek })
await conn.sendMessage(from, { delete: walaup.key })
		      
	      } catch(e) {
		await conn.sendMessage(from , { text: 'error' }, { quoted: mek } )      
	      }      
	      break  
					

				
				default:
					
					if (isOwner && body.startsWith('>')) {
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
