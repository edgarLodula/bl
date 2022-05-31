class Boat {
    constructor(x, y, width, height, boatPos, boatAnimation) {
    
      this.body = Bodies.rectangle(x, y, width, height);
      this.width = width;
      this.height = height;
      this.boatPosition = boatPos;
      this.animation = boatAnimation;
      this.speed = 0.05;
      this.image = loadImage("./assets/boat.png");
      
      World.add(world, this.body);
    }
    animate(){
      this.speed += 0.05;
    }
  
  remove(i){
    this.animation=boatBroken
    this.speed = 0.05;
    this.width=300
    this.height=300
    setTimeout(() => {
      Matter.World.remove(world,boates[i].body)
      delete boates[i]
      score+=1
    }, 2000);
  }

    display() {
      var angle = this.body.angle;
      var pos = this.body.position;
      var index= floor (this.speed % this.animation.length)
  
      push();
      translate(pos.x, pos.y);
      rotate(angle);
      imageMode(CENTER);
     // console.log(index);
      image(this.animation[index], 0, this.boatPosition, this.width, this.height);
      pop();
    }
  }