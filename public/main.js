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

    var rotation = (event.alpha) * 2 * PI / 360;
    alert("alpha + "event.alpha + "rotation "+  rotation);
    var v = createVector(0, 1);
    v.rotate(-rotation);
    world.setGravity(v);

  
}



window.addEventListener('deviceorientation',motion);
window.addEventListener("devicemotion", function(){
    $(window).trigger("deviceorientation");
}, true);


