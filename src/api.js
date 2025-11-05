const baseURL = "https://image-feed-api.vercel.app/api/images";

export const getAllImages = async (page) => {
  try {
    const url = `${baseURL}?page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${response.status}: Couldn't fetch images`)
    }
    const galleryData = await response.json();

    return galleryData.data;
  } catch(error) {
    alert(error)
    console.error(error)
  }
};

export const getOneImage = async (id) => {
  try {
    const url = `${baseURL}/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${response.status}: Couldn't fetch image`)
    }
    const imageData = await response.json();

    return imageData;
  } catch {
    console.error(error)
  }
};

export const getAllPages = async () => {
  try {
    const url = `${baseURL}`;
    const response = await fetch(url);
    const pageData = await response.json();

    if(!response.ok) {
      throw new Error(`${response.status}: Couldn't fetch image count`)
    }

    return pageData.total_pages;
  } catch(error) {
    cconsole.error(error)
  }
};

export const postLike = async (id) => {
  try {
    const url = `${baseURL}/${id}/like`;
    const response = await fetch(url, { method: "POST" });

    if(!response.ok) {
      throw new Error(`${response.status}: Couldn't post comment`)
    }

    const likeData = await response.json();

    return likeData;
  } catch(error) {
    console.error(error);
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

    if (!response.ok) {
      throw new Error("Couldn't post comment")
    }

    const commentData = await response.json();

    return commentData;
  } catch(error) {
    console.error(error);
  }
};
