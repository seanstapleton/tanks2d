var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
  game.load.atlas('enemy', 'assets/enemy-tanks.png', 'assets/tanks.json');
  game.load.image('logo', 'assets/logo.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('earth', 'assets/scorched_earth.png');
  game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
}

var land, shadow, tank, turret, enemies, enemyBullets, explosions, cursors, bullets, logo;
var enemiesTotal = 0;
var enemiesAlive = 0;
var currentSpeed = 5;
var fireRate = 100;
var nextFire = 0;

function create() {
  //set world boundaries to a 2000x2000 square
  game.world.setBounds(-1000,-1000,2000,2000);
  land = game.add.tileSprite(0,0,800,600,'earth');
  land.fixedToCamera = true;

  tank = game.add.sprite(0,0,'tank','tank1');
  tank.anchor.setTo(0.5,0.5);
  tank.animations.add('move',['tank1','tank2','tank3','tank4','tank5','tank6'],20,true);

  turret = game.add.sprite(0, 0, 'tank', 'turret');
  turret.anchor.setTo(0.3, 0.5);

  tank.bringToTop();
  turret.bringToTop();

  game.camera.follow(tank);
  game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
  game.camera.focusOnXY(0, 0);

  cursors = game.input.keyboard.createCursorKeys();

}

function update() {
  game.physics.arcade.overlap(tank, null, this);

  if (cursors.left.isDown)
  {
      tank.x -= currentSpeed;
      tank.angle = 180;
  }
  else if (cursors.right.isDown)
  {
      tank.x += currentSpeed;
      tank.angle = 0;
  }

  if (cursors.up.isDown)
  {
      tank.y -= currentSpeed;
      tank.angle = 270;
  }
  else if (cursors.down.isDown)
  {
      tank.y += currentSpeed;
      tank.angle = 90;
  }


  land.tilePosition.x = -game.camera.x;
  land.tilePosition.y = -game.camera.y;

  turret.x = tank.x;
  turret.y = tank.y;
  turret.angle = tank.angle;
}
