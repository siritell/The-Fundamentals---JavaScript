import "./reset.css";
import "./style.css";
import { getAllImages, postComment, postLike, getOneImage, getAllPages } from "./api.js";

const container = document.getElementById("gallery-container");

/* ALEX modal elements + function */
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
/* ALEX END OF MODAL CODE */

function createImage(src, id) {
  const card = document.createElement("div");
  card.classList.add("gallery-item");

  const image = document.createElement("img");
  image.src = src;
  image.classList.add("article-image");

  /* ALEX open modal on image click */
  image.addEventListener("click", () => openModal(src));

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

const statsImages = async () => {
  let totalImages = 0;

  // Get total pages
  const totalPages = await getAllPages()

  // Get number of images in page

  // Loop through all pages and add to totalImages
  for(let page = 1; page <= totalPages; page++ ) {
    const imagesOnPage = await getAllImages(page)
    totalImages += imagesOnPage.length;
  }
  return totalImages;
}

statsImages()
createImages();