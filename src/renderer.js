document.getElementById('opgg').addEventListener('click', () => {
    window.api.send('opgg');
    window.api.receive('invalid-port', (message) => {
        createToast(message);
    });
    window.api.receive('no-players', (message) => {
        createToast(message);
    });
});
  
document.getElementById('porofessor').addEventListener('click', () => {
    window.api.send('porofessor');
    window.api.receive('invalid-port', (message) => {
        createToast(message);
    });
    window.api.receive('no-players', (message) => {
        createToast(message);
    });
});

document.getElementById('justnames').addEventListener('click', () => {
    window.api.send('justnames');
  
    window.api.receive('send-names', (names) => {

        createToast("✔ Names received!");
        
        // Clear names div
        const namesDiv = document.querySelector('.names');
        while (namesDiv.firstChild) {
            namesDiv.removeChild(namesDiv.firstChild);
        }

        // Create button with "copy all nicknames"
        const copyAll = document.createElement('div');
        const copyAllImg = document.createElement('img');
        const copyAllInner = document.createElement('div');
        const copyAllInnerText = document.createElement('span');
        copyAll.classList.add('copyAll');

        copyAllInner.id = 'copyAll';

        copyAllInnerText.innerText = 'Copy all nicknames';

        copyAllImg.src = '../img/copy.png';

        copyAll.appendChild(copyAllInner);
        copyAllInner.appendChild(copyAllImg);
        copyAllInner.appendChild(copyAllInnerText);
        namesDiv.appendChild(copyAll);

        copyAllInner.addEventListener('click', () => {
            const names = document.querySelectorAll('.name');
            let namesToCopy = '';
            names.forEach(name => {
                namesToCopy += name.innerText + ', ';
            });
            namesToCopy = namesToCopy.slice(0, -2);
            navigator.clipboard.writeText(namesToCopy);
            createToast("✔ Names copied!");
        });

        names.forEach(name => {
            const namesDiv = document.querySelector('.names');
            const newName = document.createElement('div');
            newName.classList.add('name');
            newName.addEventListener('click', copyName);
            const newSpan = document.createElement('span');
            newSpan.innerText = name;
            newName.appendChild(newSpan);
            const newDiv = document.createElement('div');
            newDiv.classList.add('copyName');
            const newImg = document.createElement('img');
            newImg.src = '../img/copy.png';
            newImg.alt = 'Copy name with tag';
            newDiv.appendChild(newImg);
            newName.appendChild(newDiv);
            namesDiv.appendChild(newName);
        });
    });

    window.api.receive('invalid-port', (message) => {
        createToast(message);
    });
    window.api.receive('no-players', (message) => {
        createToast(message);
    });
});