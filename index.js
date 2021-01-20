const Discord = require('discord.js');
const bot = new Discord.Client({ partials: ['MESSAGE', 'USER'] });
const config = require("./config.json");
const token = config.token;

//since depricated but observe/post channels allowed for users to post in one channel and have the bot repost the message in another.
var observe = 'applications';
var post = 'applications-log';

var observe3 = 'mod_log_discord';
var post3 = 'public-mod-log';

var deletedMessages = 'deleted-messages';
var modMessageChannel = 'send-message-as-bot';
var techwearArchive = 'techwear-archive';
var prefix = "!";

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};



bot.on('ready', () => {
    console.log('This bot is online!');
})

// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const helloThere = bot.emojis.find(emoji => emoji.name === "helloThere");
    const channel = member.guild.channels.find(ch => ch.id === '596056293333270571');
    const rules = member.guild.channels.find(ch => ch.id === '634224773324341268');
    const applications = member.guild.channels.find(ch => ch.id === '647309796202250261');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`${helloThere} Welcome to the server, ${member} make sure to read ${rules} and ${applications}`);
  });

bot.on('message', msg =>{
    if(msg.channel.type == "dm"){
        const postChannel = bot.channels.find(ch => ch.name === post);
        postChannel.send(msg.author + " sent " + msg.content);
        //msg.delete();
    }

    //mod log and doesnt delete message posted
    if(msg.channel.name == observe3){
        const postChannel3 = msg.guild.channels.find(ch => ch.name === post3);
        postChannel3.send(msg.content);
        
    }
    //delete any msg in #is it techwear that doesnt have an attatchment
    if(msg.channel.id == '654476340539555900' || msg.channel.id == '655124063525797937' || msg.channel.id == '666087232762937344'){
        if(msg.attachments.size == 0){
            msg.delete();
        }
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
//used to save pinned posts from a dedicated channel and repost them to another channel 
bot.on('channelPinsUpdate', function(channel) {
    //if the channel that had its pins changed is the channel we want to get pins from we will enter this if statement
        
            if(channel.name === 'is-it-techwear'){
            //variable pins will hold all of the fetched pinned messages
            let pins = channel.fetchPinnedMessages();
            //destination will hold the destination channel name we want to send the pinned photo too
            const destination = channel.guild.channels.find(ch => ch.name === 'techwear-archive');
            if(!destination) return;
            channel.fetchPinnedMessages()
            .then(messages =>{ 
                try{
                    if(messages.first().attachments.first().url !== ''){
                        destination.send(`${messages.first().author} ${messages.first().attachments.first().url}`);
                        messages.first().unpin();
                    }
                } catch (e){
                    console.log('No more pins');
                }
            })
            .catch(console.error);
        
    }

})
//keep a record of all deleted messages on the server except command messages
bot.on('messageDelete', msg =>{
    const record = msg.guild.channels.find(ch => ch.name === deletedMessages);
    if(msg.content.startsWith("!")) return;
    if (!msg.author.bot && msg.channel.name != observe){

            record.send(`Message deleted from: ${msg.author} in ${msg.channel}: ${msg.content}`);   
       
    }
})
//used to emit an event when a reaction is added to an older message. Messages have to be cached in order to allow user reacts to emit a message
bot.on('raw', async event => {
	// `event.t` is the raw event name
	if (!events.hasOwnProperty(event.t)) return;

	const { d: data } = event;
	const user = bot.users.get(data.user_id);
	const channel = bot.channels.get(data.channel_id) || await user.createDM();

	// if the message is already in the cache, don't re-emit the event
	if (channel.messages.has(data.message_id)) return;

	// if you're on the master/v12 branch, use `channel.messages.fetch()`
	const message = await channel.fetchMessage(data.message_id);

	// custom emojis reactions are keyed in a `name:ID` format, while unicode emojis are keyed by names
	// if you're on the master/v12 branch, custom emojis reactions are keyed by their ID
	const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
	const reaction = message.reactions.get(emojiKey);

	bot.emit(events[event.t], reaction, user);
});

bot.on('messageReactionAdd', function(reaction, user){
    if (reaction.message.partial) {
		// If the message was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.message.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
		}
    }
    if (reaction.message.partial) await reaction.message.fetch()
    if (user.partial) await user.fetch()
    /*
    console.log(user.id)
    console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
    */
    //these are the id values from the server, cannot use vectors for switch/case statement
    if(reaction.message.channel.id == "654400670262362113"){
        var roleId = null; 
        switch(reaction.emoji.id){
            case "636036725428322315":
                roleId = '646974373156225034';
                break;
            case "654427573715206184":
                roleId = '646975985412997130';
                break;  
            case "638613774558822420":
                roleId = '646976211616006160';
                break; 
            case "654430390379085834":
                roleId = '647144066940665886';
                break;
            case "654430923256889408":
                roleId = '647144567656939551';
                break; 
            case "654431323233976353":
                roleId = '647151375263858709';
                break; 
            case "654431530269147139":
                roleId = '647863218567643138';
                break;  
            case "654433761831944192":
                roleId = '647863309844086784';
                break; 
            case "654438254132723763":
                roleId = '647883174440861717';
                break;   
            case "639169311369461760":
                roleId = '649361796834131983';
                break; 
            case "654434788845027345":
                roleId = '649441202537758731';
                break;   
            case "654436232604155915":
                roleId = '649441456586620938';
                break;
            case "654438017968111637":
                roleId = '647927693173850132';
                break;   
            case "663149317112070204":
                roleId =  '663147154776522772';
                break; 
            case "663152825441845251":
                roleId =  '662916080104243201';
                break;     
            case "663152806580060180":
                roleId =  '663146405367382036';
                break;      
            default:
                break;  
        }
        //removes role from before then adds the new role
        if(roleId !== null){
            reaction.message.guild.fetchMember(user.id)
                .then(m => m.removeRoles(['663147154776522772','663146405367382036','662916080104243201','646974373156225034','646975985412997130','646976211616006160','647144066940665886','647144567656939551','647151375263858709','647863218567643138','647863309844086784','647883174440861717','647927693173850132','649361796834131983','649441202537758731','649441456586620938']).catch(console.error))
                .then(m => m.addRole(roleId).catch(console.error))
                .then(reaction.remove(user));
        }
        
    }


})

bot.login(token);
