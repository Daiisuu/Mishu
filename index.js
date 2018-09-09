
var randomizer = require('./randomizer.js');
// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
const yt = require('ytdl-core');
const randomPuppy = require('random-puppy');

let queue = {};
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }


if(command == "coinflip") {
  message.channel.send(`Result: **${Math.floor(Math.random() * 2) == 0 ? "Heads" : "Tails"}**!`);
}

if(command === "warn") {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, but you don't have permission to use this!")
  let target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  let reports = message.guild.channels.find('name' , 'reports');
  let reason = args.slice(1).join(' ');

    if(!target) return message.channel.send('`Please mention a user to warn.`');
    if(!reports) return message.channel.send('`Please create a channel named "reports" to log the warns.`');
    if(!reason) reason = "No reason provided";


    let reportembed = new Discord.RichEmbed()
        .setThumbnail(target.user.avatarURL)
        .setAuthor('Warn', 'https://cdn.discordapp.com/emojis/465245981613621259.png?v=1')
        .setDescription(`New warn by ${message.author.username}`)
        .addField('⚠ - Warned Member', `${target.user.tag}\n(${target.user.id})`, true)
        .addField('⚠ - Warned by', `${message.author.tag}\n(${message.author.id})`, true)
        .addField('⚙ - Channel', `${message.channel}`)
        .addField('🔨 - Reason', `${reason}`)
        .setColor('0xfc4f35')
        .setTimestamp();
    reports.send(reportembed);


      message.delete().catch(O_o=>{});
    message.channel.send(`***${target.user.tag} was warned!***`)
   await target.send(`You have been warned in **${message.guild.name}** by **${message.author.username}** for: ${reason}.`)

  }


if(command === "report") {
        let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let reports = message.guild.channels.find('name' , 'reports');
        let reason =  args.slice(1).join(' ');

        if(!target) return message.channel.send('`Please specify a member to report.`');
        if(!reason) return message.channel.send('`Please specify a reason to report.`');
        if(!reports) return message.channel.send('`Please create a channel named "reports" to log the reports.`');

        let reportembed = new Discord.RichEmbed()
            .setThumbnail(target.user.avatarURL)
            .setAuthor('Report', 'https://cdn.discordapp.com/emojis/465245981613621259.png?v=1')
            .setDescription(`New report by ${message.author.username}`)
            .addField('⚠ - Reported Member', `${target.user.tag}\n(${target.user.id})`, true)
            .addField('⚠ - Reported by', `${message.author.tag}\n(${message.author.id})`, true)
            .addField('⚙ - Channel', `${message.channel}`)
            .addField('🔨 - Reason', `${reason}`)
            .setColor('0xfc4f35')
            .setTimestamp();
        reports.send(reportembed);

        message.channel.send(`**${target}** was reported by **${message.author}** ${reason}`).then(message => message.delete(5000));
}

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    let user = message.mentions.users.first();
  let razon = args.join(' ').slice(1);
  var perms = message.member.hasPermission("KICK_MEMBERS");

  if(!perms) return message.channel.send("`Error` `|` You do not have permission to use this command.");
  if (message.mentions.users.size < 1) return message.reply('You must tag someone.').catch(console.error);

  if (!razon) return message.channel.send('Write a reason, `;;kick @username [reason]`');
  if (!message.guild.member(user).kickable) return message.reply('You can not kick that user.');

  message.guild.member(user).kick(razon);

  let kickEmbed = new Discord.RichEmbed()
     .setDescription("~KICK: Sorry, your behavior is inadequate~")
     .setColor("#e56b00")
     .addField("Kicked User", `${user.username}`)
     .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
     .addField("Kicked In", message.channel)
     .addField("Time", message.createdAt)
     .setImage(randomizer("expell"))
     .addField("Reason", razon)

     message.channel.send(kickEmbed);

  }

  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    let user = message.mentions.users.first();
    let reason = args.join(' ').slice(1);

    var perms = message.member.hasPermission("BAN_MEMBERS");
    if(!perms) return message.channel.send("`Error` `|` You do not have permission to use this command.");

    if (message.mentions.users.size < 1) return message.reply('You must tag someone.').catch(console.error);
    if(!reason) return message.channel.send('Write a reason, `;;kick @username [reason]`');
    if (!message.guild.member(user).bannable) return message.reply('You can not ban that user.');

    message.guild.member(user).ban(reason);

      let banEmbed = new Discord.RichEmbed()
      .setDescription("~BAN: Sorry, your behavior is inadequate~")
      .setColor("#bc0000")
      .addField("Banned User", `${user.username}`)
      .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
      .addField("Banned In", message.channel)
      .addField("Time", message.createdAt)
      .setImage(randomizer("ban"))
      .addField("Reason", reason);

    message.channel.send(banEmbed);
}

  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

