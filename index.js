const Discord = require('discord.js')
const nekos = require('nekos.life');
const fs = require("fs");
const {CommandCooldown, msToMinutes} = require('discord-command-cooldown');
const ms = require('ms');
const { Client, Intents, Permission, GatewayIntentBits,  Args, Add, MessageButton, MessageActionRow, MessageEmbed, MessageCollector, MessageSelectMenu, ActionRowBuilder, Modal, TextInputBuilder, TextInputStyle, TextChannel} = require('discord.js');
const users = require('./users.json')
const { QuickDB } = require("quick.db");
const botSettings = require('./settings.json')

const neko = new nekos();
const db = new QuickDB();
const earnCashCommandCooldown = new CommandCooldown('earnCash', ms('6h'));
const collectedCommandCooldown = new CommandCooldown('collected', ms('12h'));

const discord_jsVersion = '13.1.0'; // Write in this const version discord.js из ./package.json !
const prefix = botSettings.prefix;
const token = botSettings.token;
/* 
When migrating to a new version of discord.js, replace Discord.MessageEmbed with Discord.EmbedConstructor
In case of questions, please contact YaFlay#3161 / https://t.me/bebra_yaflay
*/
// Bot require to rewrite this
console.log(discord_jsVersion)
if (discord_jsVersion >= '13.1.0' ){
  const {IntentsBitField, GatewayIntentBits } = require('discord.js')
  const myIntents = new IntentsBitField();
  myIntents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers);
}else{
    var intents= [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES, 
      Intents.FLAGS.DIRECT_MESSAGES, 
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
      Intents.FLAGS.GUILD_MESSAGE_TYPING, 
      Intents.FLAGS.DIRECT_MESSAGES, 
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, 
      Intents.FLAGS.DIRECT_MESSAGE_TYPING, 
      Intents.FLAGS.GUILD_MEMBERS, 
      Intents.FLAGS.GUILD_PRESENCES, 
      Intents.FLAGS.GUILD_BANS, 
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILDS ]
}
// Connect
const client = new Client({ intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,] })
client.on('ready', async () => {
console.log(`${client.user.tag} запущен!`);
client.user.setStatus("online");
if (discord_jsVersion >= '13.1.0' ){
  client.user.setActivity(`!помощь`, { type: Discord.ActivityType.Watching })
}else{
  client.user.setActivity(`!помощь`, { type: "WATCHING" })
}
});




client.on('messageCreate', async message => {
  if (!message.author.bot) {
    if (message.guild.id == 780911193329762305) { 
      let user = users[message.author.id];
      if (!user) {
        users[message.author.id] = {
            coin: 0,
            lvl: 0,
            xp: 0
          }
      } else {
        let giveXp = Math.floor(Math.random() * 5) + 1;
        let giveCoin = Math.floor(Math.random() * 10) + 1;
        let userInfo = users[message.author.id];
        userInfo.xp = userInfo.xp + giveXp
        userInfo.coin = userInfo.coin + giveCoin
        if(userInfo.xp > 100) {
            userInfo.lvl++
            userInfo.xp = 0
            userInfo.coin = userInfo.coin + 50
            let lvlAlert = new Discord.EmbedConstructor()
              .setTitle('**Koshki.bot ALERT**')
              .setDescription(`🎉 <@${message.author.id}>, у вас новый уровень!\n**Ваш уровень:** ${userInfo.lvl}`)
              .setColor('#2f3136')
            const channel = client.channels.cache.get('796068482923233300')
            channel.send({content:`<@${message.author.id}>` , embeds: [lvlAlert]});

        }
        if(userInfo.lvl == 5) {
          message.member.roles.add('798948821613805609')
        }
        if(userInfo.lvl == 15) {
          message.member.roles.add('798948836064231464')
        }
        if(userInfo.lvl == 25) {
          message.member.roles.add('798949449594175488')
        }
        if(userInfo.lvl == 35) {
          message.member.roles.add('798949497954238564')
        }
        if(userInfo.lvl == 40) {
          message.member.roles.add('810206229275475998')
        }
        if(userInfo.lvl == 50) {
          message.member.roles.add('798949600601571339')
        }
      }
    }
  }
})

