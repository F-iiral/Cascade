export async function getUploadedImageLink() {
    let fileInput = document.querySelector("#image-input");
    if (fileInput == null) 
        return null;

    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("image", file);

    return fetch("http://127.0.0.1:5000/image/upload", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then(data => {
        console.log(data)
        return data
    })
}