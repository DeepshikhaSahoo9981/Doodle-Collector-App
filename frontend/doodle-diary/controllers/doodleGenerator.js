const SERVER_URL_B = process.env.EXPO_PUBLIC_BACKEND_SERVER_URL;

const defaultJson = {
    "message": {
        "doodle_topics": [
            "A chameleon trying to blend into a brightly colored, mismatched sock.",
            "An astronaut having a tea party with tiny aliens on a cloud-covered planet.",
            "A wobbly stack of **vintage suitcases**, each with a different travel sticker from a fantastical, non-existent place (e.g.,\"The Whispering Peaks,\" \"The Sunken City of Lumina\").",
            "A **Romanesco broccoli** *growing crystals* instead of florets, surrounded by tiny sparkling mushrooms.",
        ]
    }
}
export const generate = async () => {
    try {
        let response = await fetch( `${SERVER_URL_B}/api/doodle/generate`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        if (!response.ok) {
            console.warn(`Backend responded with status code: ${response.status}. Dropping to fallback...`);
            return defaultJson;
        }

        const result = await response.json();
        console.log("Server verification receipt:", JSON.stringify(result));

        return result || defaultJson;

    } catch (error) {
        console.error("Upload process encountered a network error:", error);
    }
}

export const getAllImagesFromDrive = async()=>{
    try {
        let response = await fetch(`${SERVER_URL_B}/api/doodle/readAllImage`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        if (!response.ok) {
            console.warn(`Backend responded with status code: ${response.status}. Dropping to fallback...`);
            return defaultJson;
        }

        const result = await response.json();
        console.log("Server verification receipt:", result.data.length);

        if(!result.success){
            return []
        }

        return result.data;

    } catch (error) {
        console.error("Read process encountered a network error:", error);
        return [];
    }
} 


 export const uploadImageToDriveThroughApi = async (fileURI, givenFileName, mime) => {
    // 1. Create a form data
    const formData = new FormData();

    // 2. Append the physical image file
    formData.append('doodle_image', {
        uri: fileURI,
        type: mime,
        name: `comic_panel_${new Date().toString()}.png`
    })

    // 3. Append any extra text fields your backend needs
    formData.append('fileName', givenFileName);
    formData.append('type', mime)

    try {
        // 4. Send the request to your backend URL
        const response = await fetch(`${SERVER_URL_B}/api/doodle/uploadImage`, {
            method: 'POST',
            body: formData,
            // headers:{
            //     'Content-Type': 'multipart/form-data'
            // } // no need to explicitly mention header here 
        })

        const result = await response.json();
        console.log("Uploaded successfully! Server returned: ", result);
    } catch (error) {
        console.error("Network upload failed:", error);
    }
}