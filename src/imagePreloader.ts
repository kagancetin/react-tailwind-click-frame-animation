/**
 * Global in-memory image cache ensuring preloaded images are retained in memory
 * and never garbage-collected by the JavaScript engine before network download completes.
 */
const globalImageCache = new Map<string, HTMLImageElement>();

/**
 * Preloads a single image and keeps it in persistent memory.
 */
export function preloadImage(src: string): Promise<void> {
  if (!src || typeof window === "undefined") {
    return Promise.resolve();
  }

  const existing = globalImageCache.get(src);
  if (existing) {
    if (existing.complete) return Promise.resolve();
    return new Promise((resolve) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
    });
  }

  const img = new Image();
  // Retain strong reference in Map so V8 GC never cancels in-flight requests
  globalImageCache.set(src, img);

  return new Promise((resolve) => {
    img.onload = () => {
      // Decode image asynchronously to eliminate main-thread stutter on first paint
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

/**
 * Preloads a collection of image URLs in parallel.
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  if (!urls || urls.length === 0) return Promise.resolve([]);
  return Promise.all(urls.map(preloadImage));
}

/**
 * Check whether an image has completed loading into browser memory.
 */
export function isImageLoaded(src: string): boolean {
  const img = globalImageCache.get(src);
  return Boolean(img && img.complete);
}
