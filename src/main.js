import "./reset.css";
import "./style.css";
import { getAllImages, postComment, postLike, getOneImage } from "./api.js";

const container = document.getElementById("gallery-container");
async function createImages() {
  const gallery = await getAllImages();

  console.log(gallery);

  for (const image of gallery) {
    createImage(
      image.image_url,
      image.id,
      image.likes_count || 0,
      image.comments_count || 0
    );
    //Create an image element for each image.
    console.log(image.image_url);
  }
}

function createImage(src, id, initialLikes, initialComments) {
  const card = document.createElement("div");
  card.classList.add("gallery-item");

  const image = document.createElement("img");
  image.src = src;
  image.classList.add("article-image");
  card.appendChild(image);

  //ALEX Modal EVENT Save all gallery images for modal navigation
  galleryImages.push({ image_url: src, id });

  // ALEX Click image -> open modal w/ correct index
  image.addEventListener("click", () => {
    const index = galleryImages.findIndex((img) => img.id === id);
    openImageModal(index, id);
  });

  //Laura: Create Like button
  const likeButton = document.createElement("button");
  const imageBtnCont = document.createElement("div");
  imageBtnCont.classList.add("image-buttons");
  likeButton.classList.add("like-comment-button");

  //Laura: Create like count number inside like button(on the left side of the button)
  const likeCountNum = document.createElement("span");
  likeCountNum.classList.add("like-count");
  likeCountNum.textContent = String(initialLikes || 0);
  likeButton.appendChild(likeCountNum);

  //Laura: Create like icon inside like button(on the right side of the button)
  const likeIcon = document.createElement("img");
  likeIcon.src = "./src/icons/like.svg";
  likeIcon.alt = "like-icon";
  likeIcon.classList.add("like-icon");
  likeButton.appendChild(likeIcon);

  //Laura: Add event listener to like button to show the like count number.
  likeButton.addEventListener("click", async () => {
    try {
      await postLike(id);
      const current = parseInt(likeCountNum.textContent || "0", 10) || 0;
      likeCountNum.textContent = String(current + 1);
    } catch (e) {}
  });

  //Laura: Create Comment button
  const commentButton = document.createElement("button");
  commentButton.classList.add("like-comment-button");

  //Laura: Create comment count number inside comment button(on the left side of the button)
  const commentCountNum = document.createElement("span");
  commentCountNum.classList.add("comment-count");
  commentCountNum.textContent = String(initialComments || 0);
  commentButton.appendChild(commentCountNum);

  //Laura: Create comment icon inside comment button(on the right side of the button)
  const commentIcon = document.createElement("img");
  commentIcon.src = "./src/icons/comment.svg";
  commentIcon.alt = "comment-icon";
  commentIcon.classList.add("comment-icon");
  commentButton.appendChild(commentIcon);

  //Laura: Add event listener to comment button to post the comment and show the comment count number.
  const commenter_name = "Test";
  const comment = "Test comment";
  commentButton.addEventListener("click", async () => {
    try {
      await postComment(id, commenter_name, comment);
      const current = parseInt(commentCountNum.textContent || "0", 10) || 0;
      commentCountNum.textContent = String(current + 1);
    } catch (e) {}
  });

  // Append both buttons to the same container
  imageBtnCont.appendChild(likeButton);
  imageBtnCont.appendChild(commentButton);
  card.appendChild(imageBtnCont);
  container.appendChild(card);
}

createImages();

// ===== ALEX Modal Setup =====
let currentImageIndex = 0;
let galleryImages = [];

const modal = document.createElement("div");
modal.id = "image-modal";
modal.style.display = "none";
modal.innerHTML = `
  <div class="modal-backdrop"></div>
  <div class="modal-content fade-in">
    <button id="modal-close" class="modal-close">×</button>
    <button id="modal-prev" class="modal-nav prev">‹</button>
    <img id="modal-image" src="" alt="Large View" />
    <button id="modal-next" class="modal-nav next">›</button>
    <div id="modal-comments" class="modal-comments"></div>
  </div>
`;
document.body.appendChild(modal);

// ALEX Elements MOdal
const modalImg = document.getElementById("modal-image");
const modalComments = document.getElementById("modal-comments");
const btnPrev = document.getElementById("modal-prev");
const btnNext = document.getElementById("modal-next");
const btnClose = document.getElementById("modal-close");

async function openImageModal(index, id) {
  currentImageIndex = index;
  modal.style.display = "flex";
  modalImg.classList.remove("zoomed"); // reset zoom

  const imageObj = galleryImages[index];
  modalImg.src = imageObj.image_url;

  // ALEX Load comments for this image
  const data = await getOneImage(id);
  modalComments.innerHTML = `<h3>Comments</h3>
    ${
      data.comments
        .map((c) => `<p><b>${c.commenter_name}:</b> ${c.comment}</p>`)
        .join("") || "<p>No comments yet.</p>"
    }
  `;
}

// ALEX Navigation modal
btnPrev.addEventListener("click", () => {
  currentImageIndex =
    (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  const img = galleryImages[currentImageIndex];
  openImageModal(currentImageIndex, img.id);
});

btnNext.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  const img = galleryImages[currentImageIndex];
  openImageModal(currentImageIndex, img.id);
});

// ALEX Close modal
btnClose.addEventListener("click", () => (modal.style.display = "none"));
modal
  .querySelector(".modal-backdrop")
  .addEventListener("click", () => (modal.style.display = "none"));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.style.display = "none";
  if (e.key === "ArrowRight") btnNext.click();
  if (e.key === "ArrowLeft") btnPrev.click();
});

// ALEX Zoom on click
modalImg.addEventListener("click", () => {
  modalImg.classList.toggle("zoomed");
});
