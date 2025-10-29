const baseURL = "https://image-feed-api.vercel.app/api/images"

export const getAllImages = async () => {
    try {
        const url = baseURL;
        const response = await fetch(url);
        const galleryData = await response.json();
        
        return galleryData.data;
    } catch {
        console.log("Couldn't get images");
    }
}

export const getOneImage = async (id) => {
    try {
        const url = `${baseURL}/${id}`;
        const response = await fetch(url);
        const imageData = await response.json();
        
        return imageData;
    } catch {
        console.log("Couldn't get images");
    }
}

export const postLike = async (id) => {
    try {
        const url = `${baseURL}/${id}/like`;
        const response = await fetch(url);
        const likeData = await response.json();
        
        return likeData;
    } catch {
        console.log("Couldn't post like");
    }
}

export const postComment = async (id) => {
    try {
        const url = `${baseURL}/${id}/comment`;
        const response = await fetch(url);
        const commentData = await response.json();
        
        return commentData;
    } catch {
        console.log("Couldn't post comment");
    }
}