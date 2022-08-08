const SETTINGSFILE = 'ios.json';

bleServiceOptions.ancs = true;
if (NRF.amsIsActive) bleServiceOptions.ams = true; // amsIsActive was added at the same time as the "am" option
Bangle.ancsMessageQueue = [];

// Built-ins
let facetime;
let messages;
let phone;

// Socials
let discord;
let instagram;
let messenger;
let signal;
let snapchat;
let telegram;
let whatsapp;

// Productivity
let gcal;
let outlook;
let shop;
let teams;

// Other
let other;

function loadSettings(){
  function def (value, def) {return value !== undefined ? value: def;}

  var settings = require('Storage').readJSON(SETTINGSFILE, true) || {};
  
  facetime = {
    "enabled": def(settings.facetime, true),
    "appName": "com.apple.facetime",
  };
  messages = {
    "enabled": def(settings.messages, true),
    "appName": "com.apple.MobileSMS",
  };
  phone = {
    "enabled": def(settings.phone, true),
    "appName": "com.apple.mobilephone"
  };


  discord = {
    "enabled": def(settings.discord, true),
    "appName": "com.hammerandchisel.discord",
  };

  instagram = {
    "enabled": def(settings.instagram, false),
    "appName": "com.burbn.instagram",
  };
  messenger = {
    "enabled": def(settings.messenger, true),
    "appName": "com.facebook.messenger",
  };

  signal = {
    "enabled": def(settings.signal, true),
    "appName": "org.whispersystems.signal",
  };
  snapchat = {
    "enabled": def(settings.snapchat, true),
    "appName": "com.toyopagroup.picaboo",
  };

  telegram = 
  {
    "enabled": def(settings.telegram, false),
    "appName": "ph.telegra.Telegraph",
  };

  whatsapp = {
    "enabled": def(settings.whatsapp, false),
    "appName": "net.whatsapp.WhatsApp",
  };


  gcal = {
    "enabled": def(settings.gcal, true),
    "appName": "com.google.calendar",
  };

  outlook = {
    "enabled": def(settings.outlook, true),
    "appName": "com.microsoft.Office.Outlook",
  };

  shop = {
    "enabled": def(settings.shop, true),
    "appName": "com.shopify.shop",
  };

  teams = {
    "enabled": def(settings.teams, true),
    "appName": "com.microsoft.skype.teams",
  };


  other = def(settings.other, false);
}

loadSettings(); // load/initialize settings because we need those

/* Handle ANCS events coming in, and fire off 'notify' events
when we actually have all the information we need */
E.on('ANCS',msg=>{
  /* eg:
  {
    event:"add",
    uid:42,
    category:4,
    categoryCnt:42,
    silent:true,
    important:false,
    preExisting:true,
    positive:false,
    negative:true
    } */

  //console.log("ANCS",msg.event,msg.id);
  // don't need info for remove events - pass these on
  if (msg.event=="remove")
    return E.emit("notify", msg);

  // not a remove - we need to get the message info first
  function ancsHandler() {
    var msg = Bangle.ancsMessageQueue[0];
    NRF.ancsGetNotificationInfo( msg.uid ).then( info => {

      if(msg.preExisting === true){
        info.new = false;
      } else {
        info.new = true;
      }

      // in here, check to see if notification should be permitted

      // if so, continue with notify

      // otherwise, discard silently

      E.emit("notify", Object.assign(msg, info));
      Bangle.ancsMessageQueue.shift();
      if (Bangle.ancsMessageQueue.length)
        ancsHandler();
    });
  }
  Bangle.ancsMessageQueue.push(msg);
  // if this is the first item in the queue, kick off ancsHandler,
  // otherwise ancsHandler will handle the rest
  if (Bangle.ancsMessageQueue.length==1)
    ancsHandler();
});

