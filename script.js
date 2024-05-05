//---------------------------------Object Class-----------------------------------//

class Snake {

    constructor({pixels}) {
        this.pixels= pixels;
    }

    getDirection() {
        const i= this.pixels.length- 1;
        const upDown= this.pixels[i][1]- this.pixels[i-1][1];
        const rightLeft= this.pixels[i][0]- this.pixels[i-1][0];
        
        return [rightLeft, upDown];
    }

    move(direction, eating) {
        const i= this.pixels.length- 1;
        
        const newPixel= [
            this.pixels[i][0]+ direction[0], 
            this.pixels[i][1]+ direction[1]
        ];

        this.pixels.push(newPixel);

        if(!eating) {
            this.pixels.shift();
            return false;
        }

        return true;
    }

    moveForward() {
        this.move(this.getDirection());
    }

}
//--------------------------------------------------------------------------------//

//-----------------------------------Actions--------------------------------------//

var inner= "";
var snake= new Snake({
    pixels: [
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0]
    ]
});
var currentDirection= [1, 0];
var currentFood= [0, 19];

var intervalId = setInterval(() => {}, 300);

var defaultSize= Math.min(window.innerWidth*0.8/20, 25);

initState();

function initState() {
    
    for(let i=0; i< 20; i++) {
        inner+= `<div style= "height: 500px; width: ${defaultSize}px; display: flex; flex-direction: column;"> \n`;
        for(let j=0; j< 20; j++) {
            inner+= `<div id= "innerbox-${i}-${j}" style= "height: ${defaultSize}px; width: ${defaultSize}px; background-color: black; border-style: "></div> \n`;
        }
        inner+= "</div>";
    }

    console.log(inner);

    document.getElementById("box").innerHTML= inner;

    mapSnakeToGrid(snake);

    intervalId = setInterval(() => {
        mapFoodToGrid(currentFood);

        withdrawSnakeFromGrid(snake);

        const snakeHead= snake.pixels[snake.pixels.length- 1];
        const eating = [snakeHead[0], snakeHead[1]].toString()== currentFood.toString();

        console.log(`head= ${[snakeHead[0], snakeHead[1]]}, food= ${currentFood}, eating= ${eating}`);

        var theFoodIsEaten= snake.move(currentDirection, eating);

        if(theFoodIsEaten) {
            currentFood= generateFood();
        }

         try{
            bodyHitCheck(snake.pixels);
            mapSnakeToGrid(snake);
         } catch(e) {
            gameOver();
         }

    }, 300);

    document.addEventListener("keydown", handleKeyPress);
    
}

function mapSnakeToGrid(snake) {
    
    for(let i=0; i< snake.pixels.length; i++) {
        const pixel= snake.pixels[i];
        document.getElementById(
            `innerbox-${pixel[0]}-${pixel[1]}`
        ).style.backgroundColor= "red";
    }
}

function withdrawSnakeFromGrid(snake) {
    const pixel= snake.pixels[0];
    document.getElementById(
        `innerbox-${pixel[0]}-${pixel[1]}`
    ).style.backgroundColor= "black";

}

function bodyHitCheck(pixels) {
    const seen = {};
    for (const item of pixels) {
        if (seen[item]) {
            gameOver();
        }
        seen[item] = true;
    }
}

function generateFood() {
    const x = Math.floor(Math.random() * 21) - 1;
    const y = Math.floor(Math.random() * 21) - 1;
    return [x, y];
}

function mapFoodToGrid(currentFood) {
    
    document.getElementById(
        `innerbox-${currentFood[0]}-${currentFood[1]}`
    ).style.backgroundColor= "green";
}

function gameOver() {
    clearInterval(intervalId);
    document.getElementById("barrier").style.display= "flex";
}

function handleKeyPress(event) {
    const ARROW_UP = 38;
    const ARROW_DOWN = 40;
    const ARROW_LEFT = 37;
    const ARROW_RIGHT = 39;

    switch(event.keyCode) {
        case ARROW_UP:
            currentDirection= [0, -1];
            break;
        case ARROW_DOWN:
            currentDirection= [0, 1];
            break;
        case ARROW_LEFT:
            currentDirection= [-1, 0];
            break;
        case ARROW_RIGHT:
            currentDirection= [1, 0];
            break;
    }
}


//--------------------------------------------------------------------------------//