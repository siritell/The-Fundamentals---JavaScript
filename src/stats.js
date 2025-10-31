import { getAllImages, getAllPages } from "./api.js";

//Return total number of images
const statsImages = async () => {
    let totalImages = 0;

    // Get total pages
    const totalPages = await getAllPages();

    // Loop through all pages and add to totalImages
    for (let page = 1; page <= totalPages; page++) {
        const imagesOnPage = await getAllImages(page);
        totalImages += imagesOnPage.length;
    }
    return totalImages;
};

//Return total number of comments
const statsComments = async () => {
    let totalComments = 0;

    // Get total pages
    const totalPages = await getAllPages();

    // Loop through all pages and collect comment counts
    for (let page = 1; page <= totalPages; page++) {
        const imagesOnPage = await getAllImages(page);

        //Go through all images on the page, get the length of comments array and add it to totalComments
        totalComments += imagesOnPage.reduce((sum, image) => sum + image.comments.length, 0);
    }
    return totalComments
};

//Return total number of likes
const statsLikes = async () => {
    let totalLikes = 0;

    // Get total pages
    const totalPages = await getAllPages();

    // Loop through all pages and collect like counts
    for (let page = 1; page <= totalPages; page++) {
        const imagesOnPage = await getAllImages(page);

        //Go through all images on the page, get the length of comments array and add it to totalComments
        totalLikes += imagesOnPage.reduce((sum, image) => sum + image.likes_count, 0);
      
    }
    return totalLikes
};

export const createTotalLikes = async () => {
    const statValue = document.getElementById("likeCount")q

    const value = await statsLikes()
    statValue.textContent = value
};

export const createTotalComments = async () => {
    const statValue = document.getElementById("commentCount")

    const value = await statsComments()
    statValue.textContent = value
};

export const createTotalImages = async () => {
    const statValue = document.getElementById("imageCount")

    const value = await statsImages()
    statValue.textContent = value
};

export const updateStats = () => {
    createTotalComments()
    createTotalImages()
    createTotalLikes()
}