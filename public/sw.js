/* global self, caches */
self.addEventListener('install', function (event) {
  event.waitUntil(preLoad())
})

const preLoad = function () {
  return caches.open('offline').then(function (cache) {
    return cache.addAll(['/', '/offline.html'])
  })
}

self.addEventListener('fetch', function (event) {
  event.respondWith(checkResponse(event.request).catch(function () {
    return returnFromCache(event.request)
  }))
  event.waitUntil(addToCache(event.request))
})

const checkResponse = function (request) {
  return new Promise(function (resolve, reject) {
    fetch(request).then(function (response) {
      if (response.status !== 404) {
        resolve(response)
      } else {
        reject(new Error('404 - Not Found'))
      }
    }, reject)
  })
}

const addToCache = function (request) {
  return caches.open('offline').then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response)
    })
  })
}

const returnFromCache = function (request) {
  return caches.open('offline').then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return cache.match('offline.html')
      } else {
        return matching
      }
    })
  })
}