//Работа с записью данных
setInterval(function usersGet() {
  fs.writeFileSync('./users.json', JSON.stringify(users, null, "\t"));
}, 2000);

//Команды
client.on('messageCreate', async message => {
  //Роли 
  if (message.content.startsWith(`${prefix}роли`)) {
    message.delete()
    if (!message.author.id === '852617513070231593') return;

    let roleemb = new Discord.EmbedConstructor()
    .setTitle('Выберите Гендер')
    .setDescription('В данном канале вы можете выбрать гендер. **Есть 3 гендера на выбор:**\n\n• Кошкомальчик — :male_sign:\n• Кошкотрап — :restroom:\n• Кошкодевочка — :female_sign:')
    .setColor('#2f3136')
    .setImage('https://media.discordapp.net/attachments/797411622313263104/866014973742546994/20210717_205212.png')

    let rolebutton = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setCustomId('catboy')
      .setLabel('Кошкомальчик')
      .setEmoji('♂️')
      .setStyle('SUCCESS'),
      new MessageButton()
      .setCustomId('catgirl')
      .setLabel('Кошкодевочка')
      .setEmoji('♀️')
      .setStyle('SUCCESS'),
      new MessageButton()
      .setCustomId('catrap')
      .setLabel('Кошкотрап')
      .setEmoji('🚻')
      .setStyle('SUCCESS')
    )

    message.channel.send({ embeds: [roleemb], components: [rolebutton] })
  }

  //Профиль
  if (message.content.startsWith(`${prefix}профиль`) || message.content.startsWith(`${prefix}паспорт`) || message.content.startsWith(`${prefix}profile`) || message.content.startsWith(`${prefix}prof`)) {
message.delete()
  let userInfo = users[message.author.id];
  const profile = new Discord.EmbedConstructor()
    .setColor('#fdbaba')
    .setTitle(`Профиль ${message.author.username}`)
    .setDescription('**Ваш баланс:** '+ userInfo.coin + '🪙' +`\n**Ваш уровень:** `+ userInfo.lvl + `\n**Ваш ХП:** `+ userInfo.xp)
  message.channel.send({ embeds: [profile] });
} //Аватарка

if (message.content.startsWith(`${prefix}аватарка`)) {
  message.delete()
  if (!message.mentions.users.size) {
    const avatarAuthor = new Discord.EmbedConstructor()
        .setTitle(`Аватарка -> ${message.author.username}`)
        .setColor('#fdbaba')
        .setImage(message.author.displayAvatarURL({ format: 'png' }));
    return message.channel.send({ embeds: [avatarAuthor] });
    }
    let mention = message.mentions.members.first();
    const avatarMention = new Discord.EmbedConstructor()
        .setTitle(`Аватарка -> ${message.mentions.users.first().username}`)
        .setColor('#fdbaba')
        .setImage(mention.user.displayAvatarURL({ format: 'png' }));
    return message.channel.send({ embeds: [avatarMention] });
} //Помощь


 if (message.content.startsWith(`${prefix}помощь`) || message.content.startsWith(`${prefix}help`)) {
  if (!message.channel.name === 'DM') return message.channel.send("Эта команда работает только в личных сообщениях бота!")

    const help = new Discord.EmbedConstructor()
      .setTitle('Команды Koshki.Fun')
      .setColor('#fdbaba')
      .setDescription('😸 **Весёлое**\n`!поцеловать @user` `!обнять @user` `!ударить @user` `!погладить @user` `!аватарка @user` `!котик`\n\n<:catcoin:956825772407025714> **Экономика**\n`!работа` `!магазин` `!профиль`')
    message.channel.send({ embeds: [help] });
} //Работа 


if (message.content.startsWith(`${prefix}работа`) || message.content.startsWith(`${prefix}work`)) {
  var userCooldowned = await earnCashCommandCooldown.getUser(message.author.id);
  if (!userCooldowned) {
    let random = Math.floor(Math.random() * 250) + 50;
    let userInfo = users[message.author.id];
    const workEmbed = new Discord.EmbedConstructor()
      .setTitle('Успех!')
      .setDescription(`Вы успешно собрали бутылки с улицы и получили ${random}<:catcoin:956825772407025714>!`)
      .setColor('#82eb7e')
    // .setFooter({ text: `Nickname: ${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ format: 'png' })}`})
    message.channel.send({ embeds: [workEmbed] })
    userInfo.coin = userInfo.coin + random
    await earnCashCommandCooldown.addUser(message.author.id); // Cooldown user again
  } else {
    let timeLeft = msToMinutes(userCooldowned.msLeft, false); // False for excluding '0' characters for each number < 10
    message.reply(`Вам нужно подождать ${ timeLeft.hours + ' часов, ' + timeLeft.minutes + ' минут, ' + timeLeft.seconds + ' секунд'}, чтобы запустить команду вновь!`);
  }
}

//Обнять
if (message.content.startsWith(`${prefix}обнять`)) { 
  message.delete()
  let author = message.author.id 
  let mention = message.mentions.users.first();

  if (!mention) return message.channel.send('Нужно упомянуть человека, чтобы его/её обнять.');
   async function ping() {

  let GIF = await neko.hug();

  const hug = new Discord.EmbedConstructor()
       .setDescription(`<@${author}> обнял(-а) <@${mention.id}>`)
       .setImage(GIF.url)
       .setColor('#fdbaba')
      message.channel.send({ embeds: [hug] })
 }
 ping();
} // Погладить
  if (message.content.startsWith(`${prefix}погладить`)) {
  message.delete()
  let author = message.author.id 
  let mention = message.mentions.users.first();

  if (!mention) return message.channel.send('Нужно упомянуть человека, чтобы его/её погладить.');

  async function ping() {
    let GIF = await neko.pat();

    const pat = new Discord.EmbedConstructor()
    .setDescription(`<@${author}> погладил(-а) <@${mention.id}>`)
    .setImage(GIF.url)
    .setColor('#fdbaba')
    message.channel.send({ embeds: [pat] })
  }
  ping();
}
//Ударить
if (message.content.startsWith(`${prefix}ударить`)) {
  message.delete()
  let author = message.author.id 
  let mention = message.mentions.users.first();

  if (!mention) return message.channel.send('Нужно упомянуть человека, чтобы его/её ударить.');

  async function ping() {
    let GIF = await neko.slap();

    const slap = new Discord.EmbedConstructor()
    .setDescription(`<@${author}> ударил(-а) <@${mention.id}>`)
    .setImage(GIF.url)
    .setColor('#fdbaba')
    message.channel.send({ embeds: [slap] })
  }
  ping();
}
//Котик
  if (message.content.startsWith(`${prefix}котик`)) {
    message.delete()
  async function cat() {
          const GIF = await neko.meow();
          const cat = new Discord.EmbedConstructor()
          .setColor('#fdbaba')
          .setDescription(`<@${message.author.id }> держи рандомную GIF/Пикчу котика <3`)
          .setImage(GIF.url)
          message.channel.send({ embeds: [cat] })
          }
          cat();
  } //Поцеловать
   if (message.content.startsWith(`${prefix}поцеловать`)) {
    message.delete()
    let author = message.author.id 
    let mention = message.mentions.users.first();

    if (!mention) return message.channel.send('Нужно упомянуть человека, чтобы его/её поцеловать.');

    async function ping() {
      let GIF = await neko.kiss();

      const kiss = new Discord.EmbedConstructor()
      .setDescription(`<:kiss:958359400819589170> <@${author}> поцеловал(-а) <@${mention.id}>`)
      .setImage(GIF.url)
      .setColor('#fdbaba')
      message.channel.send({ embeds: [kiss] })
    }
    ping();
  }})


  // Работы удалены за ненадобностью. Функцию перенял Aoyo бот. Бекап лежит в директории (smb: or /home/yaflay/)discord/index.js 


