let  cacheFiles = [
    '/',
    'index.html',
    'restaurant.html',
    'css/styles.css',
    'css/small.css',
    'css/middle.css',
    'css/large.css',
    'data/restaurants.json',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg',
    
];

self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open('my-test-cahce-v1').then(function (cache) {
            return cache.addAll(cacheFiles);
        })
    );
});

// self.addEventListener('fetch', function (evt) {
//     evt.respondWith(
//         caches.match(evt.request).then(function(response) {
//             if (response) {
//                 return response;
//             }
//             var request = evt.request.clone();
//             return fetch(request).then(function (response) {
//                 if (!response && response.status !== 200 && !response.headers.get('Content-type').match(image)) {
//                     return response;
//                 }
//                 var responseClone = response.clone();
//                 caches.open('my-test-cache-v1').then(function (cache) {
//                     cache.put(evt.request, responseClone);
//                 });
//                 return response;
//             });
//         })
//     )
});