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
  // this.tank.body.bounce.setTo(1, 1);
  // this.tank.body.drag.set(2);
  this.tank.body.maxVelocity.setTo(300, 300);
  this.tank.rotation = 0;
  // game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);
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

  // if (cursors.left.isDown)
  // {
  //     tank.angle = 180;
  //     currentSpeed = 300;
  // }
  // else if (cursors.right.isDown)
  // {
  //     tank.angle = 0;
  //     currentSpeed = 300;
  // }
  // if (cursors.up.isDown)
  // {
  //     tank.angle = 270;
  //     currentSpeed = 300;
  // }
  // else if (cursors.down.isDown)
  // {
  //     tank.angle = 90;
  //     currentSpeed = 300;
  // }


  // if(this.currentSpeed > 0)
  // {
  //   this.currentSpeed -= 4;
  // }
  game.physics.arcade.velocityFromAngle(this.tank.angle,this.currentSpeed,this.tank.body.velocity);
};
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

  // enemies = game.add.group();
  // enemies.enableBody = true;
  // enemies.physicsBodyType = Phaser.Physics.ARCADE;
  // enemyTurrets = game.add.group();
  // enemyTurrets.enableBody = true;
  // enemyTurrets.physicsBodyType = Phaser.Physics.ARCADE;
  // enemy = enemies.create(65,500,'enemy','tank1');
  // enemy.scale.setTo(.75,.75);
  // enemy.anchor.setTo(0.5, 0.5);
  // enemy.animations.add('move',['tank1','tank2','tank3','tank4','tank5','tank6'],20,true);
  // enemyTurret = enemyTurrets.create(65, 500, 'enemy', 'turret');
  // enemyTurret.scale.setTo(.75,.75);
  // enemyTurret.anchor.setTo(0.3, 0.5);

  game.physics.enable(tank,Phaser.Physics.ARCADE);
  tank.body.drag.set(0.2);
  tank.body.maxVelocity.setTo(400, 400);
  tank.body.collideWorldBounds = true;
  // enemy.body.collideWorldBounds = true;
  turret = game.add.sprite(0, 0, 'tank', 'turret');
  turret.scale.setTo(.75,.75);
  turret.anchor.setTo(0.3, 0.5);
  // tank.bringToTop();
  // turret.bringToTop();

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
  // bullets.body.setSize(5, 5, 0, 0);


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
  // enemy.turret.kill()
  // enemy.alive = false;
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
  // game.physics.arcade.collide(tank, Enemy);
  // game.physics.arcade.overlap(bullets, enemies, bulletHitEnemy);
  game.physics.arcade.overlap(tank, enemyBullets, enemyBulletHitTank);


  for (var i = 0; i < enemies.length; i++)
  {
      if (enemies[i].alive)
      {
          //enemiesAlive++;
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

  // land.tilePosition.x = -game.camera.x;
  // land.tilePosition.y = -game.camera.y;

  turret.x = tank.x;
  turret.y = tank.y;
  turret.angle = tank.angle;

  // enemyTurret.x = enemy.x;
  // enemyTurret.y = enemy.y;
  // enemyTurret.angle = enemy.angle;

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

function render () {
    game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.body(spritename);
    //game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
}