// FUN COMMANDS
//KISS
if (command ===`kiss`) {
    let hugresult = Math.floor((Math.random() * randomizer("kiss").length));
    if (!args[0]) {
        const ghembed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(`${message.author.username} kissed themself...`)
            .setImage('https://cdn.discordapp.com/attachments/452115003659780096/460369555823525898/kiss.gif')
        message.channel.send({
            embed: ghembed
        })
        return;
    }
    if (!message.mentions.members.first().user.username === message.isMentioned(message.author)) {
        const hembed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(`${message.author.username} gave ${message.mentions.members.first().user.username} a kiss!`)
            .setImage(randomizer("kiss"))
        message.channel.send({
            embed: hembed
        })
        return;
    }
    const ghembed = new Discord.RichEmbed()
        .setColor(`RANDOM`)
        .setTitle(`${message.author.username} kissed themself...!`)
        .setImage('https://cdn.discordapp.com/attachments/452115003659780096/460369555823525898/kiss.gif')
    message.channel.send({
        embed: ghembed
    })
}

// FUN COMMANDS
// TAUNT
if(command === "taunt") {
  let userm = message.mentions.users.first()
    if(!userm) return message.channel.send("You must tag a person to use this command");
    const embed = new Discord.RichEmbed()
    .setTitle(`${message.author.username} makes fun of ${userm.username} <(*ΦωΦ*)>`)
    .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
    .setImage(randomizer("taunt"))
    .setTimestamp()
     message.channel.send({embed});
   }

   // FUN COMMANDS
   // CUDDLE
   if(command === "cuddle") {
     let userm = message.mentions.users.first()
if(!userm) return message.channel.send("You must tag a person to use this command");
const embed = new Discord.RichEmbed()
.setTitle(`${message.author.username} cuddles with ${userm.username}' *:･ﾟ✧(=✪ ᆺ ✪=)*:･ﾟ✧`)
.setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
.setImage(randomizer("cuddle"))
.setTimestamp()
 message.channel.send({embed});
}

// FUN COMMANDS
// HUG
if(command === "hug") {
let userm = message.mentions.users.first()
if(!userm) return message.channel.send("You must tag a person to use this command");
const embed = new Discord.RichEmbed()
.setTitle(`${message.author.username} hugs ${userm.username}' *:･ﾟ✧(=✪ ᆺ ✪=)*:･ﾟ✧`)
.setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
.setImage(randomizer("hug"))
.setTimestamp()
 message.channel.send({embed});
}

// FUN COMMANDS
// KARATE
if(command === "karate") {
let userm = message.mentions.users.first()
if(!userm) return message.channel.send("You must tag a person to use this command");
const embed = new Discord.RichEmbed()
.setTitle(`${message.author.username} kicks ${userm.username}'s butt (=ㅇᆽㅇ=)`)
.setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
.setImage(randomizer("kick"))
.setTimestamp()
 message.channel.send({embed});
}

// FUN COMMANDS
// BITE
if(command === "bite") {
  let userm = message.mentions.users.first()
  if(!userm) return message.channel.send("You must tag a person to use this command");
  const embed = new Discord.RichEmbed()
  .setTitle(`${message.author.username} is angry and bites ${userm.username} (ﾐዕᆽዕﾐ)`)
  .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
  .setImage(randomizer("bite"))
  .setTimestamp()
   message.channel.send({embed});
  }

  // FUN COMMANDS
  // HEART REACTION
  if(command === "react") {
    message.channel.send("What heart do you like the most?")
            .then(function (message) {
              message.react("❤")
              message.react("💛")
              message.react("💙")
              message.react("💜")
              message.react("🖤")
            }).catch(function(error) {
             console.log(error)
             });
           }


// FUN COMMANDS
// POKE
if(command === "poke") {
  let userm = message.mentions.users.first()
  if(!userm) return message.channel.send("You must tag a person to use this command");
  const embed = new Discord.RichEmbed()
  .setTitle(`${message.author.username} noticed ${userm.username} (=^･ｪ･^=))ﾉ彡☆`)
  .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
  .setImage(randomizer("poke"))
  .setTimestamp()
   message.channel.send({embed});
  }

  // FUN COMMANDS
  // RANDOMPUPPY
