const container = document.getElementById('app');

function createImage(src) {
  const image = document.createElement('img');
  image.src = src;
  container.appendChild(image);
}

function init() {
  fetch('https://image-feed-api.vercel.app/api/images/e8cd3ffd-794c-4ec6-b375-7788dbb14275')
  .then(resp => resp.json())
  .then(json => createImage(json.image_url))
}

init();