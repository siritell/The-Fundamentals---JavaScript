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
  //ALEX Modal EVENT
  image.addEventListener("click", () => openImageModal(src));

  //Like button
  const likeButton = document.createElement("button");
  const imageBtnCont = document.createElement("div");
  imageBtnCont.classList.add("image-buttons");

  likeButton.innerHTML = "<img src='./src/icons/like.svg' alt='like-button'/>";
  likeButton.classList.add("like-comment-button");
  const likeCountNum = document.createElement("span");
  likeCountNum.classList.add("like-count");
  likeCountNum.textContent = String(initialLikes || 0);

  likeButton.addEventListener("click", async () => {
    try {
      await postLike(id);
      const current = parseInt(likeCountNum.textContent || "0", 10) || 0;
      likeCountNum.textContent = String(current + 1);
    } catch (e) {}
  });

  //Comment button
  const commentButton = document.createElement("button");
  let commenter_name = "Test";
  let comment = "Test comment";
  commentButton.innerHTML =
    "<img src='./src/icons/comment.svg' alt='comment-button' />";
  commentButton.classList.add("like-comment-button");
  commentButton.addEventListener("click", () =>
    postComment(id, commenter_name, comment)
  );
  imageBtnCont.appendChild(likeCountNum);
  imageBtnCont.appendChild(likeButton);
  imageBtnCont.appendChild(commentButton);
  card.appendChild(imageBtnCont);
  container.appendChild(card);
}

createImages();

// --- ALEX Modal creation ---
const modal = document.createElement("div");
modal.id = "image-modal";
modal.style.display = "none";
modal.innerHTML = `
  <div class="modal-backdrop"></div>
  <div class="modal-content">
    <img id="modal-image" src="" alt="Large View" />
  </div>
`;
document.body.appendChild(modal);

// ALEX Close modal when clicking backdrop
modal.querySelector(".modal-backdrop").addEventListener("click", () => {
  modal.style.display = "none";
});

// ALEX Close modal on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.style.display = "none";
});

// ALEX Function to open image modal
function openImageModal(src) {
  const modalImg = document.getElementById("modal-image");
  modalImg.src = src;
  modal.style.display = "flex";
}
