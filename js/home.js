var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
  game.load.atlas('enemy', 'assets/enemy-tanks.png', 'assets/tanks.json');
  game.load.image('logo', 'assets/logo.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('earth', 'assets/scorched_earth.png');
  game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);

  game.load.tilemap('map','assets/map.json',null,Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles','assets/gridtiles.png');
}

var map, shadow, tank, turret, enemies, enemyBullets, explosions, cursors, bullets, logo, fireButton,floorLayer,enemiesLayer,collisionsLayer;
var enemiesTotal = 0;
var enemiesAlive = 0;
var currentSpeed = 0;
var fireRate = 250;
var nextFire = 0;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

   map = game.add.tilemap('map');

   map.addTilesetImage('tiles');

   map.setCollisionBetween(19,500);

   floorLayer = map.createLayer('Floor');
   collisionsLayer = map.createLayer('Collisions');
   collisionsLayer.resizeWorld();

  //set world boundaries to a 2000x2000 square
  //game.world.setBounds(-1000,-1000,2000,2000);


  tank = game.add.sprite(400,100,'tank','tank1');
  tank.anchor.setTo(0.5,0.5);
  tank.animations.add('move',['tank1','tank2','tank3','tank4','tank5','tank6'],20,true);

  game.physics.enable(tank,Phaser.Physics.ARCADE);
  tank.body.drag.set(0.2);
  tank.body.maxVelocity.setTo(400, 400);
  tank.body.collideWorldBounds = true;

  turret = game.add.sprite(0, 0, 'tank', 'turret');
  turret.anchor.setTo(0.3, 0.5);

  tank.bringToTop();
  turret.bringToTop();

  game.camera.follow(tank);
  game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
  game.camera.focusOnXY(0, 0);

  cursors = game.input.keyboard.createCursorKeys();

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet', 0, false);
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 0.5);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {
  game.physics.arcade.collide(tank,collisionsLayer);
  game.physics.arcade.overlap(tank, null, this);

  if (cursors.left.isDown)
  {
      tank.angle = 180;
      currentSpeed = 300;
  }
  else if (cursors.right.isDown)
  {
      tank.angle = 0;
      currentSpeed = 300;
  }

  if (cursors.up.isDown)
  {
      tank.angle = 270;
      currentSpeed = 300;
  }
  else if (cursors.down.isDown)
  {
      tank.angle = 90;
      currentSpeed = 300;
  }
  else {
    if (currentSpeed > 0) {
      currentSpeed -= 4;
    }
  }

  if (currentSpeed > 0) {
    game.physics.arcade.velocityFromRotation(tank.rotation,currentSpeed,tank.body.velocity);
  }


  // land.tilePosition.x = -game.camera.x;
  // land.tilePosition.y = -game.camera.y;

  turret.x = tank.x;
  turret.y = tank.y;
  turret.angle = tank.angle;

  if (fireButton.isDown) {
    fire();
  }
}

function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);

        bullet.angle = tank.angle;
        game.physics.arcade.velocityFromRotation(bullet.rotation,500,bullet.body.velocity);
    }

}

function render () {

    game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    //game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);

}
