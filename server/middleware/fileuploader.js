const multer = require("multer")

function createUploader(folder) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/uploads/${folder}`)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })

    return multer({ storage: storage })
}

module.exports = {
    portfolioUploader: createUploader("portfolio"),
    certificateUploader: createUploader("certificate"),
    testimonialUploader: createUploader("testimonial"),
    userUploader: createUploader("user"),
    blogUploader: createUploader("blog")
}