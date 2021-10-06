var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var HTMLScore = document.getElementById('score');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

class Object{
  constructor(){
    this.x;
    this.y;
    this.width;
    this.height;
    this.img;
  }

  draw(){
    var image = new Image();
    image.src = this.img;

    ctx.fillRect(this.x,this.y, this.width,this.height);
    ctx.drawImage(image, this.x, this.y);
  }
}

class Dino extends Object{
  init(){ // this를 사용하기 위해 선언이 되고 난 후에 초기화를 해준다
    this.x = 10;
    this.y = 200;
    this.width = 50;
    this.height = 50;
    this.img = './image/dino.png';
  }
}
var dino = new Dino();
dino.init();
dino.draw();


class Cactus extends Object{
  cactus1(){
    this.x = 500;
    this.y = 200;
    this.width = 50;
    this.height = 50;
    this.img = './image/cactus1.png';
  }
  cactus2(){
    this.x = 500;
    this.y = 150;
    this.width = 50;
    this.height = 100;
    this.img = './image/cactus2.png';
  }
  cactus3(){
    this.x = 500;
    this.y = 280;
    this.width = 50;
    this.height = 30;
    this.img = './image/cactus3.png';
  }
}


var animation;
var timer = 0;
var cactusArray = [];
var jumpTime = 0;
var score = 0;

function update(){
  animation = requestAnimationFrame(update);
  timer++;
  

  ctx.clearRect(0,0, canvas.width, canvas.height);
  HTMLScore.innerHTML = score;
  if(timer % 10 === 0){
    score += 1 + Math.floor(timer / 1000); // 1000프레임 넘을 때마다 추가 점수 +1 
  }
  if(timer % 100 === 0){  // 120프레임마다 적 생성
    var cactus = new Cactus();
    var cactusType = Math.ceil(1 + Math.random() * 2);
    
    if(cactusType == 1) cactus.cactus1();
    else if(cactusType == 2) cactus.cactus2();
    else if(cactusType == 3) cactus.cactus3();

    cactusArray.push(cactus);
  }

  cactusArray.forEach((a, i, o)=>{
    // 왼쪽 벽에 닿을 시 오브젝트 삭제
    if(a.x < 0){
      o.splice(i, 1);
    }
    a.x -= 4;

    isCollition(dino, a);
    
    a.draw();
  })

  
  if(jumping){ // 점프일 때 위로 올라감
    dino.y -= 6;
    jumpTime++;
  }
  else if(dino.y < 200){ // 점프가 멈췄을 때 바닥200까지 내려감
    dino.y += 4;
  }

  if(jumpTime > 20){ // 100높이 까지 올라가면 점프를 멈춤
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
  if(e.code === 'Space' && dino.y >= 200){
    jumping = true;
  }
})