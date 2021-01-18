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

// App with width and height of the page
const app = new Application({
	width: window.innerWidth,
	height: window.innerHeight
})
document.body.appendChild(app.view) // Create Canvas tag in the body

var sprite, cat, state;



//Line
let line = new Graphics();   
line.lineStyle(4, 0xFFFFFF, 1);
line.moveTo(0, 0);
line.lineTo(80, 50);
line.x = 32;
line.y = 32;
app.stage.addChild(line);

// Load the logo 
app.loader.add('logo', './assets/logo.png').add('cat', "./assets/cat.png")
app.loader.load(() => {
	sprite = Sprite.from('logo')
	sprite.anchor.set(0.5) // We want to rotate our sprite relative to the center, so 0.5
	app.stage.addChild(sprite)

	// Position the sprite at the center of the stage
	sprite.x = app.screen.width * 0.5
	sprite.y = app.screen.height * 0.5

	// add sprite cat
	cat = Sprite.from('cat')
	app.stage.addChild(cat);
	cat.y = 96;
	cat.x = 96;
	cat.vx = 0;
	cat.vy = 0;


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
})

function gameLoop(delta){

	//Update the current game state:
	state(delta);
  }
  
  function play(delta) {
  
	// sprite rotate
	sprite.rotation += 0.02 * delta

	//Use the cat's velocity to make it move
	cat.x += cat.vx;
	cat.y += cat.vy
  }
  
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
