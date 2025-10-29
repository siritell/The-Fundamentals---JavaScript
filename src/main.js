import "./reset.css";
import "./style.css";
import { getAllImages } from "./api.js";
import { getOneImage } from "./api.js";



async function createImages(pageNumber) {
  const gallery = await getAllImages(pageNumber);
  const container = document.getElementById("gallery-container");
  
  for (const image of gallery) {
    const galleryItem = document.createElement("div")
    galleryItem.classList.add("gallery-item");
    container.appendChild(galleryItem)
    galleryItem.style.backgroundImage = `url(${image.image_url})`;
    galleryItem.innerHTML = `
        <div class="image-buttons">
          <button class="like-comment-button">Like</button>
          <button class="like-comment-button">Comment</button>
        </div>
      `
    
  }
}

function init() {
   createImages()
}

init()