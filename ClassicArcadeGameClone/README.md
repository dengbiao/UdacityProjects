
前端纳米学位街机游戏克隆项目
===============================

学生应该用这个[评审标准](https://review.udacity.com/#!/rubrics/499/view))来自我检查自己提交的代码。 确认自己写的函数要是**面向对象的** -  要么是类函数（就像函数 Player 和 Enemy）要么是类的原型链上的函数比如 Enemy.prototype.checkCollisions ， 在类函数里面或者类的原型链函数里面适当的使用关键词 'this' 来引用调用该函数的对象实例。最后保证你的**readme.md**文件要写明关于如何运行和如何玩你的街机游戏的指引。

关于如何开始这个项目的更详细的指导，可以查阅这份[指南](https://gdgdocs.org/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true)。


===============================

## 1、运行环境配置
需要搭建一个本地的web服务器，然后设置项目路径为一个对应的web项目目录。
方法有很多，服务器选择也有很多，以下以基于Nodejs的http-server为例。

### Node
- Windows，Mac，Linux
- 需要 Node 和 npm（随 node 一起安装）

### 安装
在终端或命令行中输入 node --version。如果没有内容显示或显示错误，安装 Node。
输入 npm install -g http-server。
通过输入 http-server ~/Documents/mysite -p 8000 提供文件（将 ~/Documents/mysite 替换为你的项目目录的路径）
在你的浏览器中访问 http://localhost:8000，进行测试。

## 2、下载代码
>git clone https://github.com/dengbiao/UdacityProjects.git

在命令行中进入到UdacityProjects目录，比如`/Users/free/Documents/HtmlProject/ClassicArcadeGameClone`

然后在这个目录下执行 `http-server . -p 8080`

然后在浏览器中打开 `http://127.0.0.1:8080/`即可开始玩游戏。

## 3、Enjoy
第一个js游戏，可玩性很低，多多见谅。