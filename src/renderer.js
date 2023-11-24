document.getElementById('opgg').addEventListener('click', () => {
    window.api.send('opgg');
});
  
document.getElementById('porofessor').addEventListener('click', () => {
    window.api.send('porofessor');
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
        copyAll.classList.add('copyAll');
        const copyAllInner = document.createElement('span');
        copyAllInner.innerText = 'Copy all nicknames';
        copyAllInner.id = 'copyAll';
        copyAll.appendChild(copyAllInner);
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
});