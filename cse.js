const Discord = require('discord.js');
const config = require('./config.json');
const enmap = require('enmap');
const enmapLevel = require('enmap-level');
const settings_cse = new enmap({provider:new enmapLevel({name:"settings_cse"})});
const client = new Discord.Client({autoReconnect:true});
const defaultSettings = {
    configRole:"Owner",
    toggled:false
}
client.login(config.token);
client.once('ready',()=>{
    console.log('Ready!');
});
client.on('guildDelete', guild=>{
    settings_cse.delete(guild.id);
});
client.on('message', message=>{
    if(message.guild == null || message.author.bot || message.content.includes("http://") || message.content.includes("https://")|| message.content.includes("hello")||message.content.includes("shell")){return;}
    if(!settings_cse.has(message.guild.id)){
        settings_cse.set(message.guild.id, defaultSettings);
    }
    const serverSettings = settings_cse.get(message.guild.id);
    if(!serverSettings.toggled){
        for(var i = config.banned.length; i-->0;){
            if(message.content.toLowerCase().replace(/[^a-z]/g,'').includes(config.banned[i])){
                console.log(message.content);
                message.channel.send(`${message.author}, no swearing on this christian server!`);        if(message.guild.available){
                if(message.guild.me.hasPermission("MANAGE_MESSAGES")){
                    message.delete();
                }
            }
                return;
            }
        }
    }
    const configRole = message.guild.roles.find("name", serverSettings.configRole);     
       if(configRole!=null?(message.member.roles.has(configRole.id)):(false) || message.author.id === message.guild.owner.user.id){
            const command = message.content;
            if(command.startsWith('†toggle')){
                serverSettings.toggled=!serverSettings.toggled;
                settings_cse.set(message.guild.id, serverSettings);
                message.channel.send(`${message.author} has made this server `+(serverSettings.toggled?"no longer ":"")+`a Christian Server!`);
            }
			else if(command.startsWith('†configrole ')){
                serverSettings.configRole = command.split(" ")[1];
                settings_cse.set(message.guild.id, serverSettings);
                message.channel.send(`All members with the role ${serverSettings.configRole} can now toggle/configure the bot.`);
            }
        }
});
