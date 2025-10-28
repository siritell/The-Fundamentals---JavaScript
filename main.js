const container = document.getElementById('app');

function createImage(src) {
    const image = document.createElement('img');
    image.src = src;
    container.appendChild(image);
}

async function getImages() {
    const url = 'https://image-feed-api.vercel.app/api/images';

    try {
        const response = await fetch(url);
        const data = await response.json();

        for (image of data) {
            console.log(data.image_url)
        }

       // for(let i = 0; 0 < data.length; i++);

        console.log(data);

    } catch {
        console.log('Error fetching images');
    }
}

getImages();

// function likeImage() {
//     return { "success": true, "likes_count": 6 }
// }