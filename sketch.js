const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var cannonBall;
var balls=[]
var boates=[]

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
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

}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);

  rect(ground.position.x, ground.position.y, width * 2, 1);
  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();
createboates()
  cannon.display();
  for(var i=0; i<balls.length;i++){
    showBalls(balls[i])
  }
 
}

function showBalls(ball){
  if(ball){
    ball.display()
  }
}

function keyReleased(){
  if(keyCode===DOWN_ARROW){
    balls[balls.length-1].Forc();
  }
}

function keyPressed(){
  if(keyCode===DOWN_ARROW){
    var cannonBall= new CannonBall(cannon.x,cannon.y)
    balls.push(cannonBall)
  }
}

function createboates(){
  if(boates.length >0){
for(var i=0;i<boates.length;i++){
  Matter.Body.setVelocity(boates[i].body,{x:-0.9,y:0})
  boates[i].display()
}
if(boates[boates.length-1].body.position.x <900){
  var boate= new Boat (width,height-60,170,170,-60)
    boates.push(boate)
}
  }
  else{
    var boate= new Boat (width,height-60,170,170,-60)
    boates.push(boate)
  }
}