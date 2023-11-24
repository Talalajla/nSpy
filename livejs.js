const players = {
        participants: [
            {
                activePlatform: 'riot',
                cid: '35255c01-a46d-41e7-adfc-b9612cfdc487@champ-select.eu1.pvp.net',
                game_name: 'WhiskeyCola',
                game_tag: 'Mambo',
                muted: false,
                name: 'BwÖler',
                pid: 'b0fe6d77-2600-54bc-a875-cbda82b2a50a@eu1.pvp.net',
                puuid: 'b0fe6d77-2600-54bc-a875-cbda82b2a50a',
                region: 'eu1'
            },
            {
                activePlatform: 'riot',
                cid: '35255c01-a46d-41e7-adfc-b9612cfdc487@champ-select.eu1.pvp.net',
                game_name: 'Kousei Arima',
                game_tag: '4444',
                muted: false,
                name: 'ninjaforce1337',
                pid: '5b53ff21-ab02-523c-a968-e4b7f11a06a6@eu1.pvp.net',
                puuid: '5b53ff21-ab02-523c-a968-e4b7f11a06a6',
                region: 'eu1'
            },
            {
                activePlatform: 'riot',
                cid: '35255c01-a46d-41e7-adfc-b9612cfdc487@champ-select.eu1.pvp.net',
                game_name: 'Τomie',
                game_tag: 'EUW',
                muted: false,
                name: 'Τomie',
                pid: '4f4801c4-7418-5598-83a1-72f5f9d9869f@eu1.pvp.net',
                puuid: '4f4801c4-7418-5598-83a1-72f5f9d9869f',
                region: 'eu1'
            },
            {
                activePlatform: 'riot',
                cid: '35255c01-a46d-41e7-adfc-b9612cfdc487@champ-select.eu1.pvp.net',
                game_name: 'NightWithTaliyah',
                game_tag: 'EUW',
                muted: false,
                name: 'NightWithTaliyah',
                pid: '729dc90c-122a-59fe-b1ab-fb8bc8c73dd1@eu1.pvp.net',
                puuid: '729dc90c-122a-59fe-b1ab-fb8bc8c73dd1',
                region: 'eu1'
            },
            {
                activePlatform: 'riot',
                cid: '35255c01-a46d-41e7-adfc-b9612cfdc487@champ-select.eu1.pvp.net',
                game_name: 'Sinfasy',
                game_tag: '6969',
                muted: false,
                name: 'Sinfasy',
                pid: '3f2b98d2-fcd7-5036-b101-83382a071324@eu1.pvp.net',
                puuid: '3f2b98d2-fcd7-5036-b101-83382a071324',
                region: 'eu1'
            }
        ]
};

let names = [];

for (let i = 0; i < players.participants.length; i++) {
    names.push(players.participants[i].game_name + "#" + players.participants[i].game_tag);
}

console.log(names);

const baseUrl = 'https://www.op.gg/multisearch/euw?summoners=';
let endUrl = '';

names.forEach(name => {
    name = name.replace(/\s/g, '+'); // Replace spaces with '+'
    name = encodeURIComponent(name); // Encode special characters
    endUrl += name + ','; // Separate names with ','
});

const fullUrl = baseUrl + endUrl;
console.log(fullUrl);

// returns https://www.op.gg/multisearch/eune?summoners=WhiskeyCola%23Mambo%2CKousei+Arima%234444%2CΤomie%23EUW%2CNightWithTaliyah%23EUW%2CSinfasy%236969