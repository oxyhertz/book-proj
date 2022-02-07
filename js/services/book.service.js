"use strict";
const STORAGE_KEY = "bookDB";
const PAGE_SIZE = 5;

var gIdCount = 0;
var gPageIdx = 0;
var gBooks;
var gCurrReadenBook;
var gSortBy;

_createBooks();

function setNextPage(operator) {
  gPageIdx += operator;
  if (gPageIdx * PAGE_SIZE >= gBooks.length || gPageIdx < 0) {
    gPageIdx = 0;
  }
}

function _createBook(name, price) {
  return {
    id: ++gIdCount,
    name,
    price,
    imgUrl: "images/cover.jpg",
    desc: makeLorem(),
    rating: 0,
  };
}

function _createBooks() {
  var books = loadFromStorage(STORAGE_KEY);
  if (!books || !books.length) {
    books = [];
    books.push(_createBook("National Wilds", 6.9));
    books.push(_createBook("Beirut Beirut", 11.9));
    books.push(_createBook("Welcome to Kazahstan", 3.9));
    books.push(_createBook("Game of thrones", 4.5));
    books.push(_createBook("Harry Potter", 7.8));
    books.push(_createBook("WW2", 6.9));
    books.push(_createBook("True Life", 11.9));
    books.push(_createBook("Back To Reality", 3.9));
    books.push(_createBook("Dawn Fall", 4.5));
    books.push(_createBook("Harry Potter 4", 7.8));
  }
  gBooks = books;
  _saveBooksToStorage();
}

function removeBook(bookId) {
  const bookIdx = gBooks.find((book) => book.id === bookId);
  gBooks.splice(bookIdx, 1);
  _saveBooksToStorage();
}

function _saveBooksToStorage() {
  saveToStorage(STORAGE_KEY, gBooks);
}

function getBooks() {
  var books = gBooks;
  const startIdx = gPageIdx * PAGE_SIZE;
  books = books.slice(startIdx, startIdx + PAGE_SIZE);

  return books;
}

function addBook(name, price) {
  const book = _createBook(name, price);
  gBooks.unshift(book);
  _saveBooksToStorage();
  return book;
}

function updateBook(bookId, newPrice) {
  const book = gBooks.find((book) => book.id === +bookId);
  book.price = newPrice;
  _saveBooksToStorage();
  return book;
}

function getBookById(bookId) {
  const book = gBooks.find((book) => +bookId === book.id);
  return book;
}

function updateCurrReadenBook(book) {
  gCurrReadenBook = book;
}

function changeRating(rating) {
  gCurrReadenBook.rating = rating;
  _saveBooksToStorage();
}

function setBookSort(sortBy) {
  if (sortBy === "name") {
    gBooks.sort((a, b) => {
      var book1Name = a.name.toUpperCase();
      var book2Name = b.name.toUpperCase();

      if (book1Name > book2Name) return 1;
      else return -1;
    });
  } else {
    gBooks.sort((a, b) => b[sortBy] - a[sortBy]);
  }
}

function setPageIdx(page) {
  gPageIdx = page;
}
