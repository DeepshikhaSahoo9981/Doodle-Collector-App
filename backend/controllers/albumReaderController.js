const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID_G_CLOUD,      // Paste your Client ID
    process.env.CLIENT_SECRET_G_CLOUD,  // Paste your Client Secret
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN_G_CLOUD  // Paste your Refresh Token
});

const FOLDER_ID = process.env.FOLDER_ID_G_CLOUD;

/**
 * Fetch all meta dat for all files currently inside the authenticated Google Drive account
 * Handles automatic pagination across large storage vaults
 * @returns {Promise<Array>} A comprehensive list of file Objects
 */

const fetchAllDriveFiles = async () => {
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    let allFiles = [];
    let pageToken = null;

    try {
        console.log('Initiating full file sync from Google Drive...');

        do {
            //Request a page of files from the drive list endpoint
            const response = await drive.files.list({
                fields: 'nextPageToken, files(id, name, mimeType, size,webViewLink, createdTime)',
                pageSize: 100, // Max items allowed per individual network page request
                pageToken: pageToken,
                q: `'${FOLDER_ID}' in parents and trashed = false` // Excludes items in the trash bin
            })

            const currentBatchFiles = response.data.files || [];
            allFiles = allFiles.concat(currentBatchFiles);

            pageToken = response.data.nextPageToken;
        } while (pageToken)

        console.log(`Success! Retrieved a total of ${allFiles.length} items from cloud storage.`);
        return allFiles;

    } catch (error) {
        console.error('Error fetching files from Google Drive container:', error);
        throw error;
    }
}


const readAllFiles = async (req, res) => {
    try {
        let result = await fetchAllDriveFiles();
        return res.status(200).json({
            "success": true,
            "data": result
        })
    } catch (error) {
        console.error("Error in read All Files ", error);
        return res.status(500).json({
            success: false,
            error: error.toString() || error.message
        })
    }
}


module.exports = { readAllFiles };