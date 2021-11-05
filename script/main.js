window.addEventListener('DOMContentLoaded', function(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  var HTMLScore = document.getElementById('score');

  CANVAS_WIDTH = canvas.width = 1000;
  CANVAS_HEIGHT = canvas.height = 450;

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

  // 플레이어
  class Dino extends Object{

    init(){ // this를 사용하기 위해 선언이 되고 난 후에 초기화를 해준다
      this.dinoImg = {
        'dino': './image/dino0.png',
        'dinoRun': ['./image/dino1.png','./image/dino2.png'],
        'prone':['./image/dino_prone1.png','./image/dino_prone2.png']
      }
      this.aniIndex = 0;
      this.x = 10;
      this.y = CANVAS_HEIGHT - 100;
      this.width = 60;
      this.height = 100;
      this.img = this.dinoImg['dino'];
    }

    dinodino(){
      this.aniIndex = 0;
      this.y = CANVAS_HEIGHT - 100;
      this.width = 60;
      this.height = 100;
      this.img = this.dinoImg['dinoRun'][0];
    }
    dinodinoAni(){
      if(this.aniIndex < this.dinoImg['dinoRun'].length -1) this.aniIndex++;
      else this.aniIndex = 0;

      this.img = this.dinoImg['dinoRun'][this.aniIndex];
    }

    dinoprone(){
      this.aniIndex = 0;
      this.y = CANVAS_HEIGHT - 70;
      this.width = 100;
      this.height = 70;
      this.img = this.dinoImg['prone'];
    }
    dinoproneAni(){
      if(this.aniIndex < this.dinoImg['prone'].length -1) this.aniIndex++;
      else this.aniIndex = 0;
      
      this.img = this.dinoImg['prone'][this.aniIndex];
    }
  }
  var dino = new Dino();
  dino.init();
  dino.draw();

  // 적
  class Cactus extends Object{
    cactus1(){
      this.x = CANVAS_WIDTH - 100;
      this.y = CANVAS_HEIGHT - 50;
      this.width = 50;
      this.height = 50;
      this.img = './image/cactus1.png';
    }
    cactus2(){
      this.x = CANVAS_WIDTH - 100;
      this.y = CANVAS_HEIGHT - 100;
      this.width = 50;
      this.height = 100;
      this.img = './image/cactus2.png';
    }
    cactus3(){
      this.x = CANVAS_WIDTH - 100;
      this.y = CANVAS_HEIGHT - 110;
      this.width = 50;
      this.height = 30;
      this.img = './image/cactus3.png';
    }
  }


  var animation;
  var timer = 0;
  var speed = 0;
  var cactusArray = [];
  var score = 0;

  const gravity = 3;
  var jumping = false;
  var jumpingPower = 0;
  var jumpingDown = false;

  var dinoDown = false;


  // 적 생성
  function cactusInstantiate(){
    var cactus = new Cactus();
    var cactusType = Math.round(1 + Math.random() * 2);
    
    switch(cactusType){
      case 1:
        cactus.cactus1();
        break;
      case 2:
        cactus.cactus2();
        break;
      case 3:
        cactus.cactus3();
        break;
    }

    cactusArray.push(cactus);
  }

  // 충돌 감지 & 게임 엔딩
  function cactusCollition(){
    cactusArray.forEach((cactus, index, o)=>{
      // 이동 
      cactus.x -= 6 + speed;

      // 벽과 적 충돌 감지 : 해당 오브젝트 삭제
      if(cactus.x < 0) o.splice(index, 1); //splice 배열 요소 삭제 : i번부터 1번째까지 요소를 삭제

      // 플레이어와 적 충돌 감지 : 게임 엔딩
      var isCollitionX = (cactus.x - (dino.x + dino.width)) < 0;
      var isCollitionY = (cactus.y - (dino.y + dino.height)) < 0 && ((cactus.y + cactus.height) - dino.y) > 0;  
  
      if(isCollitionX && isCollitionY){
        gameOver();
      }
      
      cactus.draw();
    })
  }

  function gameOver(){
    // ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    cancelAnimationFrame(animation);
  }

  // 플레이어 조작
  function playerMove(){
    // 플레이어 점프
    if(jumping){ // 점프 올라감
      dino.y -= jumpingPower;
      jumpingPower -= gravity;
      if(jumpingDown) jumpingPower -= gravity * 10;

      if(dino.y - jumpingPower >= CANVAS_HEIGHT){
        dino.y = CANVAS_HEIGHT - dino.height;
        jumping = false;
      }
    }
  }

  // 플레이어 애니메이션
  function playerAni(){
    if(dinoDown) dino.dinoproneAni();
    else dino.dinodinoAni();
  }



  var cactusInstantiateTime = 0;
  function update(){
    animation = requestAnimationFrame(update);
    timer++;
    
    if(timer % 2 == 0){  
      // 화면 초기화 
      ctx.clearRect(0,0, canvas.width, canvas.height);
      // 점수 & 속도 증가
      score += 1 ; 
      HTMLScore.innerHTML = score;

      if(score % 10 == 0 && speed < 60)  speed++;
    
      if(timer >= cactusInstantiateTime ){
        cactusInstantiate();
        cactusInstantiateTime = timer  + Math.floor(100 + Math.random() * 50) - speed;
      }

      playerMove();
      playerAni();

      cactusCollition();

      dino.draw();
    }
  }
  update();



  // 플레이어 조작
  document.addEventListener('keydown',  function(e){
    // 스페이스바 : 점프
    if(e.code === 'Space' && !jumping){
      jumping = true;
      jumpingPower = 40;
    }

    // 아래 방향키 : 빠른 낙하 & 수그리기
    if(e.code === 'ArrowDown'){
      
      if(jumping){
        jumpingDown = true;
      }
      else{
        dinoDown = true;
        dino.dinoprone();
      }
    }
  })

  document.addEventListener('keyup',  function(e){
    // 아래 방향키 : 빠른 낙하 취소 & 수그리기 취소
    if(e.code === 'ArrowDown'){
      jumpingDown = false;
      dinoDown = false;
      dino.dinodino();
    }
  })
})