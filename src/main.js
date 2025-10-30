import "./reset.css";
import "./style.css";
import { getAllImages, postComment, postLike, getOneImage } from "./api.js";

const container = document.getElementById("gallery-container");

function createImage(src, id) {
  const card = document.createElement("div");
  card.classList.add("gallery-item");

  const image = document.createElement("img");
  image.src = src;
  image.classList.add("article-image");
  card.appendChild(image);

  const likeButton = document.createElement("button");
  const imageBtnCont = document.createElement("div");
  imageBtnCont.classList.add("image-buttons");

  likeButton.innerHTML = "<img src='./src/icons/like.svg' alt='like-button' />";
  likeButton.classList.add("like-comment-button");
  likeButton.addEventListener("click", () => postLike(id));

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
  imageBtnCont.appendChild(commentButton);
  card.appendChild(imageBtnCont);
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

/* Alex >>>> MODAL FUNCTIONS
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

function openModal(src) {
  modalImg.src = src;
  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

