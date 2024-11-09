const cacheName = "v1";
const cacheFiles = [
    "/index.html",
    "/assets/css/style.css",
    "/assets/js/main.js",
    "/assets/js/scrollreveal.min.js",
    "/assets/img/logo.png",
    "/assets/img/mockup1.png",
    "/assets/img/mockup2.png",
    "/assets/img/mockup3.png",
    "/assets/img/mockup4.png",
    "/assets/img/mockup5.png",
    "/assets/img/mockup6.png",
    "/assets/img/mockup7.png",
    "/assets/img/mockup8.png",
    "/assets/img/mockup9.png",
    "/assets/img/icon-192x192.png",
    "/assets/img/icon-512x512.png",
    "/manifest.json",
];

// Event 'install': caching resources
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                cache.addAll(cacheFiles);
            })
    );
});

// Event 'activate': cleaning up old caches
self.addEventListener("activate", (event) => {
    const cacheAllowlist = [cacheName]; // Only allow current cache

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (!cacheAllowlist.includes(name)) {
                        console.log(`Deleting old cache: ${name}`);
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

// Event 'fetch': serve cached files or fallback to network
self.addEventListener('fetch',(event)=>{
    event.respondWith(caches.open(cacheName).then((cache)=>{
        return fetch(event.request.url).then((fetchResponse)=>{
            cache.put(event.request, fetchResponse.clone());

            return fetchResponse;
        }).catch(()=>{
            return cache.match(event.request.url);
        });
    }));

});

