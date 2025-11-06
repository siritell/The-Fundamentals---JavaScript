import { getAllImages } from "./api.js";
import { totalPages } from "./main.js";
import { openImageModal } from "./main.js"
import { allImagesArray } from "./stats.js";

// Get all images in one array
export const topLikes = async () => {
    let allImages = [];

    // Loop through all pages and push images to new array
    // for (let page = 1; page <= totalPages; page++) {
    //     const imagesOnPage = await getAllImages(page);
    //     allImages.push(...imagesOnPage);
    // }

    // Sort by likes_count descending
    const sortedArray = allImagesArray.sort((a, b) => b.likes_count - a.likes_count);

    // Get top 3
    console.log(`sorted: ${sortedArray}`)
    return sortedArray.slice(0, 3);
};

// Update DOM for top likes
export const createTopLikes = async () => {
    const topLikeElements = document.querySelectorAll(".top-like");

    // Apply loading state
    topLikeElements.forEach(el => el.classList.add("loading"));

    const topThree = await topLikes();

    topLikeElements.forEach((el, index) => {
        if (!topThree[index]) return;

        const img = el.querySelector("img");
        const likeCount = el.querySelector(".like-count");
        const rank = el.querySelector(".rank");

        img.src = topThree[index].image_url;
        likeCount.textContent = topThree[index].likes_count;
        rank.textContent = index + 1; // 1, 2, 3
        console.log(index)

        el.addEventListener("click", async () => {
            await openImageModal(index, topThree[index].id, topThree);
        });


    });

    // Remove loading state
    topLikeElements.forEach(el => el.classList.remove("loading"));
};

