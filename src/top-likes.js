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
    console.log(allImages)


}
