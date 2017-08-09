var point;
var width;
var height;
var accuracy;
var startOrientation;

var world;
function setup() {
    width = $(window).width();
    height = $(window).height();

    var myCanvas = createCanvas(width, height);
    myCanvas.parent('container');
   
    world = new verletWorld();

  

    width = document.body.clientWidth;
    height = document.body.clientHeight;
    accuracy = 5;

    
}
function draw(){
	background(50);
	world.update();
    for(var i =0 ; i< accuracy; i++){
        world.collisions();
        world.constrain();
    }
    
	world.draw();
}
$(window).click(function(e) {
    var x = e.clientX;
    var y = e.clientY;
    var r = Math.random()*20+ 10;
    var circle = new verletPoint(x, y, 0.7, 0.99, r);
    world.add(circle);
  
});

function motion(event){

    
    var x = event.beta;  // In degree in the range [-180,180], x, 'front to back'
    var y = event.gamma; // In degree in the range [-90,90], y, 'left to right'
    var z = event.alpha; // 0-360, z, compass orientation

    // coord 1: 0,0
    // coord 2: x,y
    // calculate the angle
    var rad = Math.atan2(y, x);
    var deg = rad * (180 / Math.PI);

    // take into account if phone is held sideways / in landscape mode
    var screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
    // 90, -90, or 0
    var angle = screenOrientation.angle || window.orientation || 0; 

    deg = deg + angle; 

    var v = createVector(0, 1);
    v.rotate(-deg);
    alert(e.)
    alert(e.accelerationIncludingGravity.x + ", " + e.accelerationIncludingGravity.y);
    world.setGravity(v);

  
}



window.addEventListener("devicemotion", motion);