//Магазин
client.on('messageCreate', message => {
  if (message.content.startsWith(`${prefix}магазин`)) {
    message.delete()

  const shop = new Discord.EmbedConstructor()
  .setTitle('🛒 Магазин ролей 🛒')
  .setDescription('`Чтобы купить роль, нажмите на кнопку ниже`\n\n**1.000 <:catcoin:956825772407025714> - Кися**\nПри покупки данного товара вам выдается:\n- Возможность получать бонус 50 <:catcoin:956825772407025714> каждые 12 часов\n- Роль, которая будет выделятся справа в списке участников\n\n**5.000 <:catcoin:956825772407025714> - Старшая Кися**\nПри покупки данного товара вам выдается:\n- Возможность получать бонус 100 <:catcoin:956825772407025714> каждые 12 часов\n- Роль, которая будет выделятся справа в списке участников\n\n*Все преимущества старой роли - остаются.*')
  .setColor('#fdbaba')
    
  const magaz = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('kicya')
          .setLabel('Кися')
          .setStyle('SECONDARY')
          .setEmoji('797293706678894592'),
          new MessageButton()
          .setCustomId('oldkicya')
          .setLabel('Старшая Кися')
          .setStyle('SECONDARY')
          .setEmoji('805201954741551134'),
      );
      message.channel.send({ embeds: [shop], components: [magaz] });
  }
});

      client.on('interactionCreate', async (interaction) => {
        if(interaction.customId === 'kicya'){
          if(!interaction.member.roles.cache.has('780912227862577203')){
            let userInfo = users[interaction.member.user.id]
            if (userInfo.coin >= 1000) {
           await interaction.member.roles.add('780912227862577203')
            interaction.reply({ content: 'Готово! Вы успешно купили роль: <@&780912227862577203>', ephemeral: true })
            userInfo.coin = userInfo.coin - 1000
            } else {
              interaction.reply({ content: 'У вас недостаточно средств на балансе!', ephemeral: true })
            }
        } else {
          interaction.reply({ content: 'У вас уже есть роль: <@&780912227862577203>', ephemeral: true })
        }
      }
       if(interaction.customId === 'oldkicya'){
          if(!interaction.member.roles.cache.has('780912295412629517')){
            let userInfo = users[interaction.member.user.id]
            if (userInfo.coin >= 5000) {
           await interaction.member.roles.add('780912295412629517')
            interaction.reply({ content: 'Готово! Вам была выдана роль <@&780912295412629517>', ephemeral: true })
            userInfo.coin = userInfo.coin - 5000
            } else {
              interaction.reply({ content: 'У вас недостаточно средств на балансе!', ephemeral: true })
            }
        } else {
          interaction.reply({ content: 'У вас уже есть роль: <@&780912295412629517>', ephemeral: true })
        }
      }
      })

