"use strict";

function onInit() {
  gIdCount = gBooks.length;
  renderBooks();
  renderPagesBtn();
}

function renderBooks() {
  var books = getBooks();
  var strHTMLs = books.map((book) => {
    return `
    <tr>
    <td>${book.id}</td>
    <td>${book.name}</td>
    <td>${book.price}</td>
    <td>${book.rating}</td>
    <td>
      <button class="btn read-btn" onclick="onReadBook('${book.id}')">Read</button>
    </td>
    <td>
      <button class="btn update-btn" onclick="onUpdateBook('${book.id}')">Update</button>
    </td>
    <td>
      <button class="btn remove-btn" onclick="onRemoveBook('${book.id}')">Delete</button>
    </td>
  </tr>
      `;
  });

  document.querySelector(".books-tbody").innerHTML = strHTMLs.join("");
}

function onRemoveBook(bookId) {
  removeBook(bookId);
  renderBooks();
  renderPagesBtn();
  flashMsg("Book Deleted");
}

function flashMsg(msg) {
  const el = document.querySelector(".user-msg");
  el.innerText = msg;
  el.classList.add("open");
  setTimeout(() => {
    el.classList.remove("open");
  }, 3000);
}

function onAddBook() {
  var elNameInput = document.querySelector(".book-name-input");
  var elPriceInput = document.querySelector(".book-price-input");
  var name = elNameInput.value.trim();
  var price = elPriceInput.value;

  if (!name || price <= 0) return;
  const book = addBook(name, price);
  renderBooks();
  renderPagesBtn();
  flashMsg(`Book Added (name: ${book.name})`);
  elNameInput.value = "";
  elPriceInput.value = "";

  hideInputs();
}

function onUpdateBook(bookId) {
  var price = +prompt("Enter new price:");
  if (price > 0) {
    console.log(price);
    const book = updateBook(bookId, price);
    renderBooks();
    flashMsg(`Book Updated (name: ${book.name})`);
  }
}

function onReadBook(bookId) {
  var book = getBookById(bookId);
  updateCurrReadenBook(book);
  renderModalContent(book);
}

function renderModalContent(book) {
  var elModal = document.querySelector(".modal");
  var elOverlay = document.querySelector(".overlay");
  elModal.querySelector("h3").innerText = book.name;
  document.querySelector(".book-image").src = book.imgUrl;
  elModal.querySelector("h4 span").innerText = book.rating;
  elModal.querySelector("p").innerText = book.desc;
  // elModal.classList.add("open");
  elModal.classList.remove("hidden");
  elOverlay.classList.remove("hidden");
}

function onCloseModal() {
  // document.querySelector(".modal").classList.remove("open");
  document.querySelector(".rating-value").value = 1;
  document.querySelector(".overlay").classList.add("hidden");
  document.querySelector(".modal").classList.add("hidden");
}

function onChangeRating(operation) {
  var elRatingInput = document.querySelector(".rating-value");
  var currValue = +elRatingInput.value;
  var newRatingValue = currValue + operation;
  if (newRatingValue < 1 || newRatingValue > 10) return;

  elRatingInput.value = newRatingValue;
  changeRating(newRatingValue);
  document.querySelector(".rating").innerText = newRatingValue;
  renderBooks();
}

function onSetSortBy(sortBy) {
  setBookSort(sortBy);
  renderBooks();
}

function displayInputs() {
  document.querySelector(".book-inputs").hidden = false;
}

function hideInputs() {
  document.querySelector(".book-inputs").hidden = true;
}

function onSetNextPage(operator) {
  setNextPage(operator);
  renderBooks();
}

function onChangePage(page) {
  document.querySelectorAll(".btn-page").forEach((elBtn) => {
    elBtn.classList.remove("active");
  });
  document.querySelector(`.btn-page-${page}`).classList.add("active");
  setPageIdx(page);
  renderBooks();
}

function renderPagesBtn() {
  var strHTMLs = "";
  var pagesAmount = gBooks.length / PAGE_SIZE;
  pagesAmount = pagesAmount % 1 > 0 ? Math.floor(++pagesAmount) : pagesAmount;

  for (var i = 0; i < pagesAmount; i++) {
    strHTMLs += `<button class="btn-page btn-page-${i}" onclick="onChangePage(${i})">${
      i + 1
    }</button>`;
  }
  document.querySelector(".pages-btns").innerHTML = strHTMLs;
}
