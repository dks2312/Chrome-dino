var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var dinoImg = new Image();
dinoImg.src = './image/dino.png';

var dino ={
  x : 10,
  y : 200,
  width : 50,
  height : 50,
  draw(){
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x,this.y, this.width,this.height);
    ctx.drawImage(dinoImg, this.x, this.y);
  }
}
dino.draw();



var cactusImg = new Image();
cactusImg.src = './image/cactus.png';

class Cactus{
  constructor(){
    this.x = 500;
    this.y = 200;
    this.width = 50;
    this.height = 50;
  }
  draw(){
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x,this.y, this.width,this.height);
    ctx.drawImage(cactusImg, this.x, this.y);
  }
}


var timer = 0;
var cactusArray = [];
var jumpTime = 0;
var animation

function update(){
  animation = requestAnimationFrame(update);
  timer++;

  ctx.clearRect(0,0, canvas.width, canvas.height);

  if(timer % 120 === 0){
    var cactus = new Cactus();
    cactusArray.push(cactus);
    
  }

  cactusArray.forEach((a, i, o)=>{
    // 왼쪽 벽에 닿을 시 오브젝트 삭제
    if(a.x < 0){
      o.splice(i, 1);
    }
    a.x--;

    isCollition(dino, a);
    
    a.draw();
  })

  
  if(jumping){ // 점프일 때 위로 올라감
    dino.y--;
    jumpTime++;
  }
  else if(dino.y < 200){ // 점프가 멈췄을 때 바닥200까지 내려감
    dino.y++;
  }
  if(jumpTime > 100){ // 100높이 까지 올라가면 점프를 멈춤
    jumping = false
    jumpTime = 0;
  }

  dino.draw();
}
update();


// 충돌 감지 -> 게임 엔딩
function isCollition(dino, cactus){
  var isCollitionX = cactus.x - (dino.x + dino.width);
  var isCollitionY = cactus.y - (dino.y + dino.height);

  if(isCollitionX < 0 && isCollitionY < 0){
    ctx.clearRect(0,0, cactus.width, cactus.height);
    cancelAnimationFrame(animation);
  }
}

var jumping = false;
document.addEventListener('keydown',  function(e){
  if(e.code === 'Space'){
    jumping = true;
  }
})