client.on('messageCreate', async message => {
  if (message.content.startsWith(`${prefix}бонус`) || message.content.startsWith(`${prefix}collect`)) { 
    var userCooldownedCollect = await collectedCommandCooldown.getUser(message.author.id);
    if (!userCooldownedCollect) {
      if (message.member.roles.cache.some(r=>["[😺] котёнок"].includes(r.name))) {
        let userInfo = users[message.author.id];
        const collectSmallMonkey = new Discord.EmbedConstructor()
        .setTitle('Вы успешно собрали награду!')
        .setDescription('<@&780912153536233501> | 50 <:catcoin:956825772407025714>')
        .setColor('#82eb7e')
        .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ format: 'png' })}`})
        message.channel.send({ embeds: [collectSmallMonkey] })
  
      userInfo.coin = userInfo.coin + 50
      await collectedCommandCooldown.addUser(message.author.id); // Cooldown user again
      } if (message.member.roles.cache.some(r=>["[🐈] кися"].includes(r.name))) {
        let userInfo = users[message.author.id];
        const collectMonkey = new Discord.EmbedConstructor()
        .setTitle('Вы успешно собрали награду!')
        .setDescription('<@&780912227862577203> | 100 <:catcoin:956825772407025714>')
        .setColor('#82eb7e')
        .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ format: 'png' })}`})
        message.channel.send({ embeds: [collectMonkey] })
  
      userInfo.coin = userInfo.coin + 100
      await collectedCommandCooldown.addUser(message.author.id); // Cooldown user again 
      } if (message.member.roles.cache.some(r=>["[😻] старшая кися"].includes(r.name))) {
        let userInfo = users[message.author.id];
        const collectOldMonkey = new Discord.EmbedConstructor()
        .setTitle('Вы успешно собрали награду!')
        .setDescription('<@&780912295412629517> | 150 <:catcoin:956825772407025714>')
        .setColor('#82eb7e')
        .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ format: 'png' })}`})
        message.channel.send({ embeds: [collectOldMonkey] })
  
      userInfo.coin = userInfo.coin + 150
      await collectedCommandCooldown.addUser(message.author.id); // Cooldown user again 
      }
    } else {
      let timeLeft = msToMinutes(userCooldownedCollect.msLeft, false); // False for excluding '0' characters for each number < 10
      message.reply(`Вам нужно подождать ${ timeLeft.hours + ' часов, ' + timeLeft.minutes + ' минут, ' + timeLeft.seconds + ' секунд'}, чтобы запустить команду вновь!`);
    }
  } 
})


//Войс
  // Создание кастомного войс канала удалено за ненадобностью. Функцию перенял Aoyo бот. Бекап лежит в директории (smb: or /home/yaflay/)discord/index.js 

client.on('interactionCreate', async interaction => {
  if (interaction.customId === 'rename'){
    const Modal = new Modal()
			.setCustomId('renameModal')
			.setTitle('Новое название комнаты');
    const name = new TextInputBuilder()
  		.setCustomId('name')
  		.setLabel("Какое новое название?")
  		.setStyle('SHORT');

		const firstActionRow = new MessageActionRow().addComponents(name);
		Modal.addComponents(firstActionRow);

		await interaction.showModal(Modal);
  } if (interaction.customId === 'renameModal'){
    const newname = interaction.fields.getTextInputValue('name')
    const oldname = await db.get(`voice_${interaction.user.id}`)

    if (interaction.member.voice.channelId){
      const voiceid = interaction.member.voice.channelId
      const channel = interaction.guild.channels.cache.get(voiceid)
      if (channel.name === oldname){
        db.set(`voice_${interaction.user.id}`, newname)
        channel.edit({
          name: `${newname}`,
          permissionOverwrites: [
            {
              id: interaction.user.id,
              deny: ["MANAGE_CHANNELS", "MUTE_MEMBERS", "DEAFEN_MEMBERS"],
            },
            {
              id: interaction.guild.roles.everyone,
              deny: ['MANAGE_CHANNELS'],
            },
          ],
        })
        interaction.reply({ content: ':white_check_mark: Вы успешно сменили название своей комнаты!', ephemeral: true })
      }
    } else {
      interaction.reply({ content: '⚠️ Упс.. Кажется у вас нет собственной приватной комнаты.', ephemeral: true })
    }
  } if (interaction.customId === 'limit'){
    const Modals = new Modal()
			.setCustomId('limitModal')
			.setTitle('Лимит участников комнаты');
    const max = new TextInputBuilder()
		.setCustomId('max')
		.setLabel("Какой лимит участников?")
		.setStyle('SHORT');

		const firstActionRow = new MessageActionRow().addComponents(max);
		Modal.addComponents(firstActionRow);

		await interaction.showModal(Modal);
  } if (interaction.customId === 'limitModal'){
    const newlimit = interaction.fields.getTextInputValue('max')
    const name = await db.get(`voice_${interaction.user.id}`)
    if (interaction.member.voice.channelId){
      const voiceid = interaction.member.voice.channelId
      const channel = interaction.guild.channels.cache.get(voiceid)
      if (!isNaN(newlimit) && newlimit < 100){
        channel.setUserLimit(newlimit)
        await interaction.reply({ content: ':white_check_mark: Вы успешно поставили лимит в вашей комнате!', ephemeral: true })
      } else {
        await interaction.reply({ content: '⚠️ Упс.. Кажется вы указали не число или число больше 99', ephemeral: true })
      }
    } else {
      interaction.reply({ content: '⚠️ Упс.. Кажется у вас нет собственной приватной комнаты.', ephemeral: true })
    }
  } if (interaction.customId === 'lock'){
    const name = await db.get(`voice_${interaction.user.id}`)
    const channel = client.channels.cache.find(channel => channel.name == name)
    if (!channel){
      await interaction.reply({ content: 'Упс.. Кажется вы не в своей комнате.', ephemeral: true })
    } else {
      const lockdb = await db.get(`voice_lock_${interaction.user.id}`)
      if (lockdb === 'true'){
        channel.permissionOverwrites.edit(interaction.guild.id, { 'CONNECT': false, 'SPEAK': false });
        await db.set(`voice_lock_${interaction.user.id}`, 'false')
        await interaction.reply({ content: 'Готово! Вы закрыли канал!', ephemeral: true });
      } else {
        channel.permissionOverwrites.edit(interaction.guild.id, { 'CONNECT': true, 'SPEAK': true });
        await db.set(`voice_lock_${interaction.user.id}`, 'true')
        await interaction.reply({ content: 'Готово! Вы открыли канал!', ephemeral: true });
      }
    }
  } if (interaction.customId === 'eyes'){
    const name = await db.get(`voice_${interaction.user.id}`)
    const channel = client.channels.cache.find(channel => channel.name == name)
    if (!channel){
      await interaction.reply({ content: 'Упс.. Кажется вы не в своей комнате.', ephemeral: true })
    } else {
      const eyesdb = await db.get(`voice_eyes_${interaction.user.id}`)
      if (eyesdb === 'true'){
        channel.permissionOverwrites.edit(interaction.guild.id, { 'VIEW_CHANNEL': false })
        await db.set(`voice_eyes_${interaction.user.id}`, 'false')
        await interaction.reply({ content: 'Готово! Вы спрятали канал!', ephemeral: true });
      } else {
        channel.permissionOverwrites.edit(interaction.guild.id, { 'VIEW_CHANNEL': true });
        await db.set(`voice_eyes_${interaction.user.id}`, 'true')
        await interaction.reply({ content: 'Готово! Вы открыли канал!', ephemeral: true });
      }
    }
  }
})

client.on('messageCreate', async (msg) => {
  if (msg.content.startsWith(`${prefix}управлять_бебр`)){
    msg.delete()
    
    let embed = new Discord.EmbedConstructor()
    .setTitle('Управление приватными комнатами')
    .setDescription('Вы можете изменить конфигурацию своей комнаты с помощью кнопок ниже.')
    .addFields(
      { name: 'Переименовать приватную комнату:', value: `✏️`, inline: false },
      { name: 'Задать лимит участников приватной комнаты:', value: `👥`, inline: false },
      { name: 'Закрыть/Открыть приватную комнату:', value: `🔒`, inline: false },
      { name: 'Скрыть/Открыть приватную комнату:', value: `👀`, inline: false },
    )
    .setColor('#2f3136')

    let row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('rename')
        .setEmoji('✏️')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('limit')
        .setEmoji('👥')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('lock')
        .setEmoji('🔒')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('eyes')
        .setEmoji('👀')
        .setStyle('SECONDARY'),
    )
    msg.channel.send({ embeds: [embed], components: [row] })
  }
})

client.on('interactionCreate', async i => {
  if (!i.isButton()) return
  if (i.customId === 'helper'){
    const Modals = new Modal()
			.setCustomId('helperModal')
			.setTitle('Заявка в Хелперы');
    const rokiv = new TextInputBuilder()
		.setCustomId('rokiv')
		.setLabel("Сколько вам лет?")
		.setStyle('SHORT');
		const rules = new TextInputBuilder()
			.setCustomId('rules')
			.setLabel("Знаете ли вы правила сервера?")
			.setStyle('SHORT');
    const rabota = new TextInputBuilder()
			.setCustomId('rabota')
			.setLabel("Был ли у вас опыт в данной сфере?")
			.setStyle('SHORT');
    const gramot = new TextInputBuilder()
			.setCustomId('gramot')
			.setLabel("Как вы оцениваете свою граммотность?")
			.setStyle('SHORT');

		const firstActionRow = new MessageActionRow().addComponents(rokiv);
		const secondActionRow = new MessageActionRow().addComponents(rules);
    const thierdActionRow = new MessageActionRow().addComponents(rabota);
    const chetuActionRow = new MessageActionRow().addComponents(gramot);
		Modal.addComponents(firstActionRow, secondActionRow, thierdActionRow, chetuActionRow);

		await i.showModal(Modal);
  } if (i.customId === 'mened'){
    const Modals = new Modal()
			.setCustomId('menedModal')
			.setTitle('Заявка в Мяунеджеры');
    const rokiv = new TextInputBuilder()
		.setCustomId('rokiv')
		.setLabel("Сколько вам лет?")
		.setStyle('SHORT');
		const rules = new TextInputBuilder()
			.setCustomId('rules')
			.setLabel("Знаете ли вы правила сервера?")
			.setStyle('SHORT');
    const rabota = new TextInputBuilder()
			.setCustomId('rabota')
			.setLabel("Был ли у вас опыт в данной сфере?")
			.setStyle('SHORT');
    const gramot = new TextInputBuilder()
			.setCustomId('gramot')
			.setLabel("Как вы оцениваете свою граммотность?")
			.setStyle('SHORT');

		const firstActionRow = new MessageActionRow().addComponents(rokiv);
		const secondActionRow = new MessageActionRow().addComponents(rules);
    const thierdActionRow = new MessageActionRow().addComponents(rabota);
    const chetuActionRow = new MessageActionRow().addComponents(gramot);
		Modal.addComponents(firstActionRow, secondActionRow, thierdActionRow, chetuActionRow);

		await i.showModal(Modal);
  }
})

client.on('interactionCreate', interaction => {
  if (interaction.customId === 'helperModal'){
	const rokiv = interaction.fields.getTextInputValue('rokiv');
	const rule = interaction.fields.getTextInputValue('rules');
  const rabota = interaction.fields.getTextInputValue('rabota');
	const gramot = interaction.fields.getTextInputValue('gramot');

  const embed = new Discord.EmbedConstructor()
  .setTitle(`${interaction.user.tag} подал заявку!`)
  .setDescription(`**Сколько вам лет?**\n\`${rokiv}\`\n**Знаете ли вы правила сервера?**\n\`${rule}\`\n**Был ли у вас опыт в данной сфере?**\n\`${rabota}\`\n**Как вы оцениваете свою граммотность?**\n\`${gramot}\``)
	.setColor('#2f3136')
  
  client.channels.cache.get('979847249716707368').send({ embeds: [embed] });
  interaction.reply({ content: ':white_check_mark: Вы успешно подали заявку! В скором времени администрация рассмотрит ее.', ephemeral: true })
  } if (interaction.customId === 'menedModal'){
    const rokiv = interaction.fields.getTextInputValue('rokiv');
    const rule = interaction.fields.getTextInputValue('rules');
    const rabota = interaction.fields.getTextInputValue('rabota');
    const gramot = interaction.fields.getTextInputValue('gramot');
  
    const embed = new Discord.EmbedConstructor()
    .setTitle(`${interaction.user.tag} подал заявку!`)
    .setDescription(`**Сколько вам лет?**\n\`${rokiv}\`\n**Знаете ли вы правила сервера?**\n\`${rule}\`\n**Был ли у вас опыт в данной сфере?**\n\`${rabota}\`\n**Как вы оцениваете свою граммотность?**\n\`${gramot}\``)
    .setColor('#2f3136')
    
    client.channels.cache.get('980176067279085668').send({ embeds: [embed] });
    interaction.reply({ content: ':white_check_mark: Вы успешно подали заявку! В скором времени администрация рассмотрит ее.', ephemeral: true })
    }
});

try { 
  client.login(token);
}catch{
  console.log('Error...')
  client.login(token);
}finally{
  return
}
