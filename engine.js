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
    fireBallMultiplier: 5
};
let scene = {
    score: 0,
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


    gameArea.appendChild(mage);


    window.requestAnimationFrame(gameAction)

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
const lightingCooldown = 5000

let isFireballOnCooldown = false;
let isLightingOnCooldown = false
function gameAction() {
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
    scene.score++;
    gamePoints.textContent = scene.score

    wizzard.style.top = player.y + "px";
    wizzard.style.left = player.x + "px"
    window.requestAnimationFrame(gameAction)
}

const fireballSlot = document.querySelector('.magic-slot:first-child')
const lightingSlot = document.querySelector('.magic-slot:nth-child(2)')

function addFIreBall(player) {
    if (fireballSlot.classList.contains('cooldown')) {
        return;
    }

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
    }, 200);

    function moveFireBall() {
        fireBall.x += game.speed * 2;
        fireBall.style.left = fireBall.x + 'px';

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

    lighting.style.top = (player.y + wizzardRect.height * 0.04 )+ 'px';
    lighting.x = player.x + wizzardRect.width;
    lighting.style.left = lighting.x + 'px';

    gameArea.appendChild(lighting);


    lightingSlot.classList.add('cooldown');
    setTimeout(() => {
        lightingSlot.classList.remove('cooldown');
        isLightingOnCooldown = false
    }, 5000);


    function moveLighting() {
        lighting.x += game.speed * 3;
        lighting.style.left = lighting.x + 'px';

        if (lighting.x > gameArea.offsetWidth) {
            lighting.remove();
        } else {
            requestAnimationFrame(moveLighting);
        }
    }

    moveLighting();
}

let iceball = 0
//to do icewall spell and fix the ccs on the div
//add monsters health bars and damage