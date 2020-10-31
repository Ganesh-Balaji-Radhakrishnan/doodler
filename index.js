document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let gameOver = false
    let platformNumber = 5
    let platforms = []
    let upTimeId
    let downTimeId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId 
    let rightTimerId
    let score = 0;
 
    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    class Platform{
        constructor(newPlatGap){
            this.bottom = newPlatGap
            this.left = Math.random() * 315 // 400 - 85
            this.visual = document.createElement('div')
            const visual = this.visual

            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'

            grid.appendChild(visual)
        }
    }

    function createPlatform(){
        for( let i = 0; i < platformNumber; i++){
            const platGap = 600 / platformNumber
            const newPlatGap = 100 + i * platGap
            let newPlatform = new Platform(newPlatGap)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function movePlatform(){
        if(doodlerBottomSpace > 200){
            platforms.forEach( platform=>{
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 10){
                    let firstPlatform  = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    let newPlatform  = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump(){
        clearInterval(downTimeId)
        isJumping = true
        upTimeId = setInterval(function(){
            doodlerBottomSpace +=20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if(doodlerBottomSpace > startPoint + 200){
                fall()
            }
        },30)
    }

    function fall(){
        clearInterval(upTimeId)
        isJumping = false
        downTimeId = setInterval(function(){
            doodlerBottomSpace -=5
            doodler.style.bottom = doodlerBottomSpace + 'px'

            if(doodlerBottomSpace===0){
                endGame()
            }

            platforms.forEach( platform => {
                if(
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= (platform.bottom + 15)) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ){
                    console.log('Landed')
                    jump()
                    startPoint = doodlerBottomSpace
                }
            })

        },30)
    }


    function control(e){
        if(e.key==='ArrowLeft'){
            moveLeft()
        } else if(e.key === 'ArrowRight'){
            moveRight()
        } else if(e.key === 'ArrowUp'){
            moveStraight()
        }
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }

        isGoingLeft = true

        leftTimerId = setInterval(function(){
            if(doodlerLeftSpace >= 0){
                doodlerLeftSpace -=5 
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
        }, 20)
         
    }

    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }

        isGoingRight = true

        rightTimerId = setInterval( ()=>{
            if(doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        } ,20)
    }

    function moveStraight(){
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function endGame(){
        gameOver = true
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = 'score: ' + score

        clearInterval(upTimeId)
        clearInterval(downTimeId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)

        
    }

    function start(){
        if(!gameOver){
            createPlatform()
            createDoodler()
            setInterval(movePlatform, 50)
            jump()
            document.addEventListener('keyup', control)
        }
    }

    //a buttom for start
    start() 
})