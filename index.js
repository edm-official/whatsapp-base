const Config = require('./config');
const config = require('./config');
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
const git = simpleGit();
const exec = require('child_process').exec;
const { PassThrough } = require('stream');

var { File } = require("megajs")
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep } = require('./lib/functions')
const  { Boom } = require('@hapi/boom')
async function session(id) {
 console.log('📡checking session code...') 
const url = id.replace("AQUA=" ,  "https://mega.nz/file/") 
const file = await File.fromURL(url)
const data = await file.downloadBuffer() 
fs.writeFileSync('./tmp/session.json', data.toString())  
console.log('🪢session Code Verification Completed')
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
				
			const msg = '1'
			

const buttonMessage = {
    image: {url: 'https://i.ibb.co/gyvMF1P/aqua-logo.jpg'},
    caption: msg  }
await conn.sendMessage(conn.user.id, buttonMessage)
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
			const sendtempimg = async( text , button , imgurl ) => {
				await conn.sendMessage(from, { text: text , footer: '🌀AQUA 1.0 beta', templateButtons: button , image: {url:  imgurl } }, { quoted: mek })
			}
			const sendbutimg = async( text , button , imgurl , footer ) => {
			          	await conn.sendMessage(from, { image: {url:imgurl  }, caption: text, footer: footer, buttons: button , headerType: 4} , { quoted: mek })
		         }
			const areact = 	async( input ) => {
			          	await conn.sendMessage(from, { react: {  text:  input , key: mek.key } } )
		         }
			
			
			
			
			// commands
			
			switch (command) {

case 'alive': {
	conn.sendMessage(from, { text: 'alive' }, { quoted: mek })
}
break
					
	
		} catch (e) {
			const isError = String(e)
			console.log( isError )
		
		}
	})
}

connectToWA()