if(command === "randompuppy") {
  randomPuppy().then(url =>{

        message.channel.send(url);


  }).catch(err => message.channel.send("Error, please try again."));
}

  // FUN COMMANDS
  // AVATAR
if(command === "avatar") {
  let img = message.mentions.users.first()

  if (!img) {

      const embed = new Discord.RichEmbed()
      .setImage(`${message.author.avatarURL}`)
      .setColor(0x66b3ff)
      .setFooter(`${message.author.username}#${message.author.discriminator}`);
      message.channel.send({ embed });

  } else if (img.avatarURL === null) {
      //if the user does not have an avatar

      const embed = new Discord.RichEmbed()
      .setImage(`${message.author.defaultAvatarURL}`)
      .setColor(0x66b3ff)
      .setFooter(`${message.author.username}#${message.author.discriminator}`);
      message.channel.send({ embed });

  } else {

      const embed = new Discord.RichEmbed()
      .setImage(`${img.avatarURL}`)
      .setColor(0x66b3ff)
      .setFooter(`${img.username}#${img.discriminator}'s Avatar'`);
      message.channel.send({ embed });

  };
  }

// NSFW COMMANDS
// LEWD
 if(command === "lewd") {
   const embed = new Discord.RichEmbed()
 .setTitle(`${message.author.username} is L-Lewd... :tongue: :eggplant: :sweat_drops: `)
 .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
 .setImage(randomizer("lewd"))
 .setTimestamp()
  message.channel.send({embed});

   }

   // NSFW COMMANDS
   // LEWD
    if(command === "boobs") {
      const embed = new Discord.RichEmbed()
    .setTitle(`${message.author.username} wants some BOOOOOOOBS `)
    .setFooter(`${message.author.username}`, `${client.user.avatarURL}`)
    .setImage(randomizer("boobs"))
    .setTimestamp()
     message.channel.send({embed});

      }

// MUSIC
// PLAY
if(command === "play") {
if (queue[message.guild.id] === undefined) return message.channel.sendMessage(`Add some songs to the queue first with ${config.prefix}add`);
        if (queue[message.guild.id].playing) return message.channel.sendMessage('Already Playing');
        if (!message.member.voiceChannel) return message.channel.send(' Nesecitas conectarte a un canal de voz para usar este comando').then(m => {    m.delete(2000);  });

  	let dispatcher;
		queue[message.guild.id].playing = true;

		console.log(queue);
		(function play(song) {
			console.log(song);
			if (song === undefined) return message.channel.sendMessage('Queue is empty').then(() => {
				queue[message.guild.id].playing = false;
				message.member.voiceChannel.leave();
			});

      message.delete().catch(O_o=>{});

          const embed = new Discord.RichEmbed()
          .setTitle(`Playing: **${song.title}** as requested by: **${song.requester}**`)
          .setColor('#f703e0')
          .setFooter(`Just enjoy!`, `${client.user.avatarURL}`)
          .setTimestamp()
           message.channel.send({embed});

			dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }));
			let collector = message.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(config.prefix + 'pause')) {
					message.channel.sendMessage('paused').then(() => {dispatcher.pause();});
				} else if (m.content.startsWith(config.prefix + 'resume')){
					message.channel.sendMessage('resumed').then(() => {dispatcher.resume();});
				} else if (m.content.startsWith(config.prefix + 'skip')){
					message.channel.sendMessage('skipped').then(() => {dispatcher.end();});
				} else if (m.content.startsWith(config.prefix + 'volume+')){
                    if (!message.member.voiceChannel) return message.channel.send(' Nesecitas conectarte a un canal de voz para usar este comando').then(m => {    m.delete(2000);  });
					if (Math.round(dispatcher.volume*50) >= 100) return message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(config.prefix + 'volume-')){
                    if (!message.member.voiceChannel) return message.channel.send(' Nesecitas conectarte a un canal de voz para usar este comando').then(m => {    m.delete(2000);  });
					if (Math.round(dispatcher.volume*50) <= 0) return message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(config.prefix + 'time')){
					message.channel.sendMessage(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[message.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return message.channel.sendMessage('error: ' + err).then(() => {
					collector.stop();
					play(queue[message.guild.id].songs.shift());
				});
			});
        })(queue[message.guild.id].songs.shift());
    }

