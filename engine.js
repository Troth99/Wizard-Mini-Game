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
};
let scene = {
    score: 0,
}
function playingFunction(e){
    playBtn.style.display = 'none'
    gameScore.style.display = 'block'
    const mage = document.createElement('div');
    mage.setAttribute('class', 'wizzard')
    mage.style.position = "absolute"
    mage.style.top = '200px'
    mage.style.left = '200px'
  

    gameArea.appendChild(mage);
    

    window.requestAnimationFrame(gameAction)
    
}

let keys = {}
document.addEventListener('keydown', onkeydown)
document.addEventListener('keyup', onkeyup)

function onkeydown(e){
    keys[e.code] = true
}

function onkeyup(e){
    keys[e.code] = false
}

function gameAction(){
    const wizzard = document.querySelector('.wizzard')
    const gameAreaRect = gameArea.getBoundingClientRect();
    const wizzardRect = wizzard.getBoundingClientRect()
    if((keys.ArrowUp || keys.KeyW) && wizzardRect.top > gameAreaRect.top){
        player.y -= game.speed * game.multiPly
    }
    if((keys.ArrowDown || keys.KeyS) && wizzardRect.bottom < gameAreaRect.bottom){
        player.y += game.speed * game.multiPly
    }
    if((keys.ArrowLeft || keys.KeyA) && wizzardRect.left > gameAreaRect.left){
        player.x -= game.speed * game.multiPly 
    }
    if((keys.ArrowRight || keys.KeyD)  && wizzardRect.right < gameAreaRect.right){
        player.x += game.speed * game.multiPly
    }
    scene.score++;
    gamePoints.textContent = scene.score




    wizzard.style.top = player.y + "px";
    wizzard.style.left = player.x + "px"
    window.requestAnimationFrame(gameAction)
}