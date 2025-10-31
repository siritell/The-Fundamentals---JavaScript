import "./reset.css";
import "./style.css";
import { getAllImages, postComment, postLike, getOneImage, getAllPages } from "./api.js";
import { updateStats, createTotalLikes, createTotalComments, createTotalImages } from "./stats.js";
import { createTopLikes } from "./top-likes.js";

const container = document.getElementById("gallery-container");

// ===== ALEX Modal Setup =====

async function createImages() {
  const gallery = await getAllImages();

  for (const image of gallery) {
    createImage(
      image.image_url,
      image.id,
      image.likes_count || 0,
      image.comments_count || 0
    );

    console.log(image.image_url);
  }
}

function createImage(src, id, initialLikes, initialComments) {
  const card = document.createElement("div");
  card.classList.add("gallery-item");
  card.setAttribute("data-image-id", id);

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

  //Solid heart icon when liked
  const solidHeartIcon = document.createElement("img");
  solidHeartIcon.src = "./src/icons/like-filled.svg";
  solidHeartIcon.alt = "solid-heart-icon";
  solidHeartIcon.classList.add("solid-heart-icon");
  likeButton.appendChild(solidHeartIcon);
  solidHeartIcon.style.display = "none";

  //Laura: Add event listener to like button to show the like count number.
  // Change to solid heart icon when clicked
  let isLiked = false;
  likeButton.addEventListener("click", async () => {
    isLiked = !isLiked;

    // Show/hide icons based on like state
    if (isLiked) {
      solidHeartIcon.style.display = "block";
      likeIcon.style.display = "none";
      try {
        await postLike(id);
        const current = parseInt(likeCountNum.textContent || "0", 10) || 0;
        likeCountNum.textContent = String(current + 1);
      } catch (e) {}
    } else if (!isLiked) {
      const current = parseInt(likeCountNum.textContent || "0", 10) || 0;
      likeCountNum.textContent = String(current - 1);

      solidHeartIcon.style.display = "none";
      likeIcon.style.display = "block";
    }
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

  //Laura: Add event listener to comment button to open modal with enlarged image and comments.
  commentButton.addEventListener("click", () => {
    // Open modal with enlarged image and show comments section
    const index = galleryImages.findIndex((img) => img.id === id);
    openImageModal(index, id);
  });

  // Append both buttons to the same container
  imageBtnCont.appendChild(likeButton);
  imageBtnCont.appendChild(commentButton);
  card.appendChild(imageBtnCont);
  container.appendChild(card);
}

// ===== ALEX Modal Setup =====
let currentImageIndex = 0;
let galleryImages = [];
let currentImageId = null;

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
    <form id="comment-form" class="comment-form">
      <input type="text" id="commenter-name" placeholder="Your name" required />
      <textarea id="comment-text" placeholder="Write a comment..." rows="3" required></textarea>
      <button type="submit">Post Comment</button>
    </form>
  </div>
`;
document.body.appendChild(modal);

// ALEX Elements Modal
const modalImg = document.getElementById("modal-image");
const modalComments = document.getElementById("modal-comments");
const btnPrev = document.getElementById("modal-prev");
const btnNext = document.getElementById("modal-next");
const btnClose = document.getElementById("modal-close");
const commentForm = document.getElementById("comment-form");
const commenterNameInput = document.getElementById("commenter-name");
const commentTextInput = document.getElementById("comment-text");

async function openImageModal(index, id) {
  currentImageIndex = index;
  currentImageId = id;
  modal.style.display = "flex";
  modalImg.classList.remove("zoomed"); // reset zoom

  const imageObj = galleryImages[index];
  modalImg.src = imageObj.image_url;

  // Reset form
  commenterNameInput.value = "";
  commentTextInput.value = "";

  // ALEX Load comments for this image
  await loadComments(id);
}

async function loadComments(id) {
  const data = await getOneImage(id);
  const commentsHTML =
    data.comments && data.comments.length > 0
      ? data.comments
          .map((c) => `<p><b>${c.commenter_name}:</b> ${c.comment}</p>`)
          .join("")
      : "<p>No comments yet.</p>";

  modalComments.innerHTML = `<h3>Comments</h3>${commentsHTML}`;
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

// Laura: comment section with user name and comment text area.
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentImageId) return;

  const commenter_name = commenterNameInput.value.trim();
  const comment = commentTextInput.value.trim();

  if (!commenter_name || !comment) {
    alert("Please fill in both name and comment fields.");
    return;
  }

  try {
    await postComment(currentImageId, commenter_name, comment);

    // Reload comments to show the new one
    await loadComments(currentImageId);

    // Clear form
    commenterNameInput.value = "";
    commentTextInput.value = "";

    // Show comment count number
    const currentCard = document.querySelector(
      `[data-image-id="${currentImageId}"]`
    );
    if (currentCard) {
      const commentCountEl = currentCard.querySelector(".comment-count");
      if (commentCountEl) {
        const current = parseInt(commentCountEl.textContent || "0", 10) || 0;
        commentCountEl.textContent = String(current + 1);
      }
    }
  } catch (error) {
    console.error("Error posting comment:", error);
    alert("Failed to post comment. Please try again.");
  }
});

createImages();
updateStats()
createTopLikes()
