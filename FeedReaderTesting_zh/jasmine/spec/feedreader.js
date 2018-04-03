/* feedreader.js
 *
 * 这是 Jasmine 会读取的spec文件，它包含所有的要在你应用上面运行的测试。
 */

/* 我们把所有的测试都放在了 $() 函数里面。因为有些测试需要 DOM 元素。
 * 我们得保证在 DOM 准备好之前他们不会被运行。
 */
$(function() {
    /* 这是我们第一个测试用例 - 其中包含了一定数量的测试。这个用例的测试
     * 都是关于 Rss 源的定义的，也就是应用中的 allFeeds 变量。
    */
    describe('RSS Feeds', function() {
        /* 这是我们的第一个测试 - 它用来保证 allFeeds 变量被定义了而且
         * 不是空的。在你开始做这个项目剩下的工作之前最好实验一下这个测试
         * 比如你把 app.js 里面的 allFeeds 变量变成一个空的数组然后刷新
         * 页面看看会发生什么。
        */
        it('should be defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有链接字段而且链接不是空的。
         */
        it('should have url field and not null', function() {
            allFeeds.forEach(feed => {
                expect(feed.url).toBeDefined();
                expect(feed.url).not.toBeNull();
            });
        });


        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有名字字段而且不是空的。
         */
        it('should have name field and not null', function() {
            allFeeds.forEach(feed => {
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toBeNull();
            });
        });
    });


    /* TODO: 写一个叫做 "The menu" 的测试用例 */

    describe('The menu', function () {

        /* TODO:
         * 写一个测试用例保证菜单元素默认是隐藏的。你需要分析 html 和 css
         * 来搞清楚我们是怎么实现隐藏/展示菜单元素的。
         */
        it('should be hidden by default', function () {
            let hasHideClass = $('body').hasClass("menu-hidden");
            expect(hasHideClass).toBe(true);
        });


         /* TODO:
          * 写一个测试用例保证当菜单图标被点击的时候菜单会切换可见状态。这个
          * 测试应该包含两个 expectation ： 党点击图标的时候菜单是否显示，
          * 再次点击的时候是否隐藏。
          */
        it('should be correct while switch status by click', function () {

            let menuIcon = $('.menu-icon-link');

            menuIcon.click();
            let hasHideClass = $('body').hasClass("menu-hidden");
            expect(hasHideClass).toBe(false);

            menuIcon.click();
            hasHideClass = $('body').hasClass("menu-hidden");
            expect(hasHideClass).toBe(true);

        });

    });



    /* TODO: 13. 写一个叫做 "Initial Entries" 的测试用例 */
    describe('Initial Entries', function () {
        /* TODO:
         * 写一个测试保证 loadFeed 函数被调用而且工作正常，即在 .feed 容器元素
         * 里面至少有一个 .entry 的元素。
         * 
         *
         * 记住 loadFeed() 函数是异步的所以这个而是应该使用 Jasmine 的 beforeEach
         * 和异步的 done() 函数。
         */

        let loadFeedFun = jasmine.createSpy().and.callFake(loadFeed);

         beforeEach(function (done) {

            loadFeedFun(0, function() {
                done();
            });
         });

        it('method loadFeed() should been called and work correct', function (done) {
            expect(loadFeedFun).toHaveBeenCalled();

            let entryCount = $('.feed').children().length;
            expect(entryCount).toBeGreaterThan(0);

            done();

        });

    });
        

    /* TODO: 写一个叫做 "New Feed Selection" 的测试用例 */

    xdescribe('New Feed Selection', function () {
        let firstContent, secondContent;
        let loadFeedFun = jasmine.createSpy().and.callFake(loadFeed);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

        beforeEach(function(done) {
            loadFeed(0, function() {
                firstContent = $('.feed').html();
                loadFeed(1, function() {
                    secondContent = $('.feed').html();
                    done();
                });
            });
        });


        /* TODO:
         * 写一个测试保证当用 loadFeed 函数加载一个新源的时候内容会真的改变。
         * 记住，loadFeed() 函数是异步的。
         */
        it('content should be changed after the function loadFeed be called', function (done) {
            expect(firstContent).not.toEqual(secondContent);
            done();
        });
    });

    /**
     * 检查项目第19条规则，19. 实现未定义变量和数组越界的错误处理。
     * 调用loadFeed函数，不传入id，或者传入-1（越界）
     */
    describe('Check abnormal args', function() {
        it('should throw undifined error', function() {
            expect(function() {
                loadFeed();
            }).toThrowError("Cannot read property 'url' of undefined");
        });

        it('should throw arrayIndexOutOfBound exception', function() {
            expect(function() {
                loadFeed(-1);
            }).toThrowError("Cannot read property 'url' of undefined");
        })
    });
}());