// Handle ANCS events with all the data
E.on('notify',msg=>{
/* Info from ANCS event plus
  "uid" : int,
  "appId" : string,
  "title" : string,
  "subtitle" : string,
  "message" : string,
  "messageSize" : string,
  "date" : string,
  "new" : boolean,
  "posAction" : string,
  "negAction" : string,
  "name" : string,
*/
  var appNames = {
    "ch.publisheria.bring": "Bring",
    "com.apple.facetime": "FaceTime",
    "com.apple.mobilecal": "Calendar",
    "com.apple.mobilemail": "Mail",
    "com.apple.mobilephone": "Phone",
    "com.apple.mobileslideshow": "Pictures",
    "com.apple.MobileSMS": "SMS Message",
    "com.apple.Passbook": "iOS Wallet",
    "com.apple.podcasts": "Podcasts",
    "com.apple.reminders": "Reminders",
    "com.apple.shortcuts": "Shortcuts",
    "com.apple.TestFlight": "TestFlight",
    "com.apple.ScreenTimeNotifications": "ScreenTime",
    "com.apple.wifid.usernotification": "WiFi",
    "com.atebits.Tweetie2": "Twitter",
    "com.burbn.instagram" : "Instagram",
    "com.facebook.Facebook": "Facebook",
    "com.facebook.Messenger": "Messenger",
    "com.google.Chromecast" : "Google Home",
    "com.google.Gmail" : "GMail",
    "com.google.calendar": "GCal",
    "com.google.hangouts" : "Hangouts",
    "com.google.ios.youtube" : "YouTube",
    "com.hammerandchisel.discord" : "Discord",
    "com.ifttt.ifttt" : "IFTTT",
    "com.jumbo.app" : "Jumbo",
    "com.linkedin.LinkedIn" : "LinkedIn",
    "com.marktplaats.iphone": "Marktplaats",
    "com.microsoft.Office.Outlook" : "Outlook Mail",
    "com.microsoft.skype.teams": "Teams",
    "com.nestlabs.jasper.release" : "Nest",
    "com.netflix.Netflix" : "Netflix",
    "com.reddit.Reddit" : "Reddit",
    "com.readdle.smartemail": "Spark",
    "com.skype.skype": "Skype",
    "com.skype.SkypeForiPad": "Skype",
    "com.spotify.client": "Spotify",
    "com.storytel.iphone": "Storytel",
    "com.strava.stravaride": "Strava",
    "com.tinyspeck.chatlyio": "Slack",
    "com.toyopagroup.picaboo": "Snapchat",
    "com.ubercab.UberClient": "Uber",
    "com.ubercab.UberEats": "UberEats",
    "com.unitedinternet.mmc.mobile.gmx.iosmailer": "GMX",
    "com.valvesoftware.Steam": "Steam",
    "com.vilcsak.bitcoin2": "Coinbase",
    "com.wordfeud.free": "WordFeud",
    "com.yourcompany.PPClient": "PayPal",
    "com.zhiliaoapp.musically": "TikTok",
    "de.no26.Number26": "N26",
    "io.robbie.HomeAssistant": "Home Assistant",
    "net.superblock.Pushover": "Pushover",
    "net.weks.prowl": "Prowl",
    "net.whatsapp.WhatsApp": "WhatsApp",
    "nl.ah.Appie": "Albert Heijn",
    "nl.postnl.TrackNTrace": "PostNL",
    "org.whispersystems.signal": "Signal",
    "ph.telegra.Telegraph": "Telegram",
    "tv.twitch": "Twitch",
    // could also use NRF.ancsGetAppInfo(msg.appId) here
  };
  var unicodeRemap = {
    '2019':"'",
    '260':"A",
    '261':"a",
    '262':"C",
    '263':"c",
    '280':"E",
    '281':"e",
    '321':"L",
    '322':"l",
    '323':"N",
    '324':"n",
    '346':"S",
    '347':"s",
    '377':"Z",
    '378':"z",
    '379':"Z",
    '380':"z",
  };
  var replacer = ""; //(n)=>print('Unknown unicode '+n.toString(16));
  //if (appNames[msg.appId]) msg.a
  require("messages").pushMessage({
    t : msg.event,
    id : msg.uid,
    src : appNames[msg.appId] || msg.appId,
    new : msg.new,
    title : msg.title&&E.decodeUTF8(msg.title, unicodeRemap, replacer),
    subject : msg.subtitle&&E.decodeUTF8(msg.subtitle, unicodeRemap, replacer),
    body : msg.message&&E.decodeUTF8(msg.message, unicodeRemap, replacer) || "Cannot display"
  });
  // TODO: posaction/negaction?
});

// Apple media service
E.on('AMS',a=>{
  function push(m) {
    var msg = { t : "modify", id : "music", title:"Music" };
    if (a.id=="artist")  msg.artist = m;
    else if (a.id=="album")  msg.album = m;
    else if (a.id=="title")  msg.track = m;
    else if (a.id=="duration")  msg.dur = m;
    else return;
    require("messages").pushMessage(msg);
  }
  if (a.truncated) NRF.amsGetMusicInfo(a.id).then(push)
  else push(a.value);
});

// Music control
Bangle.musicControl = cmd => {
  // play, pause, playpause, next, prev, volup, voldown, repeat, shuffle, skipforward, skipback, like, dislike, bookmark
  NRF.amsCommand(cmd);
};
// Message response
Bangle.messageResponse = (msg,response) => {
  if (isFinite(msg.id)) return NRF.sendANCSAction(msg.id, response);//true/false
  // error/warn here?
};
// remove all messages on disconnect
NRF.on("disconnect", () => require("messages").clearAll());

/*
// For testing...

NRF.ancsGetNotificationInfo = function(uid) {
  print("ancsGetNotificationInfo",uid);
  return Promise.resolve({
    "uid" : uid,
    "appId" : "Hangouts",
    "title" : "Hello",
    "subtitle" : "There",
    "message" : "Lots and lots of text",
    "messageSize" : 100,
    "date" : "...",
    "posAction" : "ok",
    "negAction" : "cancel",
    "name" : "Fred",
  });
};

E.emit("ANCS", {
    event:"add",
    uid:42,
    category:4,
    categoryCnt:42,
    silent:true,
    important:false,
    preExisting:true,
    positive:false,
    negative:true
});

*/
