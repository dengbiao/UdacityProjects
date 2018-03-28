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
   let row, col;

   /* 便利我们上面定义的行和列，用 rowImages 数组，在各自的各个位置绘制正确的图片 */
   for (row = 0; row < ROW_NUMS; row++) {
       for (col = 0; col < COL_NUMS; col++) {
           ctx.drawImage(Resources.get(this.rowImages[row]), col * ROW_WIDTH, row * COL_HEIGHT);
       }
   }
}

/**
 * 
/**
 * 敌人类  负责敌人的运动 更新  绘制
 * 考虑到可收集的那些东西和敌人类有共性  所以就整合到一起了。
 * @param {string} sprite 对象的图像
 * @param {number} x 对象的绘制x坐标
 * @param {number} y 对象的绘制y坐标
 * @param {number} factor 加分因子  正数表示加分 负数 表示减分
 * @param {number} speed 移动速度
 * @param {boolean} isActive 是不是运动对象  敌人类是可动的   收藏类是不动的
 */
let Enemy = function(sprite = 'images/enemy-bug.png', x, y, factor, speed, isActive = true, scale = 1) {

    this.sprite = sprite;
    this.speed = Math.round(Math.random() * MAX_SPPED) + 1;//随机一个速度
    
    if (typeof(x) == "undefined") {//设置敌人的默认出现位置 x轴负的n个坐标
        this.startDelay = Math.round(Math.random() * MAX_START_DELAY) + 1;
        this.x = -ROW_WIDTH * this.startDelay;
    } else {
        this.x = x;
    }
    this.y = typeof(y) == "undefined" ? COL_HEIGHT * (Math.round(Math.random() * 2) + 1) : y;//随机一个y坐标 范围是1-3 对应背景图

    this.factor = factor ? factor : -10;//撞击到该敌人 扣多少分
    this.isActive = isActive;
    this.scale = scale;
};

Enemy.prototype.reset = function () {
    this.speed = Math.round(Math.random() * MAX_SPPED) + 1;//速度也改一下
    //重新赋值 y和x吧
    let row = Math.round(Math.random() * 2) + 1; 
    this.startDelay = Math.round(Math.random()*MAX_START_DELAY) + 1;
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
    let imageToDraw = Resources.get(this.sprite);
    if (this.scale == 1) {
        ctx.drawImage(imageToDraw, this.x, this.y);
    } else {
        ctx.drawImage(imageToDraw, this.x + imageToDraw.width * this.scale / 2, this.y + imageToDraw.height * this.scale / 2
            , imageToDraw.width * this.scale, imageToDraw.height * this.scale);
    }
};

/**
 * 玩家类  负责绘制玩家对象 以及监听按键实现玩家运动 
 */
const Player = function() {
    this.sprite = 'images/char-cat-girl.png';
    this.x = ROW_WIDTH * ((COL_NUMS-1) / 2);//屏幕中间列
    this.y = COL_HEIGHT * (ROW_NUMS - 1);//屏幕最底下一行
}

Player.prototype.update = function(dt) {
    
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.reset = function () {
    this.x = ROW_WIDTH * ((COL_NUMS-1) / 2);//屏幕中间列
    this.y = COL_HEIGHT * (ROW_NUMS - 1);//屏幕最底下一行
}

Player.prototype.handleInput = function(key) {
    if (key == "left") {
        //左移
        this.x -= ROW_WIDTH;
        this.x = this.x < 0 ? 0 : this.x;//边界检测
    } else if (key == "right") {//右移
        this.x += ROW_WIDTH;
        this.x = this.x > (COL_NUMS - 1) * ROW_WIDTH ? (COL_NUMS - 1) * ROW_WIDTH : this.x;//边界检测
    } else if (key == "up") {
        this.y -= COL_HEIGHT;//向上的运动外部会进行是否判断达到victory标准 所以不需要做边界检测了
    } else if (key == "down") {
        this.y += COL_HEIGHT;
        this.y = this.y > 5 * COL_HEIGHT ? (ROW_NUMS - 1) * COL_HEIGHT : this.y;//边界检测
    }
}

/**
 * 可以绘制的文本对象  包含了需要绘制的文本的各种属性
 * @param {string} text 需要绘制的文本
 * @param {number} x 文本绘制的x坐标
 * @param {number} y 文本绘制的y坐标
 * @param {string} textColor 文本颜色
 * @param {number} strokeWidth 文本描边宽度
 * @param {string} strokeStyle 文本描边style
 * @param {string} font 字体
 * @param {string} textAlign 文本居中方式
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

/**
 * 角色选择器  最多会显示三个角色供用户选择
 * @param {number} heightOffset 
 * @param {Array} roles 
 */
const RoleChooser = function(heightOffset = 260, roles) {
    this.currentSelectPosition = 0;//当前选择的角色在roles中的位置
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

    if (this.roles.length > 1) {//可以绘制两个
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
    if (key == "right") {//将左边的待选项切换成当前待选项
        this.currentSelectPosition = (this.currentSelectPosition + this.roles.length - 1) % this.roles.length;
    } else if (key == "left") {//将右边的待选项切换成当前待选项
        this.currentSelectPosition = (this.currentSelectPosition + 1) % this.roles.length;
    } else if (key == "enter" || key == "space") {
        changeScene("game");
    }
}

/**
 * 三角形指示器
 */
const TriangleIndicator = function (heightOffset) {
    this.heightOffset = heightOffset;
    this.maxSize = 25;//最大边长 达到这个后开始缩小
    this.minSize = 20;//最小边长 达到这个后就开始放大
    this.size = 20;//三角形的边的长度
    this.direction = 0;//0表示处于变大状态 1表示处于缩小状态
}

TriangleIndicator.prototype.update = function (dt) {
    let offset = 10 * dt;//dt理解为缩放速度 offset就是这次需要修改的大小
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
    let orizontalOffset = Math.sin(30 * Math.PI / 180) * this.size;//相对三角形中心点的水平偏移量 用来计算三角形底部的两个顶点位置
    let verticalOffset = Math.cos(30 * Math.PI / 180) * this.size / 3;//三分之一三角形的高 中心点将三角形的高分成2：1
    ctx.moveTo(WINDOW_WIDTH/2, this.heightOffset - 2 * verticalOffset);//顶点位置的y值为中心点往上2倍verticalOffset的位置
    ctx.lineTo(WINDOW_WIDTH/2 - orizontalOffset, this.heightOffset + verticalOffset);
    ctx.lineTo(WINDOW_WIDTH/2 + orizontalOffset, this.heightOffset + verticalOffset);
    ctx.lineTo(WINDOW_WIDTH/2, this.heightOffset - 2 * verticalOffset);
    ctx.stroke();
    ctx.restore();
}
/**
 * 可收藏对象数据封装
 * @param {number} factor 分数因子 对应碰到player之后对分数的影响
 * @param {string} image 可收藏对象对应的图片
 */
const Collection = function (factor = 10, image = 'images/Gem Blue') {
    this.factor = factor;
    this.image = image;
}