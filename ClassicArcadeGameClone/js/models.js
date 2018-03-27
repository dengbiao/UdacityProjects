const WINDOW_WIDTH = 505;//游戏视窗宽度
const WINDOW_HEIGHT = 606;//游戏视窗高度
const ROW_NUMS = 6;//行数
const COL_NUMS = 5;//列数
const ROW_WIDTH = 101;//行宽
const COL_HEIGHT = 83;//列高
const MAX_SPPED = 5;//敌人运行的最大速度
const MAX_START_DELAY = 8;//敌人重置后 出现在屏幕的最大延时

const MAX_ENEMY_COUNT = 5;//最大敌人数量

/**
 * 场景类 每个场景包含多个需要绘制的对象 比如开始场景 游戏场景 胜利场景 失败场景等
 * @param {string} name 
 * @param {Array} sprites 
 */
 const Scene = function(name, sprites) {
    this.name = name;//场景名称
    this.sprites = sprites;//场景包含的精灵
}

/**
 * 背景类  负责绘制背景
 */
const BackSprite = function () {
    this.rowImages = [
        'images/water-block.png',   // 这一行是河。
        'images/stone-block.png',   // 第一行石头
        'images/stone-block.png',   // 第二行石头
        'images/stone-block.png',   // 第三行石头
        'images/grass-block.png',   // 第一行草地
        'images/grass-block.png'    // 第二行草地
    ];
}

BackSprite.prototype.update = function() {

}

BackSprite.prototype.render = function () {
   /* 这个数组保存着游戏关卡的特有的行对应的图片相对路径。 */
   let row, col;

   /* 便利我们上面定义的行和列，用 rowImages 数组，在各自的各个位置绘制正确的图片 */
   for (row = 0; row < ROW_NUMS; row++) {
       for (col = 0; col < COL_NUMS; col++) {
           /* 这个 canvas 上下文的 drawImage 函数需要三个参数，第一个是需要绘制的图片
           * 第二个和第三个分别是起始点的x和y坐标。我们用我们事先写好的资源管理工具来获取
           * 我们需要的图片，这样我们可以享受缓存图片的好处，因为我们会反复的用到这些图片
           */
           ctx.drawImage(Resources.get(this.rowImages[row]), col * ROW_WIDTH, row * COL_HEIGHT);
       }
   }
}

/**
 * 敌人类  负责敌人的运动 更新  绘制
 */
let Enemy = function(sprite = 'images/enemy-bug.png', x, y, factor, speed, isActive = true) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件

    this.sprite = sprite;
    this.speed = Math.round(Math.random() * MAX_SPPED) + 1;
    
    if (typeof(x) == "undefined") {//设置敌人的默认出现位置 x轴负的n个坐标
        this.startDelay = Math.round(Math.random() * MAX_START_DELAY) + 1;
        this.x = -ROW_WIDTH * this.startDelay;
    } else {
        this.x = x;
    }
    this.y = typeof(y) == "undefined" ? COL_HEIGHT * (Math.round(Math.random() * 2) + 1) : y;

    this.factor = factor ? factor : -10;//撞击到该敌人 扣多少分
    this.isActive = isActive;
};

Enemy.prototype.reset = function () {
    this.speed = Math.round(Math.random()*4) + 1;//速度也改一下
    //重新赋值 y和x吧
    let row = Math.round(Math.random()*2) + 1; 
    this.startDelay = Math.round(Math.random()*8) + 1;
    this.x = -ROW_WIDTH * this.startDelay;
    this.y = COL_HEIGHT * row;
}

/**
 * 更新敌人坐标  会判断是否超出屏幕 如果超出 则重置
 * @param {long} dt 
 */
Enemy.prototype.update = function(dt) {
    if (this.isActive) {
        // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
        // 都是以同样的速度运行的
        this.x += ROW_WIDTH * dt * this.speed;
        if (this.x > COL_NUMS * ROW_WIDTH) {
            this.reset();
        }
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    if (this.isActive) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    } else {
        let imageToDraw = Resources.get(this.sprite);
        ctx.drawImage(imageToDraw, this.x + imageToDraw.width/4, this.y + imageToDraw.height/4, imageToDraw.width/2, imageToDraw.height/2);
    }
};

/**
 * 玩家类  负责监听按键实现玩家运动  以及玩家和敌人的碰撞检测
 */
const Player = function() {
    this.sprite = 'images/char-cat-girl.png';
    this.x = ROW_WIDTH * 2;
    this.y = COL_HEIGHT * 5;
}

