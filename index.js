require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose")
var bodyParser = require("body-parser");
//DATABASE
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//initialize express and booky is its instance
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, {})
.then(() => console.log('Hurray Connection Established!'));

/*
Route               /
Descriptions        Get all the books
Access              PUBLIC
Parameter           NONE
Methods             GET
*/
booky.get("/", async (req,res)=>{
    const getAllBooks = await BookModel.find(); /////////////////////////////////////////
    return res.json(getAllBooks);
});

/*
Route               /is
Descriptions        Get specific book on ISBN
Access              PUBLIC
Parameter           isbn
Methods             GET
*/
booky.get("/is/:isbn", async(req,res)=>{

    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

//null !0=1 and !1=0
    if(!getSpecificBook){
        return res.json({error: `No Book found for the ISBN of ${req.params.isbn}`});
    }
    return res.json({book: getSpecificBook});
});

/*
Route               /c
Descriptions        to get list of books based on category
Access              PUBLIC
Parameter           category
Methods             GET
*/

booky.get("/c/:category", async (req,res)=>{
    
    const getSpecificBook = await BookModel.findOne({category: req.params.category});

//null !0=1 and !1=0
    if(!getSpecificBook){
        return res.json({error: `No Book found for the category of ${req.params.category}`});
    }
    return res.json({book: getSpecificBook});
    
})

/*
Route               /l
Descriptions        to get list of books based on laguages
Access              PUBLIC
Parameter           laguages
Methods             GET
*/

booky.get("/l/:language",async(req,res) => {
    const getSpecificBook = await BookModel.findOne({language: req.params.language});

//null !0=1 and !1=0
    if(!getSpecificBook){
        return res.json({error: `Book with ${req.params.language} language is not found!!`});
    }
    return res.json({book: getSpecificBook});
  
})


/*
Route               /author
Descriptions        to get all the authors
Access              PUBLIC
Parameter           author
Methods             GET
*/
booky.get("/author", async (req,res)=>{
    const getAllAuthors = await AuthorModel.find();  //////////////////////////////////////////////
    return res.json(getAllAuthors);
});

/*
Route               /author/book
Descriptions        to get a list of authors based on books
Access              PUBLIC
Parameter           isbn
Methods             GET
*/
booky.get("/author/book/:isbn",(req,res)=> {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length===0){
        return res.json({error: `No author found for the book of ${req.params.isbn}`})
    }
    return res.json({authors:getSpecificAuthor});
});

/*
Route               /publication
Descriptions        To get all the publications
Access              PUBLIC
Parameter           publications
Methods             GET
*/
booky.get("/publications", async (req,res)=>{
    const getAllPublications = await PublicationModel.find();   //////////////////////////////////////
    return res.json(getAllPublications);
});
/*
Route               /publication/books
Descriptions        to get a list of publications based on a book
Access              PUBLIC
Parameter           isbn
Methods             GET
*/
booky.get("/publication/book/:isbn",(req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );
    if(getSpecificPublication.length === 0){
        return res.json({error: `Not found Specific Book ${req.params.isbn}`})
    }
    return res.json({publications: getSpecificPublication});
})

///POST

/*
Route               /book/new
Descriptions        Add new book
Access              PUBLIC
Parameter           NONE
Methods             POST
*/

booky.post("/book/new",async (req,res) =>{
    const {newBook} = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message:"Book was addes!1"
    })
})
/*
Route               /publication/new
Descriptions        Add New Publication
Access              PUBLIC
Parameter           NONE
Methods             POST
*/
booky.post("/publication/new", async (req,res) => {
    const {newPublication} = req.body;
    const addNewPblication = PublicationModel.create(newPublication)
    return res.json({
        publication:addNewPblication,
        message : "New Publication was added"
    })

})


/*
Route               /author/new
Descriptions        Add New Author
Access              PUBLIC
Parameter           NONE
Methods             POST
*/

booky.post("/author/new", async (req,res) =>{
    const {newAuthor} = req.body;
    const addnewAuthor = AuthorModel.create(newAuthor)
    return res.json({
        author: addnewAuthor,
        message: "Author was added"
    })
});
/****************   PUT   *******************/
/*
Route               /book/update
Descriptions        Update book on isbn  
Access              PUBLIC
Parameter           isbn
Methods             PUT
*/
booky.put("/book/update/:isbn", async (req,res) =>{
    const updatedbook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title:req.body.bookTitle
        },
        {
            new:true
        }
    );

    return res.json({
        books: updatedbook
    })
})
/**************Updating New author *************/
/*
Route               /publication/update/book
Descriptions        Update/add new publication  
Access              PUBLIC
Parameter           isbn
Methods             PUT
*/
booky.put("/book/author/update/:isbn", async (req,res) =>{
    //update book databse
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn
        },
        {
            $addToSet:{
                authors: req.body.newAuthor
            }
        },
        {
            new : true
        }
    )


    //Update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet :{
                books: req.params.isbn
            }
        },
        {new:true
        }
    )

    return res.json(
        {
            books:updatedBook,
            authors: updatedAuthor,
            message: "new author was added"
        }
    )
});






/*
Route               /publication/update/book
Descriptions        Update/add new publication  
Access              PUBLIC
Parameter           isbn
Methods             PUT
*/

booky.put("/publication/update/book/:isbn",(req,res) => {
    //update the publication database
    database.publication.forEach((pub)=>{
        if(pub.id ===req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
    });

   // Update the book database
   database.books.forEach((book) =>{
    if(book.ISBN === req.params.isbn){
        book.publications = req.body.pubId;
        return;
    } 
   });

   return res.json({
    books:database.books,
    publications : database.publication,
    menubar: "Successfully updated publications"
   });
});
////DELETE
/*
Route                /book/delete
Descriptions        delete a book  
Access              PUBLIC
Parameter           isbn
Methods             DELETE
*/
booky.delete("/book/delete/:isbn",async (req,res) =>{
    //whichever book doesnot match with the isbn, just send it to an updatedBoookData array
    //and rest wil be filtered out
    const updatedBookDatabase= await BookModel.findOneAndDelete(
        {
            ISBN:req.params.isbn
        }
    )

    return res.json({
        books: updatedBookDatabase
    })
})

/*
Route               /book/delete/author
Descriptions        delete author from book and related book from author
Access              PUBLIC
Parameter           isbn, authorId
Methods             DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId",(req,res) =>{
    //update the book database
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !==parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return 
        }
    });


    //Update the author daatbase
    database.author.forEach((eachAuthor) =>{
        if(eachAuthor.id === parseInt(req.params.authorId)){
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    })
    return res.json({
        book: database.books,
        author : database.author,
        message: "Author was deleted"

    })

})


booky.listen(3001, ()=>{
    console.log("Server is up and running")
});