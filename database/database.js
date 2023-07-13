const books = [
    {
        ISBN: "12345Book",
        title: "Tesla",
        pubDate: "2021-08-05",
        language: "en,ru,hi",
        numPage:250,
        author:[1,2],
        publications: [1],
        category: ["tech", "space","education"]
    }
]

const author =[
    {
        id: 1,
        name: "Khushank",
        books: ["12345Book","education"]
    },
    {
        id:2,
        name:"Elon Musk",
        books:["12345Book"]
    },
    {
        id:3,
        name:"Rahul Gandhi BKL",
        books:["education"]
    }
]

const publication = [
    {
        id:1,
        name: "writex",
        books: ["12345Book"]
    },
    {
        id:2,
        name: "wrx",
        books: []
    },
    {
        id:3,
        name: "IRON MAN",
        books: ["nalla"]
    }

]

module.exports = {books , author , publication};