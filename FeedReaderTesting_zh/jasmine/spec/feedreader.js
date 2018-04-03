/* feedreader.js
 *
 * 这是 Jasmine 会读取的spec文件，它包含所有的要在你应用上面运行的测试。
 */

/* 我们把所有的测试都放在了 $() 函数里面。因为有些测试需要 DOM 元素。
 * 我们得保证在 DOM 准备好之前他们不会被运行。
 */
$(function() {
    
    describe('RSS Feeds', function() {
        /* 判断allFeeds是否定义，而且有内容。
        */
        it('should be defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /** 
         * 遍历 allFeeds 对象里面的所有的源来保证有链接字段而且链接不是空的。
         */
        it('should have url field and not null', function() {
            allFeeds.forEach(feed => {
                expect(feed.url).toBeDefined();
                expect(feed.url).not.toBeNull();
            });
        });


        /** 
         * 遍历 allFeeds 对象里面的所有的源来保证有名字字段而且不是空的。
         */
        it('should have name field and not null', function() {
            allFeeds.forEach(feed => {
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toBeNull();
            });
        });
    });

    /**
     * 测试左侧侧滑菜单相关
     */
    describe('The menu', function () {
        let body, menuIcon;

        beforeEach (function () {//把变量存起来 省的每次都去定位
            body = $('body');
            menuIcon = $('.menu-icon-link');
        });

        /** 
         * 检查菜单元素默认是不是隐藏的。
         */
        it('should be hidden by default', function () {
            let hasHideClass = body.hasClass("menu-hidden");
            expect(hasHideClass).toBe(true);
        });


         /**
          * 保证当菜单图标被点击的时候菜单会切换可见状态。
          * 包括：点击图标的时候菜单是否显示，再次点击的时候是否隐藏。
          */
        it('should be correct while switch status by click', function () {
            menuIcon.click();
            let hasHideClass = body.hasClass("menu-hidden");
            expect(hasHideClass).toBeFalsy();

            menuIcon.click();
            hasHideClass = body.hasClass("menu-hidden");
            expect(hasHideClass).toBeTruthy();

        });

        afterEach(function () {
            body = null;
            menuIcon = null;
        });

    });



    /* 检测数据相关 */
    describe('Initial Entries', function () {
        let loadFeedFun = jasmine.createSpy().and.callFake(loadFeed);

         beforeEach(function (done) {
            //异步调用loadFeed
            loadFeedFun(0, function() {
                done();
            });
         });


        /**
         * 保证 loadFeed 函数被调用而且工作正常，即在 .feed 容器元素
         * 里面至少有一个 .entry 的元素。
         */
        it('method loadFeed() should been called and work correct', function (done) {
            expect(loadFeedFun).toHaveBeenCalled();//直接用loadFeed会报错，说需要spy，但是找到function

            let entryCount = $('.feed').children().length;
            expect(entryCount).toBeGreaterThan(0);

            done();

        });

    });
        

    /* 检查请求刷新feeds */
    describe('New Feed Selection', function () {
        let firstContent, secondContent;//分别保存第一次请求和第二次请求的内容 然后最对比
        let loadFeedFun = jasmine.createSpy().and.callFake(loadFeed);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;//不然会超时，放到beforeEach里面还是会偶现超时 放到外面就不会了，奇怪

        beforeEach(function(done) {
            loadFeed(0, function() {
                firstContent = $('.feed').html();//第一次请求到的feeds内容
                loadFeed(1, function() {
                    secondContent = $('.feed').html();//第二次请求到的feeds内容
                    done();
                });
            });
        });


        /* 
         * 检查loadFeed 函数加载一个新源的时候内容会真的改变。
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
            }).toThrowError("id is undefined");
        });

        it('should throw arrayIndexOutOfBound exception', function() {
            expect(function() {
                loadFeed(-1);
            }).toThrowError("ArrayIndexOutOfBound Exception");
        })
    });
}());
