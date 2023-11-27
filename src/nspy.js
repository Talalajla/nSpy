const { exec } = require('child_process');
const https = require('https');

Client = {};
Riot = {};
players = {};

async function makeRequest(type, url, client, lcuData) {
    try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    
        let port, token;
    
        if (client) {
            port = parseInt(lcuData.Client.port);
            token = lcuData.Client.token;
        } else {
            port = parseInt(lcuData.Riot.port);
            token = lcuData.Riot.token;
        }
    
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
    const baseUrl = `https://porofessor.gg/pregame/${region.toLowerCase()}/`;
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
    if (website) {
        if (website === 'opgg') {
            console.log('Firing OPGG...');
            fireOPGG(names, region);
        } else if (website === 'porofessor') {
            console.log('Firing Porofessor...');
            firePorofessor(names, region);
        }
    }
}

async function startProgram(website) {
    console.log("Starting connection to LCU...");
    let lcuData = await getLCU();
    
    if (isNaN(parseInt(lcuData.Client.port)) || isNaN(parseInt(lcuData.Riot.port))) {
        return { message: 'Something went wrong, check if client is turned on.' }
    }
    console.log('LCU connected!')
    console.log("Digging for some data...");
    let myregion = await makeRequest("GET", "/riotclient/region-locale", true, lcuData);
    // const myregion = { region: 'euw' };
    console.log('Region: ', myregion.region);
    let players = await makeRequest("GET", "/chat/v5/participants/champ-select", false, lcuData);
    // const players = {
    //     participants: [
    //         {
    //             activePlatform: 'riot',
    //             game_name: 'Player 1',
    //             game_tag: 'Tag1',
    //             muted: false,
    //             name: 'OldName1'
    //         },
    //         {
    //             activePlatform: 'riot',
    //             game_name: 'Player 2',
    //             game_tag: 'Tag2',
    //             muted: false,
    //             name: 'OldName2'
    //         },
    //         {
    //             activePlatform: 'riot',
    //             game_name: 'Player 3',
    //             game_tag: 'Tag3',
    //             muted: false,
    //             name: 'OldName3'
    //         },
    //         {
    //             activePlatform: 'riot',
    //             game_name: 'Player 4',
    //             game_tag: 'Tag4',
    //             muted: false,
    //             name: 'OldName4'
    //         },
    //         {
    //             activePlatform: 'riot',
    //             game_name: 'Player 5',
    //             game_tag: 'Tag5',
    //             muted: false,
    //             name: 'OldName5'
    //         },
    //     ]
    // };

    if (players.participants.length === 0) {
        return { message: 'No players found' };
    }
    const names = await getSummonerNames(players);

    if (website === 'justnames') {
        return { message: 'done', names: names };
    }
    showResult(names, myregion.region, website);
    
    return { message: 'done' };
}

module.exports = startProgram;