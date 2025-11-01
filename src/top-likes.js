import { getAllImages, getAllPages } from "./api.js";

//Get all images in one array
export const topLikes = async () => {


    // Get total pages
    const totalPages = await getAllPages();
    let allImages = []

    // Loop through all pages and push images to new array
    for (let page = 1; page <= totalPages; page++) {
        const imagesOnPage = await getAllImages(page);
        allImages.push(...imagesOnPage); // Spread all images and push them
    }

     // Sort by likes_count in descending order (highest first)
     allImages.sort((a, b) => b.likes_count - a.likes_count);

     // Get top 3
     const topThree = allImages.slice(0, 3);
 
     return topThree;

}

export const createTopLikes = async () => {
    //Get dom elements
    const topLikeContainer = document.querySelector(".top-like")

    const goldContainer = document.querySelector(".gold")
    const goldImage = goldContainer.querySelector("img")
    const goldLikes = document.getElementById("topLike1")

    const silverContainer = document.querySelector(".silver")
    const silverImage = silverContainer.querySelector("img")
    const silverLikes = document.getElementById("topLike2")

    const bronzeContainer = document.querySelector(".bronze")
    const bronzeImage = bronzeContainer.querySelector("img")
    const bronzeLikes = document.getElementById("topLike3")

    //Apply loading state and get data
    goldContainer.classList.add("loading")
    silverContainer.classList.add("loading")
    bronzeContainer.classList.add("loading")
    const topThree = await topLikes();
    goldContainer.classList.remove("loading")
    silverContainer.classList.remove("loading")
    bronzeContainer.classList.remove("loading")

    
    //Apply content
    goldImage.src = topThree[0].image_url
    goldLikes.textContent = topThree[0].likes_count

    silverImage.src = topThree[1].image_url
    silverLikes.textContent = topThree[1].likes_count

    bronzeImage.src = topThree[2].image_url
    bronzeLikes.textContent = topThree[2].likes_count


}
