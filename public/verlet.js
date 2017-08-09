
function verletWorld(){
	this.objects = [];
	this.update = function(){
		for(var i = 0; i < this.objects.length; i++){
			
			this.objects[i].update();
		}
	}
	this.constrain = function(){
		for(var i = 0; i < this.objects.length; i++){
			
			this.objects[i].constrain();
		}
	}
	this.collisions = function(){
		for(var i=0, l=this.objects.length; i<l; i++){
	        var body1 = this.objects[i];
	        for(var j=i+1; j<l; j++){
	            var body2 = this.objects[j];
	            var x = body1.x - body2.x;
	            var y = body1.y - body2.y;
	            var slength = x*x+y*y;
	            var length = Math.sqrt(slength);
	            var target = body1.radius + body2.radius;

	            // if the spheres are closer
	            // then their radii combined
	            if(length < target){ 
	                var factor = (length-target)/length;
	                // move the spheres away from each other
	                // by half the conflicting length
	                body1.x -= x*factor*0.5;
	                body1.y -= y*factor*0.5;
	                body2.x += x*factor*0.5;
	                body2.y += y*factor*0.5;
	            }
	        }
	    }
	}
	this.add = function(item){
		this.objects.push(item);
	}
	this.draw = function(){
		for(var i = 0; i < this.objects.length; i++){
			this.objects[i].draw();
		}
	}
	this.setGravity = function(dir){
		console.log(dir)
		for(var i = 0; i < this.objects.length; i++){
			this.objects[i].setGravity(dir);
		}
	}

}
function verletObj(points, springs){
	this.type = "obj";
	this.points = points;
	this.springs = springs;

	this.update = function(){
		
		this.updatePosition();
		this.updateSprings();
		this.constraints();
		
		
	}
	this.update = function(){
		for(var i = 0; i < this.points.length; i++){
			this.points[i].update();
		}
	}
	this.update = function(){
		for(var i = 0; i < this.springs.length; i++){
			this.springs[i].update();
		}
	}
	this.constrain = function(){

		for(var i = 0; i < this.points.length; i++){
			this.points[i].constrain();
		}
	}
	this.drawWithLines = function(){
		for(var i = 0; i < this.springs.length; i++){
			this.springs[i].draw();
		}
		for(var i = 0; i < this.points.length; i++){
			this.points[i].draw();
		}
	}
	this.draw = function(){
		stroke("#000000")
		strokeWeight(3);
		fill("#FF5050");
		beginShape();
		for(var i =0; i < this.points.length; i++){
			vertex(this.points[i].x, this.points[i].y);
		}
		endShape(CLOSE);
	}

}

function verletPoint(x, y, bounce = 0.9, friction = 1.0, radius = 0, gravity = {x:0, y:1}){
	this.type = "point";
	this.x=x; 
	this.y=y;
	this.xOld=x;
	this.yOld=y;
	this.radius = radius;
	this.bounce = bounce;
	this.friction = friction;
	this.gravity = gravity;
	this.update = function(){
		var vx = (this.x - this.xOld) * this.friction;
		var vy = (this.y - this.yOld) * this.friction;
		this.xOld = this.x;
		this.yOld = this.y;
		this.x += vx;
		this.y += vy;
		this.y += this.gravity.y;
		this.x += this.gravity.x;
		
	}
	this.setGravity = function(gravity){
		console.log(gravity)
		this.gravity = gravity;
	}
	this.constrain = function(){
		var vx = (this.x - this.xOld) ;
		var vy = (this.y - this.yOld) ;

		if(this.x + this.radius > width){
			this.x = width - this.radius;
			this.xOld = this.x + vx * this.bounce;
		}
		if(this.x - this.radius< 0){
			this.x = 0 + this.radius;
			this.xOld = this.x + vx * this.bounce;
		}
		if(this.y + this.radius> height -5){
			this.y = height - this.radius -5;
			this.yOld = this.y + vy * this.bounce;

		}
		if(this.y - this.radius < 0){
			this.y = 0 + this.radius;
			this.yOld = this.y + vy * this.bounce;
		}
		
	}
	this.draw = function(){
		noStroke();
		ellipse(this.x, this.y, this.radius*2, this.radius*2);
	}
}
function verletStick(p1, p2, distance, rigid){
	this.type = "stick";
	this.p1 = p1;
	this.p2 = p2; 
	this.distance = distance;
	this.rigid = rigid;
	this.update = function(){

		var dx = this.p1.x - this.p2.x;
		var dy = this.p1.y - this.p2.y;
		var distance = Math.sqrt(dx * dx + dy * dy);
		var difference = this.distance - distance;
		var percent = difference / distance / 2;
		var offsetX = dx * percent * this.rigid;
		var offsetY = dy * percent * this.rigid;
		this.p1.x += offsetX;
		this.p1.y += offsetY;
		this.p2.x -= offsetX;
		this.p2.y -= offsetY;

	}
	this.draw = function(){
		stroke("#FFFFFF")
		line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
	}
}
function verletBall(x, y, radius, segments, rigid, strength){
	var points  = [];
	for(var i = 0; i < segments; i++){
		var v = createVector(0, radius);
		v.rotate(2* PI * i /segments);
		var p = new verletPoint(v.x + x, v.y + y, 0.9, 0.99);
		points.push(p);

	}
	
	var springs = []
	for(var i = 0; i < points.length; i++){
		var p1 = points [i];
		for(var j = 1; j < strength; j++){
			var p2= points [(i+j)%points.length];
			springs.push(new verletStick( p1,p2, distance(p1, p2), rigid) )
		}
	}


	return new verletObj(points, springs);
}
function verletSquare(x, y, w, h, rigid){
	var points = []
    var p1 = new verletPoint(x-w/2, y - h/2, 0.9, 0.99);
    var p2 = new verletPoint(x+w/2, y-h/2, 0.9, 0.99);
    var p3 = new verletPoint(x+w/2, y+h/2, 0.9, 0.99);
    var p4 = new verletPoint(x-w/2, y + h/2, 0.9, 0.99);
    points.push(p1);
    points.push(p2);
    points.push(p3);
    points.push(p4);
   
    var springs = [];
    var s1 = new verletStick(p1, p2, w, rigid);
    var s2 = new verletStick(p2, p3, h, rigid);
    var s3 = new verletStick(p3, p4, w, rigid);
    var s4 = new verletStick(p4, p1, h, rigid);
    var s5 = new verletStick(p1, p3, Math.sqrt(w * w + h * h), rigid);
    springs.push(s1);
    springs.push(s2);
    springs.push(s3);
    springs.push(s4);
    springs.push(s5);
   
	return new verletObj(points, springs);
}

function distance(p1, p2){
	var x = (p2.x - p1.x );
	var y = (p2.y - p1.y );
	return Math.sqrt(x*x + y*y);
}

