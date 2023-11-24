const { exec } = require('child_process');
const https = require('https');

Client = {};
Riot = {};
players = {};


async function makeRequest(type, url, client, lcuData) {
    try {
        const https = require('https');
    
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    
        let port, token;
    
        if (client) {
            port = parseInt(lcuData.Client.port);
            token = lcuData.Client.token;
        } else {
            port = parseInt(lcuData.Riot.port);
            token = lcuData.Riot.token;
        }
    
        console.log("port: ", port);
        console.log("token:", token);
    
        const options = {
            hostname: '127.0.0.1',
            port: port,
            path: url,
            method: type,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + token,
            },
        };
    
        const response = await new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(JSON.parse(data));
                });
            });
    
            req.on('error', error => {
                console.error(error);
                reject("");
            });
    
            req.end();
        });
    
        console.log('response: ', response);
        return response;
    } catch (error) {
        console.error('Request error:', error);
        return '';
    }
}

async function getLCU() {
    let Riot = {};
    let Client = {};

    let commandline = await cmd('WMIC PROCESS WHERE Name="LeagueClientUx.exe" GET CommandLine');

    Riot["port"] = findString(commandline, "--riotclient-app-port=", "\" \"--no-rads");
    Riot["token"] = Buffer.from("riot:" + findString(commandline, "--riotclient-auth-token=", "\" \"--riotclient")).toString('base64');

    Client["port"] = findString(commandline, "--app-port=", "\" \"--install");
    Client["token"] = Buffer.from("riot:" + findString(commandline, "--remoting-auth-token=", "\" \"--respawn-command=LeagueClient.exe")).toString('base64');

    console.log(Riot);
    console.log(Client);

    return { Riot, Client };
}

function cmd(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

function findString(text, from, to) {
    var pFrom = text.indexOf(from) + from.length;
    var pTo = text.lastIndexOf(to);

    return text.substring(pFrom, pTo);
}

async function getSummonerNames(players) {
    let names = [];

    for (let i = 0; i < players.participants.length; i++) {
        names.push(players.participants[i].game_name + "#" + players.participants[i].game_tag);
    }
    return names;
}

function fireOPGG(names, region) {
    const baseUrl = `https://www.op.gg/multisearch/${region}?summoners=`;
    let endUrl = '';

    names.forEach(name => {
        name = name.replace(/\s/g, '+'); // Replace spaces with '+'
        name = encodeURIComponent(name); // Encode special characters
        endUrl += name + ','; // Separate names with ','
    });

    const fullUrl = baseUrl + endUrl;

    exec(`start ${fullUrl}`);
}

function firePorofessor(names, region) {
    const baseUrl = `https://porofessor.gg/pregame/${region}/`;
    let endUrl = '';

    names.forEach(name => {
        name = name.replace(/\s/g, '+'); // Replace spaces with '+'
        name = name.replace(/#/g, '-'); // Replace '#' with '-'
        name = encodeURIComponent(name); // Encode special characters
        endUrl += name + ','; // Separate names with ',' 
    });

    endUrl = endUrl.slice(0, -1); // Remove last ','

    const fullUrl = baseUrl + endUrl;
    
    exec(`start ${fullUrl}`);
}

function showResult(names, region, website) {
    if (!website) {
        console.log('\nReturning list of nicknames...');
        const stringNames = ` ${names.join(', ')}`;
        console.log(stringNames);
    } else {
        if (website === 'opgg') {
            console.log('Firing OPGG...');
            fireOPGG(names, region);
        } else if (website === 'porofessor') {
            console.log('Firing Professor...');
            firePorofessor(names, region);
        }
    }
}

async function startProgram(website) {
    console.log("Starting connection to LCU...");
    let lcuData = await getLCU();
    console.log("Digging for some data...");
    let myregion = await makeRequest("GET", "/riotclient/region-locale", true, lcuData);
    // const myregion = 'euw';
    // console.log(myregion);
    let players = await makeRequest("GET", "/chat/v5/participants/champ-select", false, lcuData);
    // const players = {
    //     participants: [
    //         {
    //             activePlatform: 'riot',
    //             cid: '35255c01-a46d-41e7-adfc-b9612cfdc487@champ-select.eu1.pvp.net',
    //             game_name: 'WhiskeyCola',
    //             game_tag: 'Mambo',
    //             muted: false,
    //             name: 'BwÖler',
    //             pid: 'b0fe6d77-2600-54bc-a875-cbda82b2a50a@eu1.pvp.net',
    //             puuid: 'b0fe6d77-2600-54bc-a875-cbda82b2a50a',
    //             region: 'eu1'
    //         },
    //         {
    //             activePlatform: 'riot',
    //             cid: '35255c01-a46d-41e7-adfc-b9612cfdc487@champ-select.eu1.pvp.net',
    //             game_name: 'Kousei Arima',
    //             game_tag: '4444',
    //             muted: false,
    //             name: 'ninjaforce1337',
    //             pid: '5b53ff21-ab02-523c-a968-e4b7f11a06a6@eu1.pvp.net',
    //             puuid: '5b53ff21-ab02-523c-a968-e4b7f11a06a6',
    //             region: 'eu1'
    //         },
    //         {
    //             activePlatform: 'riot',
    //             cid: '35255c01-a46d-41e7-adfc-b9612cfdc487@champ-select.eu1.pvp.net',
    //             game_name: 'Τomie',
    //             game_tag: 'EUW',
    //             muted: false,
    //             name: 'Τomie',
    //             pid: '4f4801c4-7418-5598-83a1-72f5f9d9869f@eu1.pvp.net',
    //             puuid: '4f4801c4-7418-5598-83a1-72f5f9d9869f',
    //             region: 'eu1'
    //         },
    //         {
    //             activePlatform: 'riot',
    //             cid: '35255c01-a46d-41e7-adfc-b9612cfdc487@champ-select.eu1.pvp.net',
    //             game_name: 'NightWithTaliyah',
    //             game_tag: 'EUW',
    //             muted: false,
    //             name: 'NightWithTaliyah',
    //             pid: '729dc90c-122a-59fe-b1ab-fb8bc8c73dd1@eu1.pvp.net',
    //             puuid: '729dc90c-122a-59fe-b1ab-fb8bc8c73dd1',
    //             region: 'eu1'
    //         },
    //         {
    //             activePlatform: 'riot',
    //             cid: '35255c01-a46d-41e7-adfc-b9612cfdc487@champ-select.eu1.pvp.net',
    //             game_name: 'Sinfasy',
    //             game_tag: '6969',
    //             muted: false,
    //             name: 'Sinfasy',
    //             pid: '3f2b98d2-fcd7-5036-b101-83382a071324@eu1.pvp.net',
    //             puuid: '3f2b98d2-fcd7-5036-b101-83382a071324',
    //             region: 'eu1'
    //         }
    //     ]
    // };
    // console.log('players: ', players); // returns correct;

    const names = await getSummonerNames(players);

    if (website === 'justnames') {
        return names;
    }
    showResult(names, myregion, website)
    // console.log(names, myregion, website);
}

module.exports = startProgram;