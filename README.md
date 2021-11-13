# Google-dino
 chrome 미니게임 dino의 모작입니다<br>
 chrome dino 주소 : chrome://dino
 
 <br>canvas를 사용하기 위해 기본적으로 실행돼야 할 코드
```
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
```

<br>canvas로 도형을 만들기<br>
그래픽적인 부분을 해결할 수 있다
```
ctx.fillStyle = 'green'; // 도형 색
ctx.fillRect(this.x,this.y, this.width,this.height); // 도형 그리기
ctx.drawImage(dinoImg, this.x, this.y); // 그림 삽입
```

<br>초당 60회 함수 실행시키는 법<br>
이것으로 플레이어의 위치나 점수 기타 등등을 계속 갱신할 수 있다
```
function update(){
  // 컴퓨터 사양마다 초당 실행 횟수는 다르다
  animation = requestAnimationFrame(update);
}
update();
```

<br>``requestAnimationFrame(update);``만 써도 잘 작동하지만 따로 변수에 저장한 이유는 이 값을 ``window.cancelAnimationFrame()`` 에 전달해 콜백 요청을 취소할 수 있다.(정지)
```
cancelAnimationFrame(animation);
```

<br> 
충돌 감지 : <br>각각의 오브젝트의 위치와 크기를 구하고 일일이 검사한다.  <br><br>
오브젝트간 길이 구하는 법 : <br>알고자하는 두 개의 오브젝트 위치를 빼면(-) 길이를 알 수 있다 이 중 양수나 음수가 나올 수 있는데 이것으로 상대가 앞에 있는지 아니면 뒤에 있는지도 알 수 있다 <br><br>
애니에이션 : <br>위에 서술된 ``requestAnimationFrame()''에 콜백되는 함수안에 계속해서 해당 오보젝트의 이미지를 바꿔주면 된다 <br>
