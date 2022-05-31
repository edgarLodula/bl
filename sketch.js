const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var cannonBall;
var balls=[]
var boates=[]

var boatAnimation = [];
var boatSpriteData, boatSpriteSheet;

var boatBroken = [];
var boatSpriteDataB, boatSpriteSheetB;

var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;

var score = 0;
var isGameOver = false;
var backgroundMusic, waterSound, pirateLaughSound,cannonExplosion;
var isLaughing = false;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

  boatSpriteData =  loadJSON ("assets/boat/boat.json");
  boatSpriteSheet = loadImage ("assets/boat/boat.png")

  boatSpriteDataB = loadJSON ("assets/boat/brokenBoat.json")
  boatSpriteSheetB = loadImage ("assets/boat/brokenBoat.png")

  waterSplashSpritedata = loadJSON("assets/waterSplash/waterSplash.json");
  waterSplashSpritesheet = loadImage("assets/waterSplash/waterSplash.png");


  backgroundMusic = loadSound("./assets/background_music.mp3");
  waterSound = loadSound("./assets/cannon_water.mp3");
  pirateLaughSound = loadSound("./assets/pirate_laugh.mp3");
  cannonExplosion = loadSound("./assets/cannon_explosion.mp3");

}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 20

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);

  var boatFrames = boatSpriteData.frames;
  for (var i=0; i< boatFrames.length; i++){
    var pos = boatFrames[i].position;
    var img = boatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push (img);
  }
  var boatBrokenF = boatSpriteDataB.frames;
  for(var i=0;i<boatBrokenF.length;i++){
    var pos = boatBrokenF[i].position;
    var img = boatSpriteSheetB.get(pos.x, pos.y, pos.w, pos.h);
    boatBroken.push (img);
  //  console.log(boatBroken);
  }

  var waterSplashFrames = waterSplashSpritedata.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  
  if(!backgroundMusic.isPlaying()){
    backgroundMusic.play()
    backgroundMusic.setVolume(0.2)
  }
  rect(ground.position.x, ground.position.y, width * 2, 1);
  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  createboates();
  cannon.display();

  for(var i=0; i<balls.length;i++){
    showBalls(balls[i],i)
    colision(i)
  }
  textSize(30)
  fill("black")
  text("pontuação: "+ score,950,50)
}

function showBalls(ball, index){
  if(ball){
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      if (!ball.isSink){
        ball.remove(index);
        waterSound.play()
      } 
    }
  }
}

function keyReleased(){
  if(keyCode===DOWN_ARROW){
    balls[balls.length-1].Forc();
    cannonExplosion.play()

  }
}

function keyPressed(){
  if(keyCode===DOWN_ARROW){
    var cannonBall= new CannonBall(cannon.x,cannon.y)
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall)
  }
}

function createboates(){
  if(boates.length >0){
    for(var i=0;i<boates.length;i++){
      if (boates[i]) {
        Matter.Body.setVelocity(boates[i].body,{x:-0.9,y:0})
        boates[i].display()
        boates[i].animate();

       // verificar SE um navio está tocando a torre! 
       var collision = Matter.SAT.collides(tower, boates[i].body);  
       // verificar SE ESSE NAVIO está quebrado ! 
       if (collision.collided  && ! boates[i].isBroken){
        isGameOver = true;
          gameOver();
          if(!pirateLaughSound.isPlaying()){
            pirateLaughSound.play()
          }
       }

      }else{
        boates[i]
      }
    }
    if(boates[boates.length - 1] === undefined || 
      boates[boates.length-1].body.position.x <900){
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      
      var boate= new Boat (width,height-60,170,170,position,boatAnimation)
        boates.push(boate)
    }
  }
  else{
    var boate= new Boat (width,height-60,170,170,-60, boatAnimation)
    boates.push(boate)
  }
}

function colision(index){
for(var i=0; i<boates.length;i++){
  if(balls[index]!==undefined && boates[i]!==undefined){
    var impact=Matter.SAT.collides(balls[index].body, boates[i].body)
    if(impact.collided){
      boates[i].remove(i)
       
      Matter.World.remove(world,balls[index].body)
      delete balls[index]
     // Matter.World.remove(world,boates[i].body)
      //delete boates[i]
     
    }
  }
}
}

function gameOver (){
  swal(
    {
      title: `Fim de Jogo!!!`,
      text: "Obrigada por jogar!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Jogar Novamente"
    
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}