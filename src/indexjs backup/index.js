// Import Application class that is the main part of our PIXI project
import { Application } from '@pixi/app'

// In order that PIXI could render things we need to register appropriate plugins
import { Renderer } from '@pixi/core' // Renderer is the class that is going to register plugins

import { BatchRenderer } from '@pixi/core' // BatchRenderer is the "plugin" for drawing sprites
Renderer.registerPlugin('batch', BatchRenderer)

import { TickerPlugin } from '@pixi/ticker' // TickerPlugin is the plugin for running an update loop (it's for the application class)
Application.registerPlugin(TickerPlugin)

// And just for convenience let's register Loader plugin in order to use it right from Application instance like app.loader.add(..) etc.
import { AppLoaderPlugin } from '@pixi/loaders'
Application.registerPlugin(AppLoaderPlugin)

// Sprite is our image on the stage
import { Sprite } from '@pixi/sprite'

//import Graphics
import {Graphics} from '@pixi/graphics'

// import text and textstyle
import * as text from '@pixi/text'

// import display
import {Container} from '@pixi/display'



// App with width and height of the page
const app = new Application({
	// width: window.innerWidth,
	// height: window.innerHeight,
	// backgroundColor: 0xFFF68F
	width: 256, 
    height: 256,                       
    antialiasing: true, 
    transparent: false, 
    resolution: 1
})

document.body.appendChild(app.view) // Create Canvas tag in the body

var sprite, box, cat, state, message, style, healthBar;

//Line
// let line = new Graphics();   
// line.lineStyle(4, 0xFFFFFF, 1);
// line.moveTo(0, 0);
// line.lineTo(80, 50);
// line.x = 32;
// line.y = 32;
// app.stage.addChild(line);

// Load the logo 
//app.loader.add('logo', './assets/logo.png').add('cat', "./assets/cat.png")

//Load the Cat Picture
app.loader.add('cat', "./assets/cat.png");
app.loader.load(setup);

function setup() {
	// sprite = Sprite.from('logo')
	// sprite.anchor.set(0.5) // We want to rotate our sprite relative to the center, so 0.5
	// app.stage.addChild(sprite)

	// Position the sprite at the center of the stage
	// sprite.x = app.screen.width * 0.5
    // sprite.y = app.screen.height * 0.5
    
    healthBar = new Container();
    container1.position.set(20, 4)
    app.stage.addChild(healthBar);

	// Create sprite box
	box = new Graphics();
	box.beginFill(0xCCFF99);
	box.drawRect(0, 0, 64, 64);
	box.endFill();
	//box.x = 120;
	//box.y = 96;
	container1.addChild(box);

	// Create sprite cat
	cat = new Sprite.from('cat')
	cat.y = 16;
	cat.x = 96;
	cat.vx = 0;
	cat.vy = 0;
	app.stage.addChild(cat);

	 //Capture the keyboard arrow keys
	 let left = keyboard(37),
	 up = keyboard(38),
	 right = keyboard(39),
	 down = keyboard(40);

 	//Left arrow key `press` method
 	left.press = () => {
   //Change the cat's velocity when the key is pressed
   		cat.vx = -5;
  		cat.vy = 0;
 	};
 
 //Left arrow key `release` method
 left.release = () => {
   //If the left arrow has been released, and the right arrow isn't down,
   //and the cat isn't moving vertically:
   //Stop the cat
   if (!right.isDown && cat.vy === 0) {
	 cat.vx = 0;
   }
 };

 //Up
 up.press = () => {
   cat.vy = -5;
   cat.vx = 0;
 };
 up.release = () => {
   if (!down.isDown && cat.vx === 0) {
	 cat.vy = 0;
   }
 };

 //Right
 right.press = () => {
   cat.vx = 5;
   cat.vy = 0;
 };
 right.release = () => {
   if (!left.isDown && cat.vy === 0) {
	 cat.vx = 0;
   }
 };

 //Down
 down.press = () => {
   cat.vy = 5;
   cat.vx = 0;
 };
 down.release = () => {
   if (!up.isDown && cat.vx === 0) {
	 cat.vy = 0;
   }
 };

 // create textstyle and text object
 style = new text.TextStyle({
	fontFamily: "sans-serif",
    fontSize: 18,
    fill: "white",
  })
  message = new text.Text("No collision...", style);
  message.position.set(8.8);
  app.stage.addChild(message);

 
 //Set the game state
 state = play;

 //Start the game loop 
 app.ticker.add(delta => gameLoop(delta));

	// Put the rotating function into the update loop
	// app.ticker.add(delta => {
	// 	sprite.rotation += 0.02 * delta
	// 	//cat.vx = 1;
	// 	//cat.vy = 1;
	// 	cat.x += cat.vx;
	// 	cat.y += cat.vy;
	// })
};

function gameLoop(delta){

	//Update the current game state:
	state(delta);
  }
  
  function play(delta) {
  
	//use the cat's velocity to make it move
	cat.x += cat.vx/4;
	cat.y += cat.vy/4;
  
	//check for a collision between the cat and the box
	if (hitTestRectangle(cat, box)) {
  
	  //if there's a collision, change the message text
	  //and tint the box red
	  message.text = "hit!";
	  box.tint = 0xff3300;
	} else {
  
	  //if there's no collision, reset the message
	  //text and the box's color
	  message.text = "No collision...";
	  box.tint = 0xccff99;
	}

	// sprite rotate
	// sprite.rotation += 0.02 * delta

	//Use the cat's velocity to make it move
	// cat.x += cat.vx;
	// cat.y += cat.vy
  }
  
  //The `hitTestRectangle` function
function hitTestRectangle(r1, r2) {

	//Define the variables we'll need to calculate
	let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  
	//hit will determine whether there's a collision
	hit = false;
  
	//Find the center points of each sprite
	r1.centerX = r1.x + r1.width / 2; 
	r1.centerY = r1.y + r1.height / 2; 
	r2.centerX = r2.x + r2.width / 2; 
	r2.centerY = r2.y + r2.height / 2; 
  
	//Find the half-widths and half-heights of each sprite
	r1.halfWidth = r1.width / 2;
	r1.halfHeight = r1.height / 2;
	r2.halfWidth = r2.width / 2;
	r2.halfHeight = r2.height / 2;
  
	//Calculate the distance vector between the sprites
	vx = r1.centerX - r2.centerX;
	vy = r1.centerY - r2.centerY;
  
	//Figure out the combined half-widths and half-heights
	combinedHalfWidths = r1.halfWidth + r2.halfWidth;
	combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  
	//Check for a collision on the x axis
	if (Math.abs(vx) < combinedHalfWidths) {
  
	  //A collision might be occurring. Check for a collision on the y axis
	  if (Math.abs(vy) < combinedHalfHeights) {
  
		//There's definitely a collision happening
		hit = true;
	  } else {
  
		//There's no collision on the y axis
		hit = false;
	  }
	} else {
  
	  //There's no collision on the x axis
	  hit = false;
	}
  
	//`hit` will be either `true` or `false`
	return hit;
  };

  //The `keyboard` helper function
  function keyboard(keyCode) {
	var key = {};
	key.code = keyCode;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
	//The `downHandler`
	key.downHandler = event => {
	  if (event.keyCode === key.code) {
		if (key.isUp && key.press) key.press();
		key.isDown = true;
		key.isUp = false;
	  }
	  event.preventDefault();
	};
  
	//The `upHandler`
	key.upHandler = event => {
	  if (event.keyCode === key.code) {
		if (key.isDown && key.release) key.release();
		key.isDown = false;
		key.isUp = true;
	  }
	  event.preventDefault();
	};
  
	//Attach event listeners
	window.addEventListener(
	  "keydown", key.downHandler.bind(key), false
	);
	window.addEventListener(
	  "keyup", key.upHandler.bind(key), false
	);
	return key;
  }

	// //load the cat 
	// app.loader.add('cat', "./assets/cat.png")
	// app.loader.load(setup);

	// let cat;

	// function setup(){
	// 	cat = Sprite.from('cat');
	// 	cat.y = 96;
	// 	app.stage.addChild(cat);

	// 	// start the game loop
	// 	app.ticker.add(delta => gameLoop(delta));
	// }

	// function gameLoop(delta){
	// 	cat.x +=1;
	// }