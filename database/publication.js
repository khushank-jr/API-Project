const mongoose = require("mongoose");

//create a publication Schema
const PublicationSchema = mongoose.Schema(
    {
        id:Number,
        name:String,
        books: [String]
    }
);

const PublicationModel = mongoose.model("publications",PublicationSchema);
module.exports = PublicationModel;