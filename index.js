    const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const token = config.token;

var observe = 'applications';
var post = 'applications-log';

var observe2 = 'suggestion-box';
var post2 = 'suggestion-box-log';

var observe3 = 'mod_log_discord';
var post3 = 'public-mod-log';

var deletedMessages = 'deleted-messages';
var modMessageChannel = 'send-message-as-bot';
var prefix = "!";

bot.on('ready', () => {
    console.log('This bot is online!');
    
})

bot.on('message', msg =>{
    

    if(msg.channel.name == observe){
        const postChannel = msg.guild.channels.find(ch => ch.name === post);
        postChannel.send(msg.author + " sent " + msg.content);
        msg.delete();
    }

    if(msg.channel.name == observe2){
        const postChannel2 = msg.guild.channels.find(ch => ch.name === post2);
        postChannel2.send(msg.author + " sent " + msg.content);
        msg.delete();
    }
    //mod log and doesnt delete message posted
    if(msg.channel.name == observe3){
        const postChannel3 = msg.guild.channels.find(ch => ch.name === post3);
        postChannel3.send(msg.content);
        
    }

    if (msg.content.indexOf(prefix) !== 0) return;
    if(!msg.member.roles.some(x=>["ADMIN"].includes(x.name))) return; //only allows mods to use commands
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == 'modmessage' && msg.channel.name == modMessageChannel){
        const sendChannel = msg.guild.channels.find(ch => ch.name === args[0]);

        var string = msg.content.replace(/\/#/g, '/');
        sendChannel.send(string.split(" ").slice(2).join(" "));
  
    }
})

bot.on('messageDelete', msg =>{
    const record = msg.guild.channels.find(ch => ch.name === deletedMessages);
    if(msg.content.startsWith("!")) return;
    if (!msg.author.bot && msg.channel.name != observe && msg.channel.name != observe2){
        if(msg.attachments.size > 0){
            record.send(`Message deleted from: ${msg.author} in ${msg.channel}: ${msg.content} ${msg.attachments.first()}`); 
        }else{
            record.send(`Message deleted from: ${msg.author} in ${msg.channel}: ${msg.content}`);   
        }
    }


})

bot.login(token);