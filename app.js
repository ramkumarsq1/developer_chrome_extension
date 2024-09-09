const gallery = document.getElementById("gallery");
const loadMoreButton = document.getElementById("loadMore");
let page = 1;
const perPage = 10;
const unsplashAccessKey = "WqN6Hpiu4ixqy0p7t2Z8lItmhok-Kutnixtqh4MGI2w"; // Replace with your Unsplash Access Key

const fetchImages = async () => {
  try {
    // const queryParam = `&query=${encodeURIComponent("cat")}`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&per_page=${perPage}&client_id=${unsplashAccessKey}&query=office`
    );
    // const response = await fetch(
    //   `https://api.unsplash.com/search/photos?page=${page}&per_page=${perPage}&client_id=${unsplashAccessKey}&query=office`
    // );
    if (!response.ok) throw new Error("Failed to fetch images");
    const data = await response.json();

    data.results.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.urls.small;
      img.alt = image.alt_description || "Unsplash Image";
      gallery.appendChild(img);
    });

    page++;
  } catch (error) {
    console.error("Error:", error);
  }
};

// Initial load
fetchImages();

// Load more images on button click
loadMoreButton.addEventListener("click", fetchImages);
