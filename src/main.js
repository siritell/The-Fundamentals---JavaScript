import "./reset.css";
import "./style.css";
import { getAllImages, postComment, postLike, getOneImage } from "./api.js";

const container = document.getElementById("gallery-container");
async function createImages() {
  const gallery = await getAllImages();

  console.log(gallery);

  for (const image of gallery) {
    createImage(image.image_url, image.id, image.likes_count || 0);
    //Create an image element for each image.
    console.log(image.image_url);
  }
}

function createImage(src, id, initialLikes) {
  const card = document.createElement("div");
  card.classList.add("gallery-item");

  const image = document.createElement("img");
  image.src = src;
  image.classList.add("article-image");
  card.appendChild(image);

  const likeButton = document.createElement("button");
  const imageBtnCont = document.createElement("div");
  imageBtnCont.classList.add("image-buttons");

  likeButton.innerHTML = "<img src='./src/icons/like.svg' alt='like-button'/>";
  likeButton.classList.add("like-comment-button");
  const likeCountEl = document.createElement("span");
  likeCountEl.classList.add("like-count");
  likeCountEl.textContent = String(initialLikes || 0);

  likeButton.addEventListener("click", async () => {
    try {
      await postLike(id);
      const current = parseInt(likeCountEl.textContent || "0", 10) || 0;
      likeCountEl.textContent = String(current + 1);
    } catch (e) {
      // noop: keep UI unchanged on failure
    }
  });

  const commentButton = document.createElement("button");
  let commenter_name = "Test";
  let comment = "Test comment";
  commentButton.innerHTML =
    "<img src='./src/icons/comment.svg' alt='comment-button' />";
  commentButton.classList.add("like-comment-button");
  commentButton.addEventListener("click", () =>
    postComment(id, commenter_name, comment)
  );
  imageBtnCont.appendChild(likeButton);
  imageBtnCont.appendChild(likeCountEl);
  imageBtnCont.appendChild(commentButton);
  card.appendChild(imageBtnCont);
  container.appendChild(card);
}

createImages();
