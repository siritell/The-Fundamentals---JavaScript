import { getAllImages, getAllPages, fetchAll, allImagesArray } from "./api.js";
//import { allImagesArray } from "./main.js";

export const totalPages = await getAllPages();

//Return total number of images
const statsImages = async () => {
  await fetchAll;
  return allImagesArray.length;
};

//Return total number of comments
const statsComments = async () => {
  let totalComments = 0;
  await fetchAll;

  totalComments += allImagesArray.reduce(
    (sum, image) => sum + image.comments.length,
    0
  );
  return totalComments;
};

//Return total number of likes
const statsLikes = async () => {
  let totalLikes = 0;
  await fetchAll;

  totalLikes += allImagesArray.reduce(
    (sum, image) => sum + image.likes_count,
    0
  );
  return totalLikes;
};

export const createTotalLikes = async () => {
  const statValue = document.getElementById("likeCount");
  const statBox = document.querySelector(".likes");

  statBox.classList.add("loading");
  const value = await statsLikes();
  statValue.textContent = value;
  statBox.classList.remove("loading");
};

export const createTotalComments = async () => {
  const statValue = document.getElementById("commentCount");
  const statBox = document.querySelector(".comments");

  statBox.classList.add("loading");
  const value = await statsComments();
  statValue.textContent = value;
  statBox.classList.remove("loading");
};

export const createTotalImages = async () => {
  const statValue = document.getElementById("imageCount");
  const statBox = document.querySelector(".image");

  statBox.classList.add("loading");
  const value = await statsImages();
  statValue.textContent = value;
  statBox.classList.remove("loading");
};

export const createAllStats = async () => {
  await fetchAll;
  createTotalComments();
  createTotalImages();
  createTotalLikes();
};
