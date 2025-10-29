import "./style.css";
import { getAllImages } from "./api.js";
import { getOneImage } from "./api.js";

const container = document.getElementById("app");

function createImage(src) {
  const card = document.createElement("div");
  card.classList.add("article-card");

  const image = document.createElement("img");
  image.src = src;
  image.classList.add("article-image");

  card.appendChild(image);
  container.appendChild(card);
}

async function createImages() {
  const gallery = await getAllImages()

  console.log(gallery)


    for (const image of gallery) {
      createImage(image.image_url); //Create an image element for each image.
      console.log(image.image_url);
    }
  }

 createImages()