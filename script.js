// function to fetch images based on selected date
// my API key VypFtk3fR9Geq1FLQ16ZPgLC2mGXad73ndLMZ2bq
const apiKey = "VypFtk3fR9Geq1FLQ16ZPgLC2mGXad73ndLMZ2bq"

// Interesting date for start of page
fetchImagesByDate("2015-05-30")

async function fetchImagesByDate(selectedDate) {
    try{
        // create an HTTP GET request from URL
        const requestObject = fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${apiKey}&earth_date=${selectedDate}`);

        // wait for promise to resolve and store the returned data
        const response = await requestObject;

        if(!response.ok){
            throw new Error(`Error:${response.status}`)
        }
        
        // data from the response JSON
        const data = await response.json();
        
        // Image returned and collected
        const imageUrl = data.photos;

        // limit to first 3 images to display(None if there isnt any)
        const imageDisplay = imageUrl.slice(0, 3).map(({ img_src, camera, sol}) => ({
            url: img_src,
            camera: camera.full_name,
            Sol: sol
        }));

        // Display the images
        displayImages(imageDisplay, selectedDate);

    } catch(error){
        console.log(error);
        const imageObject = document.getElementById("image_container");
        imageObject.innerHTML = `<p role="alert">Failed to load images: ${error.message}</p>`;
    }
}
// Function that creates a paragraph element for each photo
function createInfoElement({camera, Sol}) {
    const infoElement = document.createElement("P");
    infoElement.innerHTML = `Taken by: ${camera} on Sol: ${Sol}`;
    return infoElement;
}
// Function that displays images
function displayImages(imageUrl, selectedDate){
    const imageObject = document.getElementById("image_container");
    
    // clears old images
    imageObject.innerHTML = '';

    // adds title to page for selected date
    const titleElement = createTitle(selectedDate);
    imageObject.appendChild(titleElement)

    if (imageUrl.length === 0) {
        imageObject.innerHTML = "<P>No images for this date.</p>";
        return;
    }
    imageUrl.forEach(data => {
        const imgElement = document.createElement("img");
        imgElement.src = data.url;
        imgElement.alt = `Image from Mars Rover ${data.rover}`;

        //create a paragraph with info for pictures
        const infoElement = createInfoElement(data);

        // Appends the image and info
        imageObject.appendChild(imgElement);
        imageObject.appendChild(infoElement);

    });
}

document.getElementById("show_pictures").addEventListener("click", () => {
    const selectedDate = new Date(`${document.getElementById("date_picker").value}`);
    const currentDate = new Date();

    if (!selectedDate) {
        alert("Please select a valid date.");
        return;
    }

    if (selectedDate > currentDate) {
        alert("Please Select a date not in the future.")
        return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];

    fetchImagesByDate(formattedDate);
})

function createTitle(date) {
    const titleElement = document.createElement("h1");
    titleElement.innerHTML = `Photos taken on ${date}`;
    return titleElement;

}
