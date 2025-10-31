const baseURL = "https://image-feed-api.vercel.app/api/images";

export const getAllImages = async (page) => {
  try {
    const url = `${baseURL}?page=${page}`;
    const response = await fetch(url);
    const galleryData = await response.json();

    return galleryData.data;
  } catch {
    console.log("Couldn't get images");
  }
};

export const getOneImage = async (id) => {
  try {
    const url = `${baseURL}/${id}`;
    const response = await fetch(url);
    const imageData = await response.json();

    return imageData;
  } catch {
    console.log("Couldn't get images");
  }
};

export const getAllPages = async () => {
  try {
    const url = `${baseURL}`;
    const response = await fetch(url);
    const pageData = await response.json();

    return pageData.total_pages;
  } catch {
    console.log("Couldn't get images");
  }
};

export const postLike = async (id) => {
  try {
    const url = `${baseURL}/${id}/like`;
    const response = await fetch(url, { method: "POST" });
    const likeData = await response.json();

    return likeData;
  } catch {
    console.log("Couldn't post like");
  }
};

export const postComment = async (id, commenter_name, comment) => {
  try {
    const url = `${baseURL}/${id}/comment`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commenter_name: commenter_name,
        comment: comment,
      }),
    });
    const commentData = await response.json();

    return commentData;
  } catch {
    console.log("Couldn't post comment");
  }
};
