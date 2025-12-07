const Blog = require("../models/Blog");
const fs = require("fs");

// ==================================================
// CREATE BLOG
// ==================================================
async function createRecord(req, res) {
    try {
        let data = new Blog(req.body);

        if (req.file) {
            data.pic = req.file.path;
        }

        await data.save();

        res.send({
            result: "Done",
            data: data
        });

    } catch (error) {

        // Delete uploaded file if validation fails
        try {
            fs.unlinkSync(req.file?.path);
        } catch (e) {}

        // Custom error field mapping
        let errorMessage = {};
        error.errors?.title ? errorMessage.title = error.errors.title.message : null;
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null;
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null;
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null;
        error.errors?.category ? errorMessage.category = error.errors.category.message : null;
        error.errors?.author ? errorMessage.author = error.errors.author.message : null;

        if (Object.values(errorMessage).length === 0) {
            return res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            });
        } else {
            return res.status(400).send({
                result: "Fail",
                reason: errorMessage
            });
        }
    }
}


// ==================================================
// GET ALL BLOGS
// ==================================================
async function getRecord(req, res) {
    try {
        let data = await Blog.find().sort({ _id: -1 });
        res.send({
            result: "Done",
            count: data.length,
            data: data
        });
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}


// ==================================================
// GET SINGLE BLOG
// ==================================================
async function getSingleRecord(req, res) {
    try {
        let data = await Blog.findOne({ _id: req.params._id });

        if (data) {
            res.send({
                result: "Done",
                data: data
            });
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}


// ==================================================
// UPDATE BLOG
// ==================================================
async function updateRecord(req, res) {
    try {
        let data = await Blog.findOne({ _id: req.params._id });

        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }

        // Update fields
        data.title = req.body.title ?? data.title;
        data.shortDescription = req.body.shortDescription ?? data.shortDescription;
        data.longDescription = req.body.longDescription ?? data.longDescription;
        data.category = req.body.category ?? data.category;
        data.tags = req.body.tags ?? data.tags;
        data.author = req.body.author ?? data.author;
        data.active = req.body.active ?? data.active;

        // Save text fields
        await data.save();

        // If new image uploaded, replace old
        if (req.file) {
            try {
                fs.unlinkSync(data.pic);
            } catch (e) {}

            data.pic = req.file.path;
            await data.save();
        }

        res.send({
            result: "Done",
            data: data
        });

    } catch (error) {
        try {
            fs.unlinkSync(req.file?.path);
        } catch (e) {}

        res.status(400).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}


// ==================================================
// DELETE BLOG
// ==================================================
async function deleteRecord(req, res) {
    try {
        let data = await Blog.findOne({ _id: req.params._id });

        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }

        // Delete image
        try {
            fs.unlinkSync(data.pic);
        } catch (e) {}

        await data.deleteOne();

        res.send({
            result: "Done",
            data: data
        });

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
};
