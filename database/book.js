const mongoose = require("mongoose");

//create a book Schema
const BookSchema = mongoose.Schema(
    {
        ISBN: String,
        title: String,
        pubDate: String,
        language: String,
        numPage:Number,
        author:[Number],
        publications: [Number],
        category: [String]
    }
);

const BookModel = mongoose.model("books",BookSchema);
module.exports = BookModel;