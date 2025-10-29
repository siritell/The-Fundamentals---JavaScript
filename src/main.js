import "./style.css";
import { getAllImages, postComment, postLike, getOneImage } from "./api.js";

const container = document.getElementById("app");

function createImage(imageurl, id) {
  const card = document.createElement("div");
  card.classList.add("article-card");

  const image = document.createElement("img");
  image.src = imageurl;
  image.classList.add("article-image");
  card.appendChild(image);

  const likeButton = document.createElement("button");

  likeButton.textContent = "Like 👍";
  likeButton.classList.add("overlay-button");
  likeButton.addEventListener("click", () => postLike(id)); // which function to call.. which type of event
  card.appendChild(likeButton);

  const commentButton = document.createElement("button");
  let commenter_name = "Test";
  let comment = "Test comment";
  commentButton.textContent = "Comment";
  commentButton.classList.add("overlay-button");
  commentButton.addEventListener("click", () =>
    postComment(id, commenter_name, comment)
  );
  card.appendChild(commentButton);

  container.appendChild(card);
}

async function createImages() {
  const gallery = await getAllImages();

  console.log(gallery);

  for (const image of gallery) {
    createImage(image.image_url, image.id);
    //Create an image element for each image.
    console.log(image.image_url);
  }
}

createImages();
