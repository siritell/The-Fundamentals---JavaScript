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

async function getImages() {
  const url = "https://image-feed-api.vercel.app/api/images";

  const dataImages = await getAllImages();

    //The data property is an array of images.
    for (const image of gallery) {
      createImage(image.image_url); //Create an image element for each image.
      console.log(image.image_url);
    }

    // for(let i = 0; 0 < data.length; i++);

    console.log(data);
  } catch {
    console.log("Error fetching images");
  }
}
const data = await getAllImages();

console.log(data);

// function likeImage() {
//     return { "success": true, "likes_count": 6 }
// }
