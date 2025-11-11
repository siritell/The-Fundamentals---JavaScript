import "./reset.css";
import "./style.css";
import {
  getAllImages,
  postComment,
  postLike,
  deleteLike,
  getOneImage,
  getAllPages,
} from "./api.js";
import {
  createAllStats,
  createTotalLikes,
  createTotalComments,
  createTotalImages,
} from "./stats.js";
import { createTopLikes } from "./top-likes.js";

createAllStats();
export const totalPages = await getAllPages();
const container = document.getElementById("gallery-container");

// ===== ALEX Modal Setup =====

async function createImages() {
  const galleryItemLoading = document.createElement("div");
  galleryItemLoading.classList.add("gallery-item", "loading");
  const gallery = await getAllImages();

  for (const image of gallery) {
    createImage(
      image.image_url,
      image.id,
      image.likes_count || 0,
      image.comments.length || 0
    );
  }
}

function createImage(src, id, initialLikes, initialComments) {
  const card = document.createElement("div");
  card.classList.add("gallery-item", "loading");
  card.setAttribute("data-image-id", id);
  // NEW: Set initial like state on the DOM element
  card.dataset.isLiked = "false";

  const image = document.createElement("img");
  image.src = src;
  image.classList.add("article-image");
  card.appendChild(image);

  image.addEventListener("load", () => {
    card.classList.remove("loading");
  });

  //ALEX Modal EVENT Save all gallery images for modal navigation
  galleryImages.push({ image_url: src, id });

  // ALEX Click image -> open modal w/ correct index
  image.addEventListener("click", () => {
    const index = galleryImages.findIndex((img) => img.id === id);
    openImageModal(index, id, galleryImages);
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
  // UPDATED: Like logic now uses card.dataset.isLiked as the source of truth
  likeButton.addEventListener("click", async () => {
    const wasLiked = card.dataset.isLiked === "true";
    const isLiked = !wasLiked; // This is the *new* state we are moving to
    const current = parseInt(likeCountNum.textContent || "0", 10) || 0;

    // 1. Optimistic UI update (Card + Modal)
    card.dataset.isLiked = String(isLiked); // Update source of truth
    if (isLiked) {
      // --- Card UI ---
      solidHeartIcon.style.display = "block";
      likeIcon.style.display = "none";
      likeCountNum.textContent = String(current + 1);

      // --- Modal UI (if open) ---
      if (currentImageId === id && modal.style.display === "flex") {
        modalLikeIconSolid.style.display = "block";
        modalLikeIcon.style.display = "none";
        modalLikeCount.textContent = likeCountNum.textContent;
      }
    } else {
      // --- Card UI ---
      solidHeartIcon.style.display = "none";
      likeIcon.style.display = "block";
      likeCountNum.textContent = String(current - 1);

      // --- Modal UI (if open) ---
      if (currentImageId === id && modal.style.display === "flex") {
        modalLikeIconSolid.style.display = "none";
        modalLikeIcon.style.display = "block";
        modalLikeCount.textContent = likeCountNum.textContent;
      }
    }

    // 2. API Call
    try {
      if (isLiked) {
        await postLike(id);
        console.log("LIKED");
      } else {
        await deleteLike(id);
        console.log("UNLIKED");
      }
    } catch (error) {
      // 3. Revert on failure
      card.dataset.isLiked = String(wasLiked); // Revert source of truth

      if (wasLiked) {
        // --- Card UI ---
        solidHeartIcon.style.display = "block";
        likeIcon.style.display = "none";
        likeCountNum.textContent = String(current); // Revert to original count

        // --- Modal UI (if open) ---
        if (currentImageId === id && modal.style.display === "flex") {
          modalLikeIconSolid.style.display = "block";
          modalLikeIcon.style.display = "none";
          modalLikeCount.textContent = likeCountNum.textContent;
        }
      } else {
        // --- Card UI ---
        solidHeartIcon.style.display = "none";
        likeIcon.style.display = "block";
        likeCountNum.textContent = String(current); // Revert to original count

        // --- Modal UI (if open) ---
        if (currentImageId === id && modal.style.display === "flex") {
          modalLikeIconSolid.style.display = "none";
          modalLikeIcon.style.display = "block";
          modalLikeCount.textContent = likeCountNum.textContent;
        }
      }
      console.error("Error liking/unliking:", error);
      alert("Failed to update like. Please try again.");
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
    openImageModal(index, id, galleryImages);
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
// NEW: Added modal-like-button HTML
modal.innerHTML = `
  <div class="modal-backdrop"></div>
  <div class="modal-content fade-in">
    <button id="modal-close" class="modal-close">×</button>    
    <img id="modal-image" src="" alt="Large View" />    
    
    <button id="modal-like-button" class="like-comment-button">
      <span id="modal-like-count" class="like-count">0</span>
      <img id="modal-like-icon" src="./src/icons/like.svg" alt="like-icon" class="like-icon">
      <img id="modal-like-icon-solid" src="./src/icons/like-filled.svg" alt="solid-heart-icon" class="solid-heart-icon" style="display: none;">
    </button>
    <div id="modal-comments" class="modal-comments"></div>
    <form id="comment-form" class="comment-form">
      <input type="text" id="commenter-name" placeholder="Your name" required />
      <textarea id="comment-text" placeholder="Write a comment..." rows="3" required></textarea>
      <button type="submit">Post Comment</button>
    </form>
    <div class="modal-nav-cont">
      <button id="modal-prev" class="modal-nav prev">‹</button>
      <button id="modal-next" class="modal-nav next">›</button>
    </div>
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

// NEW: Get references to new modal like button elements
const modalLikeButton = document.getElementById("modal-like-button");
const modalLikeCount = document.getElementById("modal-like-count");
const modalLikeIcon = document.getElementById("modal-like-icon");
const modalLikeIconSolid = document.getElementById("modal-like-icon-solid");

export async function openImageModal(index, id, gallery) {
  currentImageIndex = index;
  currentImageId = id;
  modal.style.display = "flex";
  modalImg.classList.remove("zoomed"); // reset zoom

  const imageObj = gallery[index];
  modalImg.src = imageObj.image_url;

  // Reset form
  commenterNameInput.value = "";
  commentTextInput.value = "";

  // NEW: Sync modal like button state with the card's state
  const card = document.querySelector(`[data-image-id="${id}"]`);
  if (card) {
    const isCurrentlyLiked = card.dataset.isLiked === "true";
    const currentLikes =
      card.querySelector(".like-count")?.textContent || "0";

    modalLikeCount.textContent = currentLikes;
    if (isCurrentlyLiked) {
      modalLikeIconSolid.style.display = "block";
      modalLikeIcon.style.display = "none";
    } else {
      modalLikeIconSolid.style.display = "none";
      modalLikeIcon.style.display = "block";
    }
  }

  // ALEX Load comments for this image
  await loadComments(id);
}

async function loadComments(id) {
  const data = await getOneImage(id);

  const comments = data.comments || [];

  // ALEX newest comments show first in line
  const reversed = [...comments].reverse();

  const commentsHTML =
    reversed.length > 0
      ? reversed
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
  openImageModal(currentImageIndex, img.id, galleryImages);
});

btnNext.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  const img = galleryImages[currentImageIndex];
  openImageModal(currentImageIndex, img.id, galleryImages);
});

// ALEX Close modal
btnClose.addEventListener("click", () => (modal.style.display = "none"));
modal
  .querySelector(".modal-backdrop")
  .addEventListener("click", () => (modal.style.display = "none"));

document.addEventListener("keydown", (e) => {
  if (modal.style.display !== "flex") return; // Only run if modal is open
  if (e.key === "Escape") modal.style.display = "none";
  if (e.key === "ArrowRight") btnNext.click();
  if (e.key === "ArrowLeft") btnPrev.click();
});

// ALEX Zoom on click
modalImg.addEventListener("click", () => {
  modalImg.classList.toggle("zoomed");
});

// NEW: Add event listener for the MODAL like button
// This simply "clicks" the hidden card's like button,
// which triggers the main logic and ensures state is synced.
modalLikeButton.addEventListener("click", () => {
  if (!currentImageId) return;
  const card = document.querySelector(`[data-image-id="${currentImageId}"]`);
  if (!card) return;

  const cardLikeButton = card.querySelector(".like-comment-button"); // The first one is the like button
  if (cardLikeButton) {
    cardLikeButton.click();
  }
});

// ALEX >>>> Update comment count everywhere for an image
function updateCommentCount(imageId, increment = 1) {
  const card = document.querySelector(`[data-image-id="${imageId}"]`);
  if (!card) return;

  const commentCountEl = card.querySelector(".comment-count");
  if (commentCountEl) {
    const current = parseInt(commentCountEl.textContent || "0", 10);
    commentCountEl.textContent = String(current + increment);
  }
}

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
    createTotalComments();
    // Clear form
    commenterNameInput.value = "";
    commentTextInput.value = "";

    // Show comment count number
    updateCommentCount(currentImageId, 1);
  } catch (error) {
    console.error("Error posting comment:", error);
    alert("Failed to post comment. Please try again.");
  }
});
// await allPagesImages();

createImages();

createTopLikes();