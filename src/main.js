import "./style.css";
const container = document.getElementById("app");

function createImage(src) {
  const image = document.createElement("img"); //Create an image element.
  image.src = src;
  container.appendChild(image); //Append the image element to the container.
}

async function getImages() {
  const url = "https://image-feed-api.vercel.app/api/images";

  try {
    const response = await fetch(url);

    // This naming is confusing because the object also has a property called "data"
    // const data = await response.json();

    // responseData contains the following properties:
    // data: []
    // page: 1
    // total_pages: 20
    const responseData = await response.json();

    //The data property is an array of images.
    for (const image of responseData.data) {
      createImage(image.image_url); //Create an image element for each image.
      console.log(image.image_url);
    }

    // for(let i = 0; 0 < data.length; i++);

    console.log(data);
  } catch {
    console.log("Error fetching images");
  }
}

getImages();

// function likeImage() {
//     return { "success": true, "likes_count": 6 }
// }
