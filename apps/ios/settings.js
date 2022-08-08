(function(back) {
    const FILE = 'ios.json';
    let settings = require('Storage').readJSON(FILE,1)||{};

    function writeSettings(){
        require('Storage').writeJSON(FILE, settings)
    }

    let bimenu = {
        "":{
            "title": "Built-In"
        },
        '< Back': back,
        "FaceTime": {
            value: (settings.facetime !== undefined ? settings.facetime : true),
            onchange: v => {
                settings.facetime = v;
                writeSettings();
            }
        },
        "Messages": {
            value: (settings.messages !== undefined ? settings.messages : true),
            onchange: v => {
                settings.messages = v;
                writeSettings();
            }
        },
        "Phone": {
            value: (settings.phone !== undefined ? settings.phone : true),
            onchange: v => {
                settings.phone = v;
                writeSettings();
            }
        },
    };

    let socmenu = {
        "":{
            "title": "Socials"
        },
        '< Back': back,
        "Discord": {
            value: (settings.discord !== undefined ? settings.discord : true),
            onchange: v => {
                settings.discord = v;
                writeSettings();
            }
        },
        "Instagram": {
            value: (settings.instagram !== undefined ? settings.instagram : false),
            onchange: v => {
                settings.instagram = v;
                writeSettings();
            }
        },
        "FB Messenger": {
            value: (settings.messenger !== undefined ? settings.messenger : true),
            onchange: v => {
                settings.messenger = v;
                writeSettings();
            }
        },
        "Signal": {
            value: (settings.signal !== undefined ? settings.signal : true),
            onchange: v => {
                settings.signal = v;
                writeSettings();
            }
        },
        "Snapchat": {
            value: (settings.snapchat !== undefined ? settings.snapchat : true),
            onchange: v => {
                settings.snapchat = v;
                writeSettings();
            }
        },
        "Telegram": {
            value: (settings.telegram !== undefined ? settings.telegram : false),
            onchange: v => {
                settings.telegram = v;
                writeSettings();
            }
        },
        "WhatsApp": {
            value: (settings.whatsapp !== undefined ? settings.whatsapp : false),
            onchange: v => {
                settings.whatsapp = v;
                writeSettings();
            }
        },
    };

    let prodmenu = {
        "":{
            "title": "Productivity"
        },
        '< Back': back,
        "GCal": {
            value: (settings.gcal !== undefined ? settings.gcal : true),
            onchange: v => {
                settings.gcal = v;
                writeSettings();
            }
        },
        "Outlook": {
            value: (settings.outlook !== undefined ? settings.outlook : true),
            onchange: v => {
                settings.outlook = v;
                writeSettings();
            }
        },
        "Shop": {
            value: (settings.shop !== undefined ? settings.shop : true),
            onchange: v => {
                settings.shop = v;
                writeSettings();
            }
        },
        "Teams": {
            value: (settings.teams !== undefined ? settings.teams : true),
            onchange: v => {
                settings.teams = v;
                writeSettings();
            }
        },
    };

    let appMenu = {
        "":{
            'title': 'iOS Connect'
        },
        '< Back': back,
        'Builtin...': () => E.showMenu(bimenu),
        'Socials...': () => E.showMenu(socmenu),
        'Productivity...': () => E.showMenu(prodmenu),
        'Other Apps': {
            value: (settings.other !== undefined ? settings.other : false),
            onchange: v => {
                settings.other = v;
                writeSettings();
            }
        }
    };
    

    E.showMenu(appMenu)

  });