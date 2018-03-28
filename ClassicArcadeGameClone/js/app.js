//所有的敌人集合
const allEnemies = [];
let score = 0;//玩家分数
let time = 0;//玩家游戏时长 单位秒
const allCollection = [];//屏幕上出现的可供玩家收集的对象列表 可以加分

//初始化敌人列表
for (let i = 0; i<MAX_ENEMY_COUNT; i++) {
    let enemy = new Enemy();
    allEnemies.push(enemy);
}

//随机出现的可收藏对象列表  一定概率的产生其中一个 然后出现在游戏中
const collections = [
    new Collection(5, 'images/Star.png'),
    new Collection(10, 'images/Heart.png'),
    new Collection(10, 'images/Key.png'),
    new Collection(20, 'images/Gem Blue.png'),
    new Collection(20, 'images/Gem Orange.png'),
    new Collection(20, 'images/Gem Green.png')
];

//玩家对象
const player = new Player();

//所有场景的集合
const allScenes = new Map();

//游戏背景图 控制背景图绘制 所有场景都包含它
const backSprite = new BackSprite();

//游戏刚进来的时候的初始化场景
const gameNameSprite = new TextSprite("Classic Arcade Game Clone", WINDOW_WIDTH/2, 170, "black", 0, "white", 'bold 14pt "Press Start 2P", cursive');
const gameTipsSprite = new TextSprite("Please choose role", WINDOW_WIDTH/2, 250, "black", 0, "white", 'bold 18pt Calibri');
const roleChooser = new RoleChooser();
const triangleIndicator = new TriangleIndicator(455);
const gameTipsToStartSprite = new TextSprite("Press enter or space to start game.", WINDOW_WIDTH/2, 500, "black", 0, "white", "normal 12pt Calibri");

const initScene = new Scene("init", [backSprite, gameNameSprite, gameTipsSprite, roleChooser, triangleIndicator, gameTipsToStartSprite]);
allScenes.set("init", initScene);

//游戏场景 包含背景 敌人 玩家
const timeTipsSprite = new TextSprite(`Time:  ${time}`, 20, 90, "black", 0, "", 'bold 10pt "Press Start 2P", cursive', "left");
const scoreTipsSprite = new TextSprite(`Score: ${score}`, 20, 120, "black", 0, "", 'bold 10pt "Press Start 2P", cursive', "left");
const gameSprites = [backSprite, allCollection, allEnemies, player, timeTipsSprite, scoreTipsSprite];
const gameScene = new Scene("game", gameSprites);
allScenes.set("game", gameScene);


//胜利场景 包含背景 结束提示信息 
//还包含了游戏场景的对象集合gameSprites作为背景图 让运动的对象都停下来  这样就能停留在游戏的最后一帧  其实也可以考虑整体截图 就不需要每次都绘制那么多对象了
const victoryTitleTipsSprite = new TextSprite("Victory", WINDOW_WIDTH/2, 170, "white", 0, "white", 'bold 40pt "Press Start 2P", cursive');
const finalScoreTipsSprite = new TextSprite("Score:200", WINDOW_WIDTH/2, 300, "black", 0, "blue", 'bold 18pt "Press Start 2P", cursive');
const restartTipsSprite = new TextSprite("Press enter or space to reStart game.", WINDOW_WIDTH/2, 500, "black", 0, "white", "normal 12pt Calibri");

const victoryScene = new Scene("victory", [...gameSprites, victoryTitleTipsSprite, finalScoreTipsSprite, restartTipsSprite]);
allScenes.set("victory", victoryScene);

//当前场景  刚开始为初始化场景
let currentScene;
changeScene("init");


//玩家类监听按键 处理按键事件在player对象的handleInput中
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        13: 'enter',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    switch(currentScene.name) {
        case "init":
            roleChooser.handleInput(allowedKeys[e.keyCode]);
        break;
        case "game":
            player.handleInput(allowedKeys[e.keyCode]);
        break;
        case "victory":
            handleInput(allowedKeys[e.keyCode]);
        break;
    }
});

/**
 * 按键处理
 * @param {string} key 
 */
function handleInput(key) {
    if (key == "enter" || key == "space") {
        if (currentScene.name == "victory") {
            reset();
        }
    }
}

function changeScene(name) {
    switch(name) {
        case "init":
        break;
        case "game":
            initData();
        break;
        case "victory":
        break;
    }

    currentScene = allScenes.get(name);

}

/**
 * 初始化数据  切换到游戏场景的时候调用
 */
function initData() {
    player.sprite = roleChooser.roles[roleChooser.currentSelectPosition];//使用当前选中角色
    allEnemies.forEach(function(enemy) {
        enemy.isActive = true;
    });
}

/**
 * 重置游戏数据
 */
function reset() {
    changeScene("init");//切换到欢迎场景
    player.reset();
    allEnemies.forEach(function(enemy) {
        enemy.reset();
    });
    time = 0;
    score = 0;
    allCollection.splice(0, allCollection.length);
}

/**
 * 刷新数据接口  每个系统循环周期都会调用
 * @param {number} dt 
 */
function refreshData(dt) {
    switch(currentScene.name) {
        case "game":
            time += dt;
            timeTipsSprite.text =  `Time : ${Math.ceil(time)}`;
            scoreTipsSprite.text = `Score: ${Math.ceil(score)}`;
            produceCollection();
            if (player.y === 0) {
                //获胜
                //赋值最终成绩
                finalScoreTipsSprite.text = `Score: ${Math.ceil(score)}`;
                //停下所有运动对象
                [...allEnemies, ...allCollection].forEach(element =>
                    {
                        element.isActive = false;
                    }
                );
                //切换到胜利场景
                currentScene = allScenes.get('victory');
            }
        break;
    }
}

/**
 *  产生一个收藏对象
 */
function produceCollection() {
    let num = Math.round(Math.random() * 1000);
    if (num > 990) {//对应产生的概率
        //产生一个收藏
        let index = Math.round(Math.random() * (collections.length-1));
        let collection = collections[index];

        //随机个x,y坐标
        let x = Math.round(Math.random()*5) * ROW_WIDTH;
        let y = (Math.round(Math.random()*2) + 1) * COL_HEIGHT;
        let collectionSprite = new Enemy(collection.image, x, y, collection.factor, 0, false, 0.5);//所有收藏的图片都缩小一半来绘制 显得精致一点
        //添加到收藏列表
        allCollection.push(collectionSprite);
    }
}

/**
 * 冲突检测
 */
function collisonDetect() {
    //检测所有敌人和收藏对象
    [...allEnemies, ... allCollection].forEach(function(enemy) {
        let centerX = player.x + ROW_WIDTH/2;
        let centerY = player.y + COL_HEIGHT/2;
        if ((centerX > enemy.x && centerX < enemy.x + ROW_WIDTH)
            && (centerY > enemy.y && centerY < enemy.y + COL_HEIGHT)) {
                score += enemy.factor;
                if (enemy.factor > 0) {
                    //不是敌人 是收藏
                    //收藏消失 玩家不动
                    let index = allCollection.indexOf(enemy);
                    if (index > -1) {
                        allCollection.splice(index, 1);
                    }
                } else {
                    //遇到敌人 要还原player到原始位置
                    player.reset();
                }
        }
    });
}