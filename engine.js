
let gameLoop;

let playerHealth = 100;


const gameScore = document.querySelector(".game-score")
const gameOver = document.querySelector('.game-over');
const gameArea = document.querySelector('.game-area');
const playBtn = document.querySelector('.button');
const gamePoints = document.querySelector('.points')

playBtn.addEventListener('click', playingFunction)
let player = {
    x: 150,
    y: 50,
};

let game = {
    speed: 2,
    multiPly: 1.6,
    fireBallMultiplier: 5,
    cloudSpawnInterval: 3000,
    bugSpawnInterval: 1000,
};
let scene = {
    score: 0,
    lastCloudSpawn: 0,
    lastBugSpawn: 0
}
function playingFunction(e) {
    const spells = document.getElementById('magic-bar')
    playBtn.style.display = 'none'
    gameScore.style.display = 'block'
    const mage = document.createElement('div');
    mage.setAttribute('class', 'wizzard')
    mage.style.position = "absolute"
    mage.style.top = '200px'
    mage.style.left = '200px'
    spells.style.display = 'flex'
    
    mage.innerHTML = `
    <div class="health-bar-outer">
        <div class="health-bar-inner" id="health-bar"</div>
    </div>
    `

    gameArea.appendChild(mage);


    gameLoop = requestAnimationFrame(gameAction);

}

let keys = {}
document.addEventListener('keydown', onkeydown)
document.addEventListener('keyup', onkeyup)

function onkeydown(e) {
    keys[e.code] = true
}

function onkeyup(e) {
    keys[e.code] = false
}
let lastFireballTime = 0;
const fireBallCooldown = 200;

let lastLightingTIme = 0;
const lightingCooldown = 2000

let lastIceballTime = 0;
const iceBallCooldown = 3000


let isFireballOnCooldown = false;
let isLightingOnCooldown = false;
let isIceBallOnCooldown = false;

function gameAction(timestamp) {

    if (!gameLoop) {
        return
    }

    const wizzard = document.querySelector('.wizzard')
    const gameAreaRect = gameArea.getBoundingClientRect();
    const wizzardRect = wizzard.getBoundingClientRect()

    if ((keys.ArrowUp || keys.KeyW) && wizzardRect.top > gameAreaRect.top) {
        player.y -= game.speed * game.multiPly
    }
    if ((keys.ArrowDown || keys.KeyS) && wizzardRect.bottom < gameAreaRect.bottom) {
        player.y += game.speed * game.multiPly
    }
    if ((keys.ArrowLeft || keys.KeyA) && wizzardRect.left > gameAreaRect.left) {
        player.x -= game.speed * game.multiPly
    }
    if ((keys.ArrowRight || keys.KeyD) && wizzardRect.right < gameAreaRect.right) {
        player.x += game.speed * game.multiPly
    }


    if (keys['Digit1'] && Date.now() - lastFireballTime > fireBallCooldown && !isFireballOnCooldown) {
        isFireballOnCooldown = true
        wizzard.classList.add('wizard-shoot')
        addFIreBall(player)
        lastFireballTime = Date.now()
        setTimeout(() => {
            wizzard.classList.remove('wizard-shoot');
        }, 200);

        setTimeout(() => {
            isFireballOnCooldown = false
        }, fireBallCooldown);
    }
    if (keys['Digit2'] && Date.now() - lastLightingTIme > lightingCooldown && !isLightingOnCooldown) {
        isLightingOnCooldown = true
        wizzard.classList.add('wizard-shoot')
        lighting(player)
        lastFireballTime = Date.now()

        setTimeout(() => {
            wizzard.classList.remove('wizard-shoot');
        }, 200);

        setTimeout(() => {
            isLightingOnCooldown = false
        }, lightingCooldown);
    }
    if (keys['Digit3'] && Date.now() - lastIceballTime > iceBallCooldown && !isIceBallOnCooldown) {
        isIceBallOnCooldown = true
        wizzard.classList.add('wizard-shoot')
        iceBall(player)
        lastFireballTime = Date.now()

        setTimeout(() => {
            wizzard.classList.remove('wizard-shoot');
        }, 200);

        setTimeout(() => {
            isIceBallOnCooldown = false
        }, iceBallCooldown);
    }
  

    if (!scene.lastBugSpawn) {
        scene.lastBugSpawn = timestamp; // Инициализиране
    }
    game.bugSpawnInterval = Math.max(300, 1000 - scene.score * 2);

    if (timestamp - scene.lastBugSpawn > game.bugSpawnInterval + Math.random() * 5000) {
        let bug = document.createElement('div');
        bug.classList.add('bug');

        bug.x = gameArea.offsetWidth - 60;
        bug.style.left = bug.x + 'px';
        bug.style.top = Math.random() * (gameArea.offsetHeight - 60) + 'px';

        gameArea.appendChild(bug);
        moveBug(bug);

        scene.lastBugSpawn = timestamp;

    }
    document.querySelectorAll('.bug').forEach((bug) => {
        if (isCollision(wizzard, bug)) {
            bug.remove()
            playerHealth -= 20;
            updateHealthBar()
            if (playerHealth <= 0) {
                endGame();
                return;
            }
        }
    });

    scene.score++;
    gamePoints.textContent = scene.score

    wizzard.style.top = player.y + "px";
    wizzard.style.left = player.x + "px"
    
    gameLoop = requestAnimationFrame(gameAction)

}

const fireballSlot = document.querySelector('.magic-slot:first-child')
const lightingSlot = document.querySelector('.magic-slot:nth-child(2)')
const iceBallSlot = document.querySelector('.magic-slot:nth-child(3)')

