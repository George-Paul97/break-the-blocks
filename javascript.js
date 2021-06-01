var game_over = false;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//first motion of ball - down and to the right
var dx = 2.5;
var dy = 2.5;

canvas.width = 500;
canvas.height = 500;

var x = 10;
//var x = canvas.width - 15;
var y = 15;
//var y = canvas.height/2 - 5;

var rectx = canvas.width/2;
var recty = canvas.height - 40;

//blocks - width:30px;height:10px;
var blocks_width = 30,blocks_height = 10;
var blocks_rows = 3,blocks_columns = 10, blocks_linespace = 5;
var y_offset = 10, x_offset = (canvas.width/2) - 215;

//*** create array for block field and an index
//*** to loop through all elements
var blocks_pos = [], blocks_index = 0, blocks_pos_x = [], blocks_pos_y = [];

//*** set the first block's position	
blocks_pos_x[0] = [x_offset];
blocks_pos_y[0] = [y_offset];

function setUpBlockField(){
	//*** set up the positions of the blocks
	for(var i = 0; i < blocks_rows; i++){ 
		for(var j = 0; j < blocks_columns; j++){
			//** if its the first block in the row
			//** and it's not the first row
			if(j == 0 && i != 0){
			 blocks_pos_x[blocks_index] = blocks_pos_x[blocks_index - 10];
			 blocks_pos_y[blocks_index] = parseInt(blocks_pos_y[blocks_index - 10]) + 15;		
			}
			//** else if its not first block in row
			else if(j != 0){
			 //* get x and y values of previous block
			 //* and move current block 45px to the right
			 //* based on the x of prev block 
			 blocks_pos_x[blocks_index] = parseInt(blocks_pos_x[blocks_index - 1]) + 45;
			 blocks_pos_y[blocks_index] = blocks_pos_y[blocks_index - 1];
			}  
			blocks_index += 1;
		}  
	}		
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function drawRectangle(){
    ctx.beginPath();
    ctx.rect(rectx,recty,60,10);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}
 
function drawBlocks(){	
  //draw the blocks based on 'blocks_pos' var  
  for(var i = 0; i < blocks_pos_x.length; i++){
	ctx.beginPath();
	ctx.rect(blocks_pos_x[i],blocks_pos_y[i],blocks_width,blocks_height);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();		
  }	
}

function collision(){
	//*** Collision between Ball and Rectangle
    if(x >= rectx && x <= rectx + 60){
      //** if the ball made contact
      if(y == recty){
        //* move the ball upwards
        dy *= -1;
        //console.log("change direction of y coordonate"); 
      }
    }  
    if(x == rectx - 1 || x == rectx + 60 + 1){
       //* if ball touches lateral sides
       //* change horizontal direction (dx) 
       if(y >= recty && y <= recty + 10){
        console.log("CHANGE HORIZONTAL DIRECTION"); 
        dx *= -1;  
       }      
    }
  
    if((x >= rectx + 1 && x <= rectx + 5) ||
       (x >= rectx + 55 && x <= rectx + 60 + 1)){
            //* if ball touches rectangle's edge
            //* and it's the closest edge to the ball
            //* change horizontal direction (dx)      
            if(y == recty && ( (x <= rectx + 5 && dx > 0) ||
              (x >= rectx + 55) && dx < 0 ) ){
              //console.log("The edges got hit!!!"); 
              dx *= -1;  
            }      
    }
  
	//*** Colission with the walls - 'y' coordinate 
	if(y == 5 || y == canvas.height - 2.5){	
     dy *= -1;
	}

	//*** Colission with the walls - 'x' coordinate
	if(x == 5 || x == canvas.width - 2.5){ 
     dx *= -1;
	}

  //*** Collision with the blocks
  var touched_block_y = blocks_pos_y.indexOf(y - 10);
 
  //w - 30,h - 10
	if(touched_block_y != -1 && blocks_pos_x[touched_block_y] <= x && x <= blocks_pos_x[touched_block_y] + blocks_width){
		
		//** if ball touches bottom side of the block
		if(blocks_pos_y[touched_block_y] <= y && y <= blocks_pos_y[touched_block_y] + blocks_height){
			//* if ball vertical direction is upwards
			//* change ball direction
			if(dy < 0 && x < canvas.width - 20){
			 //***** TODO: FIX MAJOR BUG - Invisible up-right corner
			 //***** EDIT: FIXED
			 dy *= -1;
			}
			
			//* if block's lateral sides were hit
			//* change horizontal direction
			if(blocks_pos_x[touched_block_y] == x || x == blocks_pos_x[touched_block_y] + blocks_width){
			 dx *= -1;
			}
		}
		//** it touches upper side of the block 
		else if(blocks_pos_y[touched_block_y] <= y && y >= blocks_pos_y[touched_block_y] - 2){
			//* if ball vertical direction is upwards
			//* change ball direction
			if(dy > 0){
			 dy *= -1;
			}							
		}
		
		
		
	}
  
    
	// TODO : FIX BUG for right side of blocks
	if(x + 5 == blocks_pos_x[touched_block_y] || x == blocks_pos_x[touched_block_y] + blocks_width){
		//* if ball touches lateral sides
		//* change horizontal direction (dx)
		if(blocks_pos_y[touched_block_y] <= y && y <= blocks_pos_y[touched_block_y] + blocks_height){
		 //console.log("CHANGE HORIZONTAL DIRECTION"); 
		 dx *= -1;  
		}      
	}
	
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
    down_right_corner: rect.right
  };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    collision();
    drawRectangle();
	drawBlocks();
    x += dx;
    y += dy;

}

canvas.addEventListener("mousemove",function(event){
  var mousePos = getMousePos(canvas,event);
  //** Fixing right-side out-of-bounds BUG
  rectx = (mousePos.down_right_corner - event.clientX <= 20) ? mousePos.x - 60 : mousePos.x;
  document.getElementById("ball-pos").innerHTML = "Ball Pos: [" + x + ", " + y + "]";
});


setUpBlockField();
setInterval(draw,10);
