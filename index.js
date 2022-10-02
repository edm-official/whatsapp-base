
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
const simpleGit = require('simple-git');
var { File } = require("megajs")
const  { Boom } = require('@hapi/boom')
async function session(id) {
 console.log('📡checking session code...') 
const url = id.replace("AQUA=" ,  "https://mega.nz/file/") 
const file = await File.fromURL(url)
const data = await file.downloadBuffer() 
fs.writeFileSync('./tmp/session.json', data.toString())  
console.log('🪢session Code Verification Completed')
}
const axios = require('axios');
const prefix = '.'
const ownerNumber = ['94766866297']

 async function decodeJid(jid)  {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }


async function connectToWA()  {
	if (config.SESSION == '') return await console.log('🚫please enter the session code')
		if (config.SESSION.startsWith('AQUA=')){
	await session(config.SESSION)
	} else if (config.SESSION.startsWith('AQUA-MD=')) {
	try{
	const sesl = config.SESSION.replace( "AQUA-MD=" , "https://aquabot.up.railway.app/file/") + '.json'
	const sesf = await axios.get( sesl  )
	fs.writeFileSync('./tmp/session.json', JSON.stringify(sesf.data) )  
        console.log('🪢session Code Verification Completed')
	} 
		catch(e) {
		return await console.log('🚫invalid session code.🚫')
		}
	} else { return await console.log('🚫invalid session code . only works with aquabot md session codes🚫') }
		
	
		 
	
	
	const { state, saveState } = useSingleFileAuthState('./tmp/session.json')
	const conn = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
	})
	
	conn.ev.on('connection.update', async(update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); process.exit(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, Reconnecting...."); connectToWA(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, Reconnecting..."); connectToWA(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); process.exit(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Delete Session And Scan Again.`); process.exit(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); connectToWA(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); connectToWA(); }
            else { console.log(`Unknown DisconnectReason: ${reason}|${connection}`) }
			
		} else if (connection === 'open') {
			console.log('✅connected')
			
			const msg = 'EDM BOT CONNECTED'
			

c
await conn.sendMessage(from, { text: msg }, { quoted: mek })
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
			const pushname = mek.pushName || 'unknown'
			
			const isMe = botNumber.includes(senderNumber)
			const isOwner = ownerNumber.includes(senderNumber) || isMe
			       
			
			
			
			const reply = async(teks) => {
				await conn.sendMessage(from, { text: teks }, { quoted: mek })
			}
			
			
			
			
			switch (command) {
					
//........................................................Alive................................................................\\

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
          rowId: prefix + 'dapk ' + data[i].link
      });
  }
    const sections = [{
      title: "Playstore Results",
      rows: srh
  }]
    const listMessage = {
      text: " \n\n name : " + q + '\n\n ',
      footer: config.FOOTER,
      title: '┌───[🐉EDM BOT🐉]\n\n  *📥APK DOWNLODER*\n\n',
      buttonText: "Results",
      sections
  }
    await conn.sendMessage(from, listMessage, {quoted: mek })
		      }
	      break      
					
					case 'dapk' :   {
	   if(!q) return await conn.sendMessage(from , { text: 'need app link' }, { quoted: mek } ) 
			 const n = q.replace('/store/apps/details?id=', '')
	  const data = await axios.get('https://bobiz-api.herokuapp.com/api/apk?url=https://play.google.com/store/apps/details?id=' + n)
	 const name = data.data.name		
	   const fileup = await conn.sendMessage(from , { text: pushname + config.FILE_DOWN }, { quoted: mek } )
	   await conn.sendMessage(from, { delete: fileup.key })
           const filedown = await conn.sendMessage(from , { text: pushname + config.FILE_UP }, { quoted: mek } )
	  
	 	 const app_link = await apk_link(n)
	  if ( app_link.size.replace('MB' , '') > 200) return await conn.sendMessage(from , { text: 'Max size reached' }, { quoted: mek } )
         if ( app_link.size.includes('GB')) return await conn.sendMessage(from , { text: 'Max size reached' }, { quoted: mek } )
		  var ext = ''
		  if (app_link.type.includes('Download XAPK')) { ext = '.xapk' } 
		  else { ext = '.apk' }
         await conn.sendMessage(from , { document : { url : app_link.dl_link  } , mimetype : 'application/vnd.android.package-archive' , fileName : name + ext } , { quoted: mek })
         await conn.sendMessage(from, { delete: filedown.key })
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
