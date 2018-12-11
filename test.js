// We need 3 things everytime we use Three.js
// Scene + Camera + Renderer
const scene = new THREE.Scene()
// var width = document.getElementById("canvas3d").offsetWidth;
// var height = document.getElementById("canvas3d").offsetHeight;
var width = 960;
var height = 600;
var snake = [];
var snake_ai = [];
var cubeGroup;
var GameStart = false;
var food
var gem
var right;
var left;
var topp;
var bottom;
// var width = document.getElementById('cavas').offsetWidth;
console.log(width)
console.log(height)
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000)
const renderer = new THREE.WebGLRenderer({ antialias: true })



var audio = new Audio('Fantasy_Game_Background_Looping.mp3');
audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
audio.play();
// audio.getAudioByName("./Fantasy_Game_Background_Looping.mp3").play();
// var vid = document.getElementById("audio"); 

// function playVid() { 
//     vid.play(); 
// } 

// function pauseVid() { 
//     vid.pause(); 
// }

renderer.setSize(width, height)

// sets renderer background color
renderer.setClearColor("#222222")
document.body.appendChild(renderer.domElement)

camera.position.x = 0;
camera.position.y = -50;
camera.position.z = 100;
// camera.position.z = 100
camera.lookAt(scene.position);
var plane = CreatePlane(width, height)
plane.position.set(0, 0, 0)
scene.add(plane)
// console.log("***********")
// console.log(plane)
//grid
// var grid3=new THREE.GridHelper(30,30,0xf0f0f0,0xffffff)
// scene.add(grid3)
food = CreateCube(2, 2, 2)
// food.position.set(0,12,0)
scene.add(food)
cubeGroup = new THREE.Object3D();
snake = new Snake(false);
snake_ai = new Snake(true);
cubeGroup_ai = new THREE.Object3D();
//gem = creatSign(snake);


// ambient light
var ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

// point light
var pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(25, 50, 25);
scene.add(pointLight);

document.addEventListener('keydown', onKeyDown, false);

var ani;
function animate() {
    ani = setTimeout("requestAnimationFrame(" + animate + ")", 120)
    render()
    //  cube.rotation.x += 0.04;
    //  cube.rotation.y += 0.04;
    //  wireframeCube.rotation.x -= 0.01;
    //  wireframeCube.rotation.y -= 0.01;
}

function render() {


    console.log(scene)
    //scene.remove(gem)
    // gem.rotation.x += 0.4;
    // gem.rotation.y += 0.4;
    scene.remove(cubeGroup);
    cubeGroup = new THREE.Object3D();
    scene.remove(cubeGroup_ai);
    cubeGroup_ai = new THREE.Object3D();
    console.log(snake)
    console.log(food)

    snake.draw();
    snake_ai.draw();
    // gem = creatSign(snake)

    if (GameStart) {

        console.log("move")
        snake.move()
        snake_ai.move()

    }

    renderer.render(scene, camera)

}
function CreatePlane(width, height) {
    var geometry = new THREE.PlaneGeometry(80, 60, 10, 10);
    var material = new THREE.MeshBasicMaterial({ color: 0xcccccc, overdraw: 0.5, wireframe: false });
    return new THREE.Mesh(geometry, material);
}

// function creatSign(snake) {
//     var gem = snake.snakeArr[0];
//     var x = gem.x;
//     var y = gem.y;
//     var geometry = new THREE.BoxGeometry(1, 1, 1)
//     var material = new THREE.MeshStandardMaterial({ color: "white", flatShading: true, metalness: 0, roughness: 1 })
//     var cube = new THREE.Mesh(geometry, material)
//     cube.position.set(x, y, 1);
//     scene.add(cube)
//     return cube
// }

function Cube(x, y, z, a, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.a = a;
    this.color = color;


    this.draw = function () {
        var geometry = new THREE.BoxGeometry(this.a, this.a, this.a);
        var material = new THREE.MeshLambertMaterial({ color: this.color, overdraw: 0.5 });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = this.x;
        cube.position.y = this.y;
        cube.position.z = this.z;
        // cube.rotation.x += 0.4;
        // cube.rotation.y += 0.4;
        cubeGroup.add(cube);
        scene.add(cubeGroup);
    }
}

