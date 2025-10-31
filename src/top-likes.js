import { getAllImages, getAllPages } from "./api.js";

//Get all images in one array
const topLikes = async () => {
    // Get total pages
    const totalPages = await getAllPages();

    // Loop through all pages and push images to new array
    for (let page = 1; page <= totalPages; page++) {
        const imagesOnPage = await getAllImages(page);
        
        imagesOnPage.map((image) => {
            return newValue;
          });
    }


}
