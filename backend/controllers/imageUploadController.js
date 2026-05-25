const { google } = require('googleapis');
const fs = require('fs');

// 1. Initialize authentication using your newly generated OAuth Client credentials
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID_G_CLOUD,      // Paste your Client ID
    process.env.CLIENT_SECRET_G_CLOUD,  // Paste your Client Secret
    'https://developers.google.com/oauthplayground'
);

// 2. Lock in your permanent personal access key token
oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN_G_CLOUD  // Paste your Refresh Token
});

const driveService = google.drive({ version: 'v3', auth: oauth2Client });

/**
 * Controller function to upload an image directly into your personal Google Drive account space
 */
const uploadDoodleToPersonalDrive = async (localFilePath, fileName, mimeType) => {
    try {
        const FOLDER_ID = process.env.FOLDER_ID_G_CLOUD; // Your target personal folder

        const fileMetadata = {
            name: `${Date.now()}_${fileName}`,
            parents: [FOLDER_ID]
        };

        const media = {
            mimeType: mimeType,
            body: fs.createReadStream(localFilePath)
        };

        // Send file data directly into your personal storage pool allocation quota
        const response = await driveService.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink'
        });

        const fileId = response.data.id;
        console.log(" Success! Uploaded straight to your personal Drive. ID:", fileId);
        
        await driveService.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone', // Anyone with the link can view it
            },
        });
        console.log(` Permissions updated to public-read for file: ${fileId}`);
        return response.data;

    } catch (error) {
        console.error('Error in Google Drive upload pipeline:', error);
        throw error;
    }
};

const uploadToDriveMain = async (req, res) => {
    try {
        let inputPayload = req.body;
        if (typeof inputPayload === 'string') {
            inputPayload = JSON.parse(inputPayload);
        }
        const { fileName, type } = inputPayload;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data: Physical file asset was not received under key 'doodle_image'."
            });
        }

        if (!fileName || !type) {
            return res.status(400).json({ success: false, message: "Invalid Data: Missing fields" });
        }
        let result = await uploadDoodleToPersonalDrive(req.file.path, fileName, type)
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error in uploading file process:", error);
        return res.status(500).json({
            message: "Error in uploading file",
            error: error.message || error.toString()
        });
    }
}

module.exports = uploadToDriveMain;