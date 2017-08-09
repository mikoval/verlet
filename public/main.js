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
function click(event){
    var x = event.clientX;
    var y = event.clientY;
    var r = Math.random()*20+ 10;
    var circle = new verletPoint(x, y, 0.7, 0.99, r);
    world.add(circle);
  
};
function touch(event){
    var touch = event.touches[0];
    var x = touch.pageX;
    var y = touch.pageY;

    var r = Math.random()*20+ 10;
    var circle = new verletPoint(x, y, 0.7, 0.99, r);
    world.add(circle);
  
};

function motion(event){
    if(event.accelerationIncludingGravity == null)
        return;
    world.setGravity({x:event.accelerationIncludingGravity.x/10, y: -event.accelerationIncludingGravity.y/10});

  
}


$(window).on("devicemotion", motion);
$(window).on("click", click);
$(window).on("touchstart", touch);

//$(window).on("touch", click);

window.addEventListener("devicemotion", motion);