// MUSIC
// ADD
if(command === "add") {
const yt = require('ytdl-core');
let url = message.content.split(' ')[1];
if (url == '' || url === undefined) return message.channel.sendMessage(`You must add a YouTube video url`);

yt.getInfo(url, (err, info) => {
    if(err) return message.channel.sendMessage('Invalid YouTube Link: ' + err);
    if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
    queue[message.guild.id].songs.push({url: url, title: info.title, requester: message.author.username});

message.delete().catch(O_o=>{});

    const embed = new Discord.RichEmbed()
    .setTitle(`**${message.author.username}** added **${info.title}** to the queue`)
    .setFooter(`That is a good song!`, `${client.user.avatarURL}`)
    .setTimestamp()
     message.channel.send({embed});

});
return new Promise((resolve, reject) => {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
    voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
});
}

// MUSIC
// JOIN
if(command === "join") {
    return new Promise((resolve, reject) => {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
        voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
    });
}

// MUSIC
// QUEUE
if(command === "queue") {
if (queue[message.guild.id] === undefined) return message.channel.sendMessage(`Add some songs to the queue first with ${config.prefix}add`);
        let tosend = [];
        queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
        message.channel.sendMessage(`__**${message.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
}

// MUSIC
// LEAVE
let Canalvoz = message.member.voiceChannel;
if(command === "leave") {
  if(!Canalvoz) {
    message.channel.send('You need to be connected to a voice channel to use that command.');

} else {
    message.channel.send('Leaving...').then(() => {
        Canalvoz.leave();
})
}
}


// MANAGEMENT
// REBOOT
 if(command === "reload") {
message.channel.send("Complete :white_check_mark:").then(() => {
    client.destroy().then(() => {
        process.exit();
    });
});
}

// MANAGEMENT
// EVAL
if(command === "eval") {
const content = message.content.split(' ').slice(1);
        const args = content.join(' ');
      let limit = 1950;
    try {
      let code = args;
      let evalued = eval(code);
      if (typeof evalued !== "string")
        evalued = require("util").inspect(evalued);
      let txt = "" + evalued;
      if (txt.length > limit) {
        message.channel.send(`\`\`\`js\n ${txt.slice(0, limit)}\n\`\`\``);
      }
      else
        message.channel.send(`\`\`\`js\n ${txt}\n\`\`\``);
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`js\n${err}\n\`\`\``);
    }
}

// MANAGEMENT
// HELP
if(command === "help") {
const embed = new Discord.RichEmbed()
.setColor(`RANDOM`)
 .addField("═══════════════════════════════════════", "󠀡")
.setFooter("MY DEVELOPERS: Daii#7022 And Nate#7325!", client.user.avatarURL)
.setImage("https://s15.postimg.cc/ogz5mgja3/Sin_t_tulo-3.jpg")
.setTimestamp()
.addField(":crossed_swords:  [FUN COMMANDS]", "CUDDLE | COINFLIP | TAUNT | HUG | KISS | BITE | KARATE | AVATAR  | RANDOMPUPPY | SAY")
.addBlankField()
.addField(":necktie:  [MODERATION]", "KICK | BAN | WARN | REPORT.")
.addBlankField()
.addField(":warning:  [NSFW]", "LEWD | BOOBS.")
.addBlankField()
.addField(":musical_note:  [MUSIC]", "JOIN | ADD | PLAY | QUEUE | VOLUME+ | VOLUME- | LEAVE")
.addBlankField()
.addField(":thumbsup:  [SUPPORT US]", "VOTE HERE:", true)
.addBlankField()
 .addField("═══════════════════════════════════════ ", "󠀡")

message.channel.send({embed});
  }

  // MANAGEMENT
  // HELP
  if(command === "info") {
String.prototype.HorasMinutosSegundos = function () {
  var sec_num = parseInt(this, 10);
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      var time    = hours+':'+minutes+':'+seconds;
      return time;
    }

    var time = process.uptime();
    var tiempo_conformato = (time + "").HorasMinutosSegundos()

var actividad = process.uptime();
const embed = new Discord.RichEmbed()
.setColor(0x66ff66)

.setAuthor(`Bot info`, client.user.avatarURL)
.addField(`Owner`, `Daii#7022`, true)
.addField(`Version`, `1.0.0`, true)
.addField(`Libreria`, `Discord ^11.2.1 (Js)`, true)

.addField(`Memory`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
.addField(`Uptime`, `${actividad}`, true)
.addField(`Servers`, `${client.guilds.size.toLocaleString()}`, true)

.addField(`Users`, `${client.users.size.toLocaleString()}`, true)
.addField(`Channels`, `${client.channels.size.toLocaleString()}`, true)
.addField(`Voice connections`, `${client.voiceConnections.size}`, true)

message.channel.send({embed});
}

// aasdada
// aasdadaa

    });

client.login(config.token);