function addFIreBall(player) {
    if (fireballSlot.classList.contains('cooldown')) return;

    isFireballOnCooldown = true;
    let fireBall = document.createElement('div');
    fireBall.classList.add('fire-ball');

    const wizzard = document.querySelector('.wizzard');
    const wizzardRect = wizzard.getBoundingClientRect();

    fireBall.style.top = (player.y + wizzardRect.height / 3 - 5) + 'px';
    fireBall.x = player.x + wizzardRect.width;
    fireBall.style.left = fireBall.x + 'px';

    gameArea.appendChild(fireBall);

    fireballSlot.classList.add('cooldown');
    setTimeout(() => {
        fireballSlot.classList.remove('cooldown');
        isFireballOnCooldown = false;
    }, fireBallCooldown);

    function moveFireBall() {
        if (!fireBall.parentElement) return;
        fireBall.x += game.speed * 2;
        fireBall.style.left = fireBall.x + 'px';

        let bugs = document.querySelectorAll('.bug');

        bugs.forEach((bug) => {
            if (isCollision(fireBall, bug)) {
                bug.remove();
                fireBall.remove();
                scene.score += 10;
                gamePoints.textContent = scene.score;
            }
        });

        if (fireBall.x > gameArea.offsetWidth) {
            fireBall.remove();
        } else {
            requestAnimationFrame(moveFireBall);
        }
    }

    moveFireBall();
}


function lighting(player) {
    if (lightingSlot.classList.contains('cooldown')) {
        return;
    }
    isLightingOnCooldown = true
    let lighting = document.createElement('div');
    lighting.classList.add('lighting');

    const wizzard = document.querySelector('.wizzard');
    const wizzardRect = wizzard.getBoundingClientRect();

    lighting.style.top = (player.y + wizzardRect.height * 0.04) + 'px';
    lighting.x = player.x + wizzardRect.width;
    lighting.style.left = lighting.x + 'px';

    gameArea.appendChild(lighting);


    lightingSlot.classList.add('cooldown');
    setTimeout(() => {
        lightingSlot.classList.remove('cooldown');
        isLightingOnCooldown = false
    }, 2000);


    function moveLighting() {
        lighting.x += game.speed * 3;
        lighting.style.left = lighting.x + 'px';

        let bugs = document.querySelectorAll('.bug');
        bugs.forEach((bug) => {
            if (isCollision(lighting, bug)) {
                bug.remove();

                scene.score += 20;
                gamePoints.textContent = scene.score;
            }
        });

        if (lighting.x > gameArea.offsetWidth) {
            lighting.remove();
        } else {
            requestAnimationFrame(moveLighting);
        }
    }

    moveLighting();
}

function iceBall(player) {
    if (iceBallSlot.classList.contains('cooldown')) {
        return;
    }

    isIceBallOnCooldown = true;
    let iceballEl = document.createElement('div');
    iceballEl.classList.add('ice-ball');

    const wizzard = document.querySelector('.wizzard');
    const wizzardRect = wizzard.getBoundingClientRect();

    iceballEl.style.top = (player.y + wizzardRect.height * 0.4) + 'px';
    iceballEl.x = player.x + wizzardRect.width;
    iceballEl.style.left = iceballEl.x + 'px';

    gameArea.appendChild(iceballEl);


    iceBallSlot.classList.add('cooldown');
    setTimeout(() => {
        iceBallSlot.classList.remove('cooldown');
        isIceBallOnCooldown = false;
    }, 3000);

    function moveIceBall() {
        iceballEl.x += game.speed * 1.5;
        iceballEl.style.left = iceballEl.x + 'px';

        let bugs = document.querySelectorAll('.bug');
        bugs.forEach((bug) => {
            if (isCollision(iceballEl, bug)) {
                bug.remove();

                scene.score += 15;
                gamePoints.textContent = scene.score;
            }
        });
        if (iceballEl.x > gameArea.offsetWidth) {
            iceballEl.remove();
        } else {
            requestAnimationFrame(moveIceBall);
        }
    }

    moveIceBall();
}


//adding bugs
function moveBug(bug) {

    function step() {
        if (!bug.parentElement) return;

        let bugSpeed = game.speed * 1.2 + scene.score * 0.001

        bug.x -= bugSpeed
        bug.style.left = bug.x + "px";

        if (bug.x < -60) {
            bug.remove();
        } else {
            requestAnimationFrame(step);
        }
    }

    step();
}

//collisium

function isCollision(el1, el2) {
    let rect1 = el1.getBoundingClientRect();
    let rect2 = el2.getBoundingClientRect();

    return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    )
}

function endGame() {
    cancelAnimationFrame(gameLoop); 
    gameLoop = null; 

    gameOver.style.display = 'block';
    gameOver.innerHTML = `<h2>Game Over!</h2>
    <p>Score: ${scene.score}</p>
    <button id="restart-btn"> Play again</button>`;

    document.querySelector('.wizzard').remove();
    document.getElementById('restart-btn').addEventListener('click', restartGame)
}


function restartGame(){
    console.log('Restarting the game...')

    gameOver.style.display = 'none'
    gameScore.style.display = 'none'

    scene.score = 0
    player.x = 150;
    player.y = 50;
    playerHealth = 100

    document.querySelectorAll('.bug').forEach(bug => bug.remove())
    playingFunction()
}

function updateHealthBar(){
    const bar = document.getElementById('health-bar');
    bar.style.width = playerHealth + '%';

    if (playerHealth <= 40) {
        bar.style.backgroundColor = '#ff9800';
    }
    if (playerHealth <= 20) {
        bar.style.backgroundColor = '#f44336';
    }
}