const axios = require('axios');
const fs = require('fs');

const rootURL = 'https://api.imgur.com/3/image'

function base64_encode(image) {
    let bitmap = fs.readFileSync(image);
    return bitmap.toString('base64');
}

async function upload(req, res) {
    
    let image = base64_encode(req.files.image.file);

    try {
        let imgurData = await axios.post(rootURL, {
            image: image,
            type: 'base64'
        }, {
            headers: {
                Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            },
        });
        return imgurData.data.data.link;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    upload
}