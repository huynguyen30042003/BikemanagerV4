// Bike Manager V4 - Progressive Web App Service Worker
const CACHE_VERSION = "bike-manager-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

const PRECACHE_ASSETS = [
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
  "/logo.png",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Precache partially failed:", err);
      });
    }),
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith("bike-manager-") && key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key)),
      );
    }),
  );
  return self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Chỉ xử lý các yêu cầu GET
  if (request.method !== "GET") {
    return;
  }

  // 2. Không can thiệp vào các API routes hoặc backend server (để đảm bảo dữ liệu đơn hàng, kho xe luôn real-time)
  if (
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("api.nhithoi.io.vn") ||
    url.protocol.startsWith("chrome-extension")
  ) {
    return;
  }

  // 3. Navigation requests (Truy cập trang HTML) -> Network First, fallback to cached page or offline.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Lưu bản sao trang vừa xem vào dynamic cache
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Khi offline, thử lấy trang từ cache
          const cachedPage = await caches.match(request);
          if (cachedPage) {
            return cachedPage;
          }
          // Nếu trang chưa từng được cache, trả về trang offline.html
          const offlinePage = await caches.match("/offline.html");
          if (offlinePage) {
            return offlinePage;
          }
          return new Response("Bạn đang ở chế độ ngoại tuyến.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }),
    );
    return;
  }

  // 4. Static Assets (Scripts, CSS, Images, Icons, Fonts) -> Cache First, fallback to Network
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".woff2");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Không tải được asset tĩnh
            return new Response("", { status: 408 });
          });
      }),
    );
    return;
  }
});

// Lắng nghe sự kiện thông báo cập nhật PWA từ UI
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

