const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var HTMLScore = document.getElementById('score');

CANVAS_WIDTH = canvas.width = 1000;
CANVAS_HEIGHT = canvas.height = 250;

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

    ctx.fillStyle = "red"
    ctx.fillRect(this.x,this.y, this.width,this.height);
    ctx.drawImage(image, this.x, this.y);
  }
}

// 플레이어
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

// 적
class Cactus extends Object{
  cactus1(){
    this.x = CANVAS_WIDTH - 100;
    this.y = 200;
    this.width = 50;
    this.height = 50;
    this.img = './image/cactus1.png';
  }
  cactus2(){
    this.x = CANVAS_WIDTH - 100;
    this.y = 150;
    this.width = 50;
    this.height = 100;
    this.img = './image/cactus2.png';
  }
  cactus3(){
    this.x = CANVAS_WIDTH - 100;
    this.y = 150;
    this.width = 50;
    this.height = 30;
    this.img = './image/cactus3.png';
  }
}


var animation;
var timer = 0;
var speed = 0;
var jumpSpeed = 0;
var cactusArray = [];
var score = 0;
var jumping = false;
const gravity = 1;

function update(){
  animation = requestAnimationFrame(update);
  timer++;
  
  // 화면 초기화 
  ctx.clearRect(0,0, canvas.width, canvas.height);
  

  // 점수 & 속도 증가
  if(timer % 10 === 0){
    score += 1 + Math.floor(timer / 1000); 

    if(score % 10 == 0)  speed++;
  }
  HTMLScore.innerHTML = score;

  // 적 생성
  if(timer % 160 === 0){ 
    var cactus = new Cactus();
    var cactusType = Math.ceil(1 + Math.random() * 2);
    
    if(cactusType == 1) cactus.cactus1();
    else if(cactusType == 2) cactus.cactus2();
    else if(cactusType == 3) cactus.cactus3();

    cactusArray.push(cactus);
  }

  // 적 이동 & 충돌감지
  cactusArray.forEach((a, i, o)=>{
    // 이동 & 왼쪽 벽에 닿을 시 오브젝트 삭제
    a.x -= 4 + speed;
    if(a.x < 0){
      o.splice(i, 1); //splice 배열 요소 삭제 : i번부터 1번째까지 요소를 삭제
    }

    // 모든 적 감지
    isCollition(dino, a);
    
    a.draw();
  })

  // 플레이어 점프
  jumpSpeed = (speed/2);
  if(jumping){ // 점프 올라감
    if(dino.y < 30) dino.y -= 3 + jumpSpeed; 
    else dino.y -= 5 + jumpSpeed;  

    if(dino.y < 0){ // 50 높이 까지 올라가면 점프를 멈춤
      jumping = false
    }
  }
  else if(dino.y < 200){ // 점프 내려감
    if(dino.y < 30) dino.y += 3 + jumpSpeed; 
    else dino.y += 5 + jumpSpeed;  

    if(dino.y > 200){
      dino.y = CANVAS_HEIGHT - 50;
    }
  }

  dino.draw();
}
update();


// 충돌 감지 & 게임 엔딩
function isCollition(dino, cactus){
  // (cactus.x - (dino.x + dino.width)) < 0; dino 너비가 cactus x 보다 같거다 클 때 
  var isCollitionX = (cactus.x - (dino.x + dino.width)) < 0;
  var isCollitionY = (cactus.y - (dino.y + dino.height)) < 0 && ((cactus.y + cactus.height) - dino.y) > 0;  
  // (cactus가 dino보다 아래에 있나) && (cactus가 dino보다 위에 있나) === dino의 위 아래를 탐색하면 dino와 cactus의 height 충돌 범위를 알 수 있다 

  if(isCollitionX && isCollitionY){
    ctx.clearRect(0,0, cactus.width, cactus.height);
    cancelAnimationFrame(animation);
  }
}

// 플레이어 조작
document.addEventListener('keydown',  function(e){
  // 스페이스바 : 점프
  if(e.code === 'Space' && dino.y >= 200){
    jumping = true;
  }
})