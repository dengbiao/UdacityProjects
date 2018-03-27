// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.speed = Math.round(Math.random()*4) + 1;
    this.startDelay = Math.round(Math.random()*8) + 1;
    this.x = -101 * this.startDelay;
    this.y = 83 * (Math.round(Math.random()*2) + 1);
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += 101 * dt * this.speed;
    if (this.x > 5*101) {
        this.speed = Math.round(Math.random()*4) + 1;//速度也改一下
        //重新赋值 y和x吧
        let row = Math.round(Math.random()*2) + 1; 
        this.startDelay = Math.round(Math.random()*8) + 1;
        this.x = -101 * this.startDelay;
        this.y = 83 * row;
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数

var Player = function() {
    this.sprite = 'images/char-cat-girl.png';
    this.x = 101 * 3;
    this.y = 83 * 5;
}

Player.prototype.update = function(dt) {
    //检查碰撞 
    const player = this;
    allEnemies.forEach(function(enemy) {
        let centerX = player.x + 101/2;
        let centerY = player.y + 83/2;
        if ((centerX > enemy.x && centerX < enemy.x + 101)
            && (centerY > enemy.y && centerY < enemy.y + 83)) {
            //碰到了 要还原player到原始位置
            player.x = 101 * 3;
            player.y = 83 * 5;
        }
    });
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    if (key == "left") {
        //左移
        this.x -= 101;
        this.x = this.x < 0 ? 0 : this.x;
    } else if (key == "right") {
        this.x += 101;
        this.x = this.x > 4 * 101 ? 4 * 101 : this.x;
    } else if (key == "up") {
        this.y -= 83;
        this.y = this.y < 83 ? 5*83 : this.y;//到了最上面的话 就赢了 直接还原
    } else if (key == "down") {
        this.y += 83;
        this.y = this.y > 5 * 83 ? 5 * 83 : this.y;
    }
}


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
const allEnemies = [];

for (let i = 0; i<5; i++) {
    let enemy = new Enemy();
    allEnemies.push(enemy);
}

const player = new Player();


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
