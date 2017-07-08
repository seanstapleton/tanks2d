var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  // game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
  // game.load.atlas('enemy', 'assets/enemy-tanks.png', 'assets/tanks.json');
  // game.load.image('logo', 'assets/logo.png');
  // game.load.image('bullet', 'assets/bullet.png');
  // game.load.image('earth', 'assets/scorched_earth.png');
  // game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
  // game.load.tilemap('map','assets/map.json',null,Phaser.Tilemap.TILED_JSON);
  // game.load.image('tiles','assets/gridtiles.png');

    game.load.crossOrigin = "anonymous";

    game.load.tilemap('map','https://dl.dropboxusercontent.com/s/lwitgju2uwdiv85/map.json?dl=0',null,Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles','https://dl.dropboxusercontent.com/s/5dxkk92k1jf7zp6/gridtiles.png?dl=0');

    game.load.atlas('tank', 'http://examples.phaser.io/assets/games/tanks/tanks.png', 'http://examples.phaser.io/assets/games/tanks/tanks.json');
    game.load.atlas('enemy', 'http://examples.phaser.io/assets/games/tanks/enemy-tanks.png', 'http://examples.phaser.io/assets/games/tanks/tanks.json');
    game.load.image('logo', 'http://examples.phaser.io/assets/games/tanks/logo.png');
    game.load.image('bullet', 'http://examples.phaser.io/assets/games/tanks/bullet.png');
    game.load.image('earth', 'http://examples.phaser.io/assets/games/tanks/scorched_earth.png');
    game.load.spritesheet('kaboom', 'http://examples.phaser.io/assets/games/tanks/explosion.png', 64, 64, 23);
}

var map, shadow, tank, turret, enemy, enemies, enemyTurrets, enemyBullets, explosions, cursors, bullets, logo, fireButton,floorLayer,enemiesLayer,collisionsLayer;
var enemiesTotal = 3;
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

  tank = game.add.sprite(400,100,'tank','tank1');
  tank.scale.setTo(.75,.75);
  tank.anchor.setTo(0.5,0.5);
  tank.animations.add('move',['tank1','tank2','tank3','tank4','tank5','tank6'],20,true);

  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.scale.set(1,1);
  enemyBullets.createMultiple(30, 'bullet', 0, false);
  enemyBullets.setAll('anchor.x', 0.5);
  enemyBullets.setAll('anchor.y', 0.5);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);

  enemies = [];
  for(i=0; i < enemiesTotal; i++){
    enemies.push(new Enemy(i,game,65+i*155,500,tank,enemyBullets));
  }
  game.physics.enable(tank,Phaser.Physics.ARCADE);
  tank.body.drag.set(0.2);
  tank.body.maxVelocity.setTo(400, 400);
  tank.body.collideWorldBounds = true;
  turret = game.add.sprite(0, 0, 'tank', 'turret');
  turret.scale.setTo(.75,.75);
  turret.anchor.setTo(0.3, 0.5);

  game.camera.follow(tank);
  game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
  game.camera.focusOnXY(0, 0);

  cursors = game.input.keyboard.createCursorKeys();

  bullets = game.add.group();

  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.scale.set(1,1);
  bullets.createMultiple(30, 'bullet', 0, false);
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 0.5);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  for (var i = 0; i < bullets.children.length; i++){
    bullets.children[i].body.setSize(10,10,10,0);
  }
}

function kill_bullet(bullet,wall=null){
  bullet.kill();
}
function bulletHitEnemy(tank,bullet){
  enemy = enemies[tank.name];
  enemy.turret.kill()
  enemy.alive = false;
  enemy.tank.kill();
  kill_bullet(bullet);
}
function enemyBulletHitTank(tank,enemyBullet){
  turret.kill();
  tank.kill();
  kill_bullet(enemyBullet);
}

function update() {
  game.physics.arcade.collide(tank,collisionsLayer);
  game.physics.arcade.collide(bullets,collisionsLayer, kill_bullet);
  game.physics.arcade.collide(enemyBullets,collisionsLayer, kill_bullet);
  game.physics.arcade.overlap(tank, enemyBullets, enemyBulletHitTank);

  for (var i = 0; i < enemies.length; i++)
  {
      if (enemies[i].alive)
      {
          game.physics.arcade.collide(tank, enemies[i].tank);
          game.physics.arcade.collide(enemies[i].tank, collisionsLayer);
          game.physics.arcade.overlap(enemies[i].tank, bullets, bulletHitEnemy);
          enemies[i].update();
      }
  }

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
    game.physics.arcade.velocityFromAngle(tank.angle,currentSpeed,tank.body.velocity);
  }
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
        game.physics.arcade.velocityFromAngle(bullet.angle,500,bullet.body.velocity);
    }
}
Enemy = function(index, game, x, y, player, bullets) {
  this.game = game;
  this.player = player;
  this.bullets = bullets;
  this.fireRate = 1000;
  this.nextFire = 0;
  this.alive = true;
  this.currentSpeed = 0;

  this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
  this.turret = game.add.sprite(x, y, 'enemy', 'turret');
  this.tank.scale.setTo(.75,.75);
  this.turret.scale.setTo(.75,.75);
  this.tank.anchor.set(0.5
  );
  this.turret.anchor.set(0.3, 0.5);

  this.tank.name = index.toString();
  game.physics.enable(this.tank, Phaser.Physics.ARCADE);
  this.tank.body.immovable = false;
  this.tank.body.collideWorldBounds = true;
  this.tank.body.maxVelocity.setTo(300, 300);
  this.tank.rotation = 0;
};

Enemy.prototype.update = function(){
  this.turret.x = this.tank.x;
  this.turret.y = this.tank.y;
  this.turret.rotation = this.tank.rotation;

  if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300)
  {
      if (this.game.time.now > this.nextFire )
      {
          this.nextFire = this.game.time.now + this.fireRate;

          var bullet = this.bullets.getFirstExists(false);

          bullet.reset(this.turret.x, this.turret.y);
          bullet.angle = this.tank.angle;
          game.physics.arcade.velocityFromAngle(bullet.angle,500,bullet.body.velocity);
      }
  }
  this.move();

};

Enemy.prototype.move = function(currentSpeed)
{
  var moveDir = game.rnd.integerInRange(1,100);
  this.currentSpeed = 200;

  if (moveDir == 1)
  {
    this.tank.angle = 90;
  }
  else if (moveDir == 2)
  {
    this.tank.angle = 180;
  }
  else if (moveDir == 3)
  {
    this.tank.angle = 270;
  }
  else if (moveDir == 4)
  {
    this.tank.angle = 0;
  }

  game.physics.arcade.velocityFromAngle(this.tank.angle,this.currentSpeed,this.tank.body.velocity);
};



function render () {

}
