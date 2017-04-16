var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MyGame;
(function (MyGame) {
    var PhaserGame = (function (_super) {
        __extends(PhaserGame, _super);
        function PhaserGame() {
            var _this = _super.call(this, 288, 505, Phaser.AUTO, 'content', null) || this;
            _this.state.add('Boot', MyGame.BootState);
            _this.state.add('Preloader', MyGame.PreloaderState);
            _this.state.add('Menu', MyGame.MenuState);
            _this.state.add('Game', MyGame.GameState);
            _this.state.start('Boot');
            return _this;
        }
        return PhaserGame;
    }(Phaser.Game));
    MyGame.PhaserGame = PhaserGame;
})(MyGame || (MyGame = {}));
// when the page has finished loading, create our game
window.onload = function () {
    var game = new MyGame.PhaserGame();
};
var MyGame;
(function (MyGame) {
    var Bird = (function (_super) {
        __extends(Bird, _super);
        function Bird(game, x, y) {
            var _this = _super.call(this, game, x, y, 'bird') || this;
            _this.anchor.setTo(0.5, 0.5);
            _this.animations.add('flap');
            _this.animations.play('flap', 12, true);
            _this.flapSound = _this.game.add.audio('flap');
            _this.name = 'bird';
            _this.alive = false;
            _this.onGround = false;
            // enable physics on the bird
            // and disable gravity on the bird
            // until the game is started
            _this.game.physics.arcade.enableBody(_this);
            _this.body.allowGravity = false;
            _this.body.collideWorldBounds = true;
            _this.events.onKilled.add(_this.onKilled, _this);
            return _this;
        }
        Bird.prototype.update = function () {
            // check to see if our angle is less than 90
            // if it is rotate the bird towards the ground by 2.5 degrees
            if (this.angle < 90 && this.alive) {
                this.angle += 2.5;
            }
            if (!this.alive) {
                this.body.velocity.x = 0;
            }
        };
        Bird.prototype.flap = function () {
            if (!!this.alive) {
                this.flapSound.play();
                //cause our bird to "jump" upward
                this.body.velocity.y = -400;
                // rotate the bird to -40 degrees
                this.game.add.tween(this).to({ angle: -40 }, 100).start();
            }
        };
        Bird.prototype.revived = function () {
        };
        Bird.prototype.onKilled = function () {
            this.exists = true;
            this.visible = true;
            this.animations.stop();
            var duration = 90 / this.y * 300;
            this.game.add.tween(this).to({ angle: 90 }, duration).start();
            console.log('killed');
            console.log('alive:', this.alive);
        };
        return Bird;
    }(Phaser.Sprite));
    MyGame.Bird = Bird;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var Ground = (function (_super) {
        __extends(Ground, _super);
        function Ground(game, x, y, width, height) {
            var _this = _super.call(this, game, x, y, width, height, 'ground') || this;
            // start scrolling our ground
            _this.autoScroll(-200, 0);
            // enable physics on the ground sprite
            // this is needed for collision detection
            _this.game.physics.arcade.enableBody(_this);
            // we don't want the ground's body
            // to be affected by gravity or external forces
            _this.body.allowGravity = false;
            _this.body.immovable = true;
            return _this;
        }
        Ground.prototype.update = function () {
        };
        return Ground;
    }(Phaser.TileSprite));
    MyGame.Ground = Ground;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var Pipe = (function (_super) {
        __extends(Pipe, _super);
        function Pipe(game, x, y, frame) {
            var _this = _super.call(this, game, x, y, 'pipe', frame) || this;
            _this.anchor.setTo(0.5, 0.5);
            _this.game.physics.arcade.enableBody(_this);
            _this.body.allowGravity = false;
            _this.body.immovable = true;
            return _this;
        }
        Pipe.prototype.update = function () {
        };
        return Pipe;
    }(Phaser.Sprite));
    MyGame.Pipe = Pipe;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var PipeGroup = (function (_super) {
        __extends(PipeGroup, _super);
        function PipeGroup(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this.topPipe = new MyGame.Pipe(_this.game, 0, 0, 0);
            _this.bottomPipe = new MyGame.Pipe(_this.game, 0, 440, 1);
            _this.add(_this.topPipe);
            _this.add(_this.bottomPipe);
            _this.hasScored = false;
            _this.setAll('body.velocity.x', -200);
            return _this;
        }
        PipeGroup.prototype.update = function () {
            this.checkWorldBounds();
        };
        PipeGroup.prototype.checkWorldBounds = function () {
            if (!this.topPipe.inWorld) {
                this.exists = false;
            }
        };
        PipeGroup.prototype.reset = function (x, y) {
            this.topPipe.reset(0, 0);
            this.bottomPipe.reset(0, 440);
            this.x = x;
            this.y = y;
            this.setAll('body.velocity.x', -200);
            this.hasScored = false;
            this.exists = true;
        };
        PipeGroup.prototype.stop = function () {
            this.setAll('body.velocity.x', 0);
        };
        return PipeGroup;
    }(Phaser.Group));
    MyGame.PipeGroup = PipeGroup;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var Scoreboard = (function (_super) {
        __extends(Scoreboard, _super);
        function Scoreboard(game) {
            var _this = _super.call(this, game) || this;
            var gameover = _this.create(_this.game.width / 2, 100, 'gameover');
            gameover.anchor.setTo(0.5, 0.5);
            _this.scoreboard = _this.create(_this.game.width / 2, 200, 'scoreboard');
            _this.scoreboard.anchor.setTo(0.5, 0.5);
            _this.scoreText = _this.game.add.bitmapText(_this.scoreboard.width, 180, 'flappyfont', '', 18);
            _this.add(_this.scoreText);
            _this.bestText = _this.game.add.bitmapText(_this.scoreboard.width, 230, 'flappyfont', '', 18);
            _this.add(_this.bestText);
            // add our start button with a callback
            _this.startButton = _this.game.add.button(_this.game.width / 2, 300, 'startButton', _this.startClick, _this);
            _this.startButton.anchor.setTo(0.5, 0.5);
            _this.add(_this.startButton);
            _this.y = _this.game.height;
            _this.x = 0;
            return _this;
        }
        Scoreboard.prototype.show = function (score) {
            var coin, bestScore;
            this.scoreText.setText(score.toString());
            if (!!localStorage) {
                bestScore = localStorage.getItem('bestScore');
                if (!bestScore || bestScore < score) {
                    bestScore = score;
                    localStorage.setItem('bestScore', bestScore);
                }
            }
            else {
                bestScore = 'N/A';
            }
            this.bestText.setText(bestScore.toString());
            if (score >= 10 && score < 29) {
                coin = this.game.add.sprite(-65, 7, 'medals', 0);
            }
            else if (score >= 20) {
                coin = this.game.add.sprite(-65, 7, 'medals', 1);
            }
            this.game.add.tween(this).to({ y: 0 }, 1000, Phaser.Easing.Bounce.Out, true);
            if (coin) {
                coin.anchor.setTo(0.5, 0.5);
                this.scoreboard.addChild(coin);
                // Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
                var emitter = this.game.add.emitter(coin.x, coin.y, 400);
                this.scoreboard.addChild(emitter);
                emitter.width = coin.width;
                emitter.height = coin.height;
                //  This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
                // emitter.width = 800;
                emitter.makeParticles('particle');
                // emitter.minParticleSpeed.set(0, 300);
                // emitter.maxParticleSpeed.set(0, 600);
                emitter.setRotation(-100, 100);
                emitter.setXSpeed(0, 0);
                emitter.setYSpeed(0, 0);
                emitter.minParticleScale = 0.25;
                emitter.maxParticleScale = 0.5;
                emitter.setAll('body.allowGravity', false);
                emitter.start(false, 1000, 1000);
            }
        };
        Scoreboard.prototype.startClick = function () {
            this.game.state.start('Game');
        };
        Scoreboard.prototype.update = function () {
        };
        return Scoreboard;
    }(Phaser.Group));
    MyGame.Scoreboard = Scoreboard;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var BootState = (function (_super) {
        __extends(BootState, _super);
        function BootState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BootState.prototype.preload = function () {
            this.load.image('preloadbar', 'assets/preloader.gif');
        };
        BootState.prototype.create = function () {
            // Use this if you don't need multitouch
            this.input.maxPointers = 1;
            if (this.game.device.desktop) {
                // Desktop specific settings go here
            }
            this.game.state.start('Preloader', true, false);
        };
        return BootState;
    }(Phaser.State));
    MyGame.BootState = BootState;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameState.prototype.preload = function () { };
        GameState.prototype.create = function () {
            // start the phaser arcade physics engine
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // give our world an initial gravity of 1200
            this.game.physics.arcade.gravity.y = 1200;
            // add the background sprite
            this.background = this.game.add.sprite(0, 0, 'background');
            // create and add a group to hold our pipeGroup prefabs
            this.pipes = this.game.add.group();
            // create and add a new Bird object
            this.bird = new MyGame.Bird(this.game, 100, this.game.height / 2);
            this.game.add.existing(this.bird);
            // create and add a new Ground object
            this.ground = new MyGame.Ground(this.game, 0, 400, 335, 112);
            this.game.add.existing(this.ground);
            // add keyboard controls
            this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.flapKey.onDown.addOnce(this.startGame, this);
            this.flapKey.onDown.add(this.bird.flap, this.bird);
            // add mouse/touch controls
            this.game.input.onDown.addOnce(this.startGame, this);
            this.game.input.onDown.add(this.bird.flap, this.bird);
            // // keep the spacebar from propogating up to the browser
            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
            this.score = 0;
            this.scoreText = this.game.add.bitmapText(this.game.width / 2, 10, 'flappyfont', this.score.toString(), 24);
            this.instructionGroup = this.game.add.group();
            this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 100, 'getReady'));
            this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 325, 'instructions'));
            this.instructionGroup.setAll('anchor.x', 0.5);
            this.instructionGroup.setAll('anchor.y', 0.5);
            this.pipeGenerator = null;
            this.gameover = false;
            this.pipeHitSound = this.game.add.audio('pipeHit');
            this.groundHitSound = this.game.add.audio('groundHit');
            this.scoreSound = this.game.add.audio('score');
        };
        GameState.prototype.update = function () {
            // enable collisions between the bird and the ground
            this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
            if (!this.gameover) {
                // enable collisions between the bird and each group in the pipes group
                this.pipes.forEach(function (pipeGroup) {
                    this.checkScore(pipeGroup);
                    this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
                }, this);
            }
        };
        GameState.prototype.shutdow = function () {
            this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
            this.bird.destroy();
            this.pipes.destroy();
            this.scoreboard.destroy();
        };
        GameState.prototype.startGame = function () {
            if (!this.bird.alive && !this.gameover) {
                this.bird.body.allowGravity = true;
                this.bird.alive = true;
                // add a timer
                this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
                this.pipeGenerator.timer.start();
                this.instructionGroup.destroy();
            }
        };
        GameState.prototype.checkScore = function (pipeGroup) {
            if (pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
                pipeGroup.hasScored = true;
                this.score++;
                this.scoreText.setText(this.score.toString());
                this.scoreSound.play();
            }
        };
        GameState.prototype.deathHandler = function (bird, enemy) {
            if (enemy instanceof MyGame.Ground && !this.bird.onGround) {
                this.groundHitSound.play();
                this.scoreboard = new MyGame.Scoreboard(this.game);
                this.game.add.existing(this.scoreboard);
                this.scoreboard.show(this.score);
                this.bird.onGround = true;
            }
            else if (enemy instanceof MyGame.Pipe) {
                this.pipeHitSound.play();
            }
            if (!this.gameover) {
                this.gameover = true;
                this.bird.kill();
                this.pipes.callAll('stop', null);
                this.pipeGenerator.timer.stop();
                this.ground.stopScroll();
            }
        };
        GameState.prototype.generatePipes = function () {
            var pipeY = this.game.rnd.integerInRange(-100, 100);
            var pipeGroup = this.pipes.getFirstExists(false);
            if (!pipeGroup) {
                pipeGroup = new MyGame.PipeGroup(this.game, this.pipes);
            }
            pipeGroup.reset(this.game.width, pipeY);
        };
        return GameState;
    }(Phaser.State));
    MyGame.GameState = GameState;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var MenuState = (function (_super) {
        __extends(MenuState, _super);
        function MenuState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MenuState.prototype.preload = function () { };
        MenuState.prototype.create = function () {
            // add the background sprite
            this.background = this.game.add.sprite(0, 0, 'background');
            // add the ground sprite as a tile
            // and start scrolling in the negative x direction
            this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');
            this.ground.autoScroll(-200, 0);
            /** STEP 1 **/
            // create a group to put the title assets in 
            // so they can be manipulated as a whole
            this.titleGroup = this.game.add.group();
            /** STEP 2 **/
            // create the title sprite
            // and add it to the group
            this.title = this.game.add.bitmapText(0, 0, 'flappyfont', 'KickyCow', 50);
            // this.title = this.add.sprite(0,0,'title');
            this.titleGroup.add(this.title);
            /** STEP 3 **/
            // create the bird sprite 
            // and add it to the title group
            this.bird = this.add.sprite(200, 35, 'bird');
            this.titleGroup.add(this.bird);
            /** STEP 4 **/
            // add an animation to the bird
            // and begin the animation
            this.bird.animations.add('flap');
            this.bird.animations.play('flap', 12, true);
            /** STEP 5 **/
            // Set the originating location of the group
            this.titleGroup.x = 30;
            this.titleGroup.y = 100;
            /** STEP 6 **/
            //  create an oscillating animation tween for the group
            this.game.add.tween(this.titleGroup).to({ y: 115 }, 350, Phaser.Easing.Linear.None, true, 0, 1000, true);
            // add our start button with a callback
            this.startButton = this.game.add.button(this.game.width / 2, 300, 'startButton', this.startClick, this);
            this.startButton.anchor.setTo(0.5, 0.5);
        };
        MenuState.prototype.startClick = function () {
            // start button click handler
            // start the 'play' state
            this.game.state.start('Game');
        };
        return MenuState;
    }(Phaser.State));
    MyGame.MenuState = MenuState;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var PreloaderState = (function (_super) {
        __extends(PreloaderState, _super);
        function PreloaderState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.ready = false;
            return _this;
        }
        PreloaderState.prototype.preload = function () {
            this.asset = this.add.sprite(288 / 2, 505 / 2, 'preloadbar');
            this.asset.anchor.setTo(0.5, 0.5);
            this.load.setPreloadSprite(this.asset);
            this.load.image('background', 'assets/background.png');
            this.load.image('ground', 'assets/ground.png');
            this.load.image('title', 'assets/title.png');
            this.load.spritesheet('bird', 'assets/bird.png', 25, 24, 6);
            this.load.spritesheet('pipe', 'assets/pipes.png', 54, 320, 2);
            this.load.image('startButton', 'assets/start-button.png');
            this.load.image('instructions', 'assets/instructions.png');
            this.load.image('getReady', 'assets/get-ready.png');
            this.load.image('scoreboard', 'assets/scoreboard.png');
            this.load.spritesheet('medals', 'assets/medals.png', 44, 46, 2);
            this.load.image('gameover', 'assets/gameover.png');
            this.load.image('particle', 'assets/particle.png');
            this.load.audio('flap', 'assets/flap.wav');
            this.load.audio('pipeHit', 'assets/pipe-hit.wav');
            this.load.audio('groundHit', 'assets/ground-hit.wav');
            this.load.audio('score', 'assets/score.wav');
            this.load.audio('ouch', 'assets/ouch.wav');
            this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');
        };
        PreloaderState.prototype.create = function () {
            var tween = this.add.tween(this.preload).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMenu, this);
        };
        PreloaderState.prototype.startMenu = function () {
            this.game.state.start('Menu', true, false);
        };
        return PreloaderState;
    }(Phaser.State));
    MyGame.PreloaderState = PreloaderState;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=game.js.map