Player.prototype.update = function(dt) {
    
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.reset = function () {
    this.x = ROW_WIDTH * 2;
    this.y = COL_HEIGHT * 5;
}

Player.prototype.handleInput = function(key) {
    if (key == "left") {
        //左移
        this.x -= ROW_WIDTH;
        this.x = this.x < 0 ? 0 : this.x;
    } else if (key == "right") {
        this.x += ROW_WIDTH;
        this.x = this.x > 4 * ROW_WIDTH ? 4 * ROW_WIDTH : this.x;
    } else if (key == "up") {
        this.y -= COL_HEIGHT;
    } else if (key == "down") {
        this.y += COL_HEIGHT;
        this.y = this.y > 5 * COL_HEIGHT ? 5 * COL_HEIGHT : this.y;
    }
}

/**
 * 可以绘制的文本对象  包含了需要绘制的文本的各种属性
 * @param {string} text 
 * @param {int} x 
 * @param {int} y 
 * @param {string} textColor 
 * @param {int} strokeWidth
 * @param {string} strokeStyle 
 * @param {string} font 
 * @param {string} textAlign 
 */
const TextSprite = function (text="", x=0, y=0, textColor="white", strokeWidth=0, strokeStyle, font="14pt Calibri", textAlign="center") {
    this.text = text;
    this.x = x;
    this.y = y;
    this.textColor = textColor;
    this.strokeWidth = strokeWidth;
    this.strokeStyle = strokeStyle;
    this.font = font;
    this.textAlign = textAlign;
}

TextSprite.prototype.update = function (dt) {

}

TextSprite.prototype.render = function () {
    ctx.save();
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;
    ctx.fillStyle = this.textColor;
    ctx.fillText(this.text, this.x ,this.y);

    if (this.strokeWidth > 0) {     
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeText(this.text, this.x, this.y);
    }

    ctx.restore();
}

TextSprite.prototype.reset = function (text) {
    this.text = text;
}

const RoleChooser = function(heightOffset = 260, roles) {
    this.currentSelectPosition = 0;
    this.heightOffset = heightOffset;//默认的角色选择器在平魔中的绘制高度
    if (roles) {
        this.roles = roles;
    } else {
        this.roles = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png',
        ];
    }
}

RoleChooser.prototype.update = function (dt) {

}

RoleChooser.prototype.render = function () {
    let imageToDraw = Resources.get(this.roles[this.currentSelectPosition]);
    let widthToDraw = imageToDraw.width * 1.2;
    let heightToDraw = imageToDraw.height * 1.2;
    ctx.drawImage(imageToDraw, WINDOW_WIDTH/2 - widthToDraw/2, this.heightOffset, widthToDraw, heightToDraw);

    if (this.roles.length > 1) {
        let leftImageToDrawPosition = (this.currentSelectPosition + this.roles.length - 1) % this.roles.length;//循环获取 如果当前是0  则取最后一个
        let leftImageToDraw = Resources.get(this.roles[leftImageToDrawPosition]);
        ctx.drawImage(leftImageToDraw, WINDOW_WIDTH/2 - imageToDraw.width * 3 /2, this.heightOffset);
    }

    if (this.roles.length > 2) {//可以绘制3个
        let rightImageToDrawPosition = (this.currentSelectPosition + 1) % this.roles.length;//循环获取 如果当前是最后一个  则取第0个
        let rightImageToDraw = Resources.get(this.roles[rightImageToDrawPosition]);
        ctx.drawImage(rightImageToDraw, WINDOW_WIDTH/2 + imageToDraw.width/2, this.heightOffset);
    }

}


RoleChooser.prototype.handleInput = function(key) {
    if (key == "right") {
        this.currentSelectPosition = (this.currentSelectPosition + this.roles.length - 1) % this.roles.length;
    } else if (key == "left") {
        this.currentSelectPosition = (this.currentSelectPosition + 1) % this.roles.length;
    } else if (key == "enter" || key == "space") {
        player.sprite = this.roles[this.currentSelectPosition];//使用当前选中角色
        currentScene = allScenes.get("game");//切换到游戏场景
    }
}

const TriangleIndicator = function () {
    this.size = 20;//三角形的边的长度
    this.heightOffset = 455;
    this.maxSize = 25;
    this.minSize = 20;
    this.direction = 0;//0表示处于变大状态 1表示处于缩小状态
}
TriangleIndicator.prototype.update = function (dt) {
    let offset = 10 * dt;
    if (this.direction == 0) {
        if (this.size + offset > this.maxSize) {//超过最大大小  设置大小为最大 而且调整下一步为缩小
            this.size = this.maxSize;
            this.direction = 1;
        } else {
            this.size += offset;
        }
    } else {
        if (this.size - offset < this.minSize) {
            this.size = this.minSize;
            this.direction = 0;
        } else {
            this.size -= offset;
        }
    }
}

TriangleIndicator.prototype.render = function () {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "white";
    let orizontalOffset = Math.sin(30 * Math.PI / 180) * this.size;
    let verticalOffset = Math.cos(30 * Math.PI / 180) * this.size / 3;//三分之一三角形的高
    ctx.moveTo(WINDOW_WIDTH/2, this.heightOffset - 2*verticalOffset);
    ctx.lineTo(WINDOW_WIDTH/2 - orizontalOffset, this.heightOffset + verticalOffset);
    ctx.lineTo(WINDOW_WIDTH/2 + orizontalOffset, this.heightOffset + verticalOffset);
    ctx.lineTo(WINDOW_WIDTH/2, this.heightOffset - 2*verticalOffset);
    ctx.stroke();
    ctx.restore();
}

const Collection = function (factor = 10, image = 'images/Gem Blue') {
    this.factor = factor;
    this.image = image;
}