function Snake(ai) {
    this.ai = ai;
    if (!this.ai) {
        var snakeArr = [];
        for (var i = 0; i < 4; i++) {

            var cube = new Cube(0, i * 2, 2, 2, 0xffffff, false);

            snakeArr.splice(0, 0, cube);
        }
        var head = snakeArr[0];
        console.log(head);
        head.color = "red";
        // head.rotation.x +=0.04;
        // head.rotation.y +=0.04;
        this.head = snakeArr[0];
        this.snakeArr = snakeArr;
        this.direction = 38;
        this.draw = function () {
            if (this.isover) {
                return;
            }
            for (var i = 0; i < this.snakeArr.length; i++) {
                this.snakeArr[i].draw();
            }
        }
        this.move = function () {
            var cube = new Cube(this.head.x, this.head.y, this.head.z, this.head.a, 0xffffff);
            this.snakeArr.splice(1, 0, cube);
            if (isEat(this.ai)) {
                random();
            } else {
                this.snakeArr.pop();
            }
            switch (this.direction) {
                case 37://左
                    this.head.x -= this.head.a;
                    break;
                case 38://上
                    this.head.y += this.head.a;
                    break;
                case 39: //右
                    this.head.x += this.head.a;
                    break;
                case 40://下
                    this.head.y -= this.head.a;
                    break; 
                default:
                    break;
            }
            if (this.head.x > 40 || this.head.x < -40 || this.head.y > 30 || this.head.y < -30) {
                this.isover = true;
                stop();
            }
            for(var j = 0; j < snake_ai.snakeArr.length;j++){
                if (Math.abs(snake_ai.snakeArr[j].x -this.head.x) <=1 && Math.abs(snake_ai.snakeArr[j].y -this.head.y)<=1) {
                    this.isover = true;
                    stop();
                }
            }
            for (var i = 1; i < this.snakeArr.length; i++) {
                if (this.snakeArr[i].x == this.head.x && this.snakeArr[i].y == this.head.y) {
                    this.isover = true;
                    stop();
                }
                
            }
        }
    }
    else {
        var snakeArr = [];
        var temx = randomIntFromInterval(-30, 30);
        var temy = randomIntFromInterval(-20, 20);
        for (var i = 0; i < 4; i++) {
            var cube = new Cube(temx + 2 * i, temy, 0, 2, 0xffffff, false);

            snakeArr.splice(0, 0, cube);
        }
        var head = snakeArr[0];
        console.log(head);
        head.color = "green";
        // head.rotation.x +=0.04;
        // head.rotation.y +=0.04;
        this.head = snakeArr[0];
        this.snakeArr = snakeArr;
        this.direction = 39;
        this.draw = function () {
            if (this.isover) {
                return;
            }
            for (var i = 0; i < this.snakeArr.length; i++) {
                this.snakeArr[i].draw();
            }
        }
        this.move = function () {
            if (left !=1 && right !=1 && top !=1 && bottom!=1 && this.head.x > -40 && this.head.x < 40 && this.head.y > -30 && this.head.y < 30) {
                var dr = randomIntFromInterval(37, 40)
                // console.log(dr)
                switch (dr) {
                    case 37: {
                        if (this.direction !== 39) {
                            this.direction = 37;
                        }

                        break;
                    }
                    case 38: {
                        if (this.direction !== 40) {
                            this.direction = 38;
                        }

                        break;
                    }
                    case 39: {
                        if (this.direction !== 37) {
                            this.direction = 39;
                        }

                        break;
                    }
                    case 40: {
                        if (this.direction !== 38) {
                            this.direction = 40;
                        }

                        break;
                    }
                    default:
                        break;
                }
            }
            else{
                if (this.head.x >= 39 && right !=1) {
                    right = 1;
                    //  || this.head.x == -39 || this.head.y == 30 || this.head.y == -30) {
                    var random = Math.random();
                    if (random > 0.5) {
                        this.direction = 38;
                        
                    }
                    else
                        this.direction = 40;
                }
                else if(right == 1){
                    this.direction = 37;
                    right = 0;
                }
                else if(this.head.x <=-39 && left != 1){
                    left = 1;
                    //  || this.head.x == -39 || this.head.y == 30 || this.head.y == -30) {
                    var random = Math.random();
                    if (random > 0.5) {
                        this.direction = 38;
                        
                    }
                    else
                        this.direction = 40;
                }
                else if (left == 1){
                    this.direction = 39;
                    left = 0;
                }
                // else if (Math.abs(this.head.x - 29) <= 1 || Math.abs(this.head.x + 29) <= 1) {
                else if (this.head.y >=29 && topp !=1) {
                    topp = 1;
                    var random = Math.random();
                    if (random > 0.5) {
                        this.direction = 37;
                    }
                    else
                        this.direction = 39;
                }
                else if(topp == 1){
                    this.direction = 40;
                    topp = 0;
                }
                else if(this.head.y <=-29 && bottom != 1){
                    bottom = 1;
                    var random = Math.random();
                    if (random > 0.5) {
                        this.direction = 37;
                    }
                    else
                        this.direction = 39;
                }
                else if(bottom == 1){
                    this.direction = 38;
                    bottom = 0;
                }
            }
            var cube = new Cube(this.head.x, this.head.y, this.head.z, this.head.a, 0xffffff);
            this.snakeArr.splice(1, 0, cube);
            if (isEat(this.ai)) {
                random();
            } else {
                this.snakeArr.pop();
            }
            switch (this.direction) {
                case 37://左
                    this.head.x -= this.head.a;
                    break;
                case 38://上
                    this.head.y += this.head.a;
                    break;
                case 39: //右
                    this.head.x += this.head.a;
                    break;
                case 40://下
                    this.head.y -= this.head.a;
                    break;
                default:
                    break;
            }
            
            // for (var i = 1; i < this.snakeArr.length; i++) {
            //     if (this.snakeArr[i].x == this.head.x && this.snakeArr[i].y == this.head.y) {
            //         this.isover = true;
            //         stop();
            //     }
            // }
        }
    }

}


function isEat(ai) {
    if(!ai){
        if ((Math.abs(snake.head.x - food.position.x) <= 1 && Math.abs(snake.head.y - food.position.y) <= 1)) {
            return true;
        } else {
            return false;
        }
    }
    else{
        if((Math.abs(snake_ai.head.x - food.position.x) <= 1 && Math.abs(snake_ai.head.y - food.position.y) <= 1)){
            return true;
        }
        else{
            return false;
        }
    }
   
}

function stop() {
    ani = undefined
    alert("game over!\ryour score is " + snake.snakeArr.length);
    location.reload();

}

function CreateCube(_s1, _s2, _s3) {
    var geometry = new THREE.BoxGeometry(_s1, _s2, _s3);
    for (var i = 0; i < geometry.faces.length; i += 2) {
        var hex = Math.random() * 0xffffff;
        geometry.faces[i].color.setHex(hex);
        geometry.faces[i + 1].color.setHex(hex);
    }
    var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5, wireframe: false });
    return new THREE.Mesh(geometry, material);
}

function randomIntFromInterval(min, max) // min and max included
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function random() {
    var tx, ty;
    tx = randomIntFromInterval(-40, 40);
    ty = randomIntFromInterval(-30, 30);;
    console.log(tx, ty);

    // board[tx][ty] = 2;
    food.position.x = tx;
    food.position.y = ty;
    food.position.z = 0;

}

function onKeyDown(event) {
    console.log("****************")
    // if (status == -1) {
    //     status = 0;
    //     food();
    //     run();
    // }

    if (window.event) // IE
    {
        keynum = event.keyCode;
    }
    else if (event.which) // Netscape/Firefox/Opera
    {
        keynum = event.which;
    }
    console.log(keynum)
    switch (keynum) {
        case 37: {
            if (snake.direction !== 39) {
                snake.direction = 37;
            }

            GameStart = true;
            break;
        }
        case 38: {
            if (snake.direction !== 40) {
                snake.direction = 38;
            }
            GameStart = true;
            break;
        }
        case 39: {
            if (snake.direction !== 37) {
                snake.direction = 39;
            }
            GameStart = true;
            break;
        }
        case 40: {
            if (snake.direction !== 38) {
                snake.direction = 40;
            }
            GameStart = true;
            break;
        }
        default:
            break;
    }
}


random()
animate()
