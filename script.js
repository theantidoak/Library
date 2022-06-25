let myLibrary = [];
const form = document.querySelector('form');
const card = document.querySelector('.card');
const btn = document.querySelector('.btn');

btn.addEventListener('click', addBook)

class Book {
  constructor() {
    this.title = form.children.titleDiv.children.titleInput.value,
    this.author = form.children.authorDiv.children.authorInput.value,
    this.pages = form.children.pagesDiv.children.pagesInput.value,
    this.category = document.querySelector("form input[name='cat']:checked").value,
    this.year = form.children.yearDiv.children.yearInput.value,
    this.read = form.children.readDiv.children.readInput.checked
  }
  addReferenceNumber() {
    this.reference = this.author.substring(0, 2).toUpperCase() + 
      Math.floor(100 + Math.random() * 900) +
      this.title.charAt(0).toUpperCase() + Math.floor(10 +Math.random() * 90);
  }
  addCatalogNumber() {
    this.catalog = '#' + (myLibrary.indexOf(this) + 1).toString().padStart(4, '0');
  }
  readOrNot() {
    document
      .querySelector('#left input').checked = 
      form.children.readDiv.children.readInput.checked ? true: false;
    this.isRead = true;
  }
  display() {
    this.isDisplayed = true;
  }
}

function addBook() {
  let newBook = new Book();
  myLibrary.push(newBook);
  newBook.addCatalogNumber();
  newBook.addReferenceNumber();
  newBook.readOrNot();
  myLibrary.forEach((book) => {
    if (book.isDisplayed == true) return;
    let nextCard = card.cloneNode(true);
    nextCard.children.middle.children.title.textContent = book.title;
    nextCard.children.middle.children.author.textContent = book.author;
    nextCard.children.middle.children.pages.textContent = book.pages;
    nextCard.children.middle.children.category.textContent = book.category;
    nextCard.children.left.children.year.textContent = book.year;
    nextCard.children.left.children.catalog.textContent = book.catalog;
    nextCard.children.left.children.reference.textContent = book.reference;
    card.parentNode.appendChild(nextCard);
  })
  newBook.display();
}
addBook.prototype = Object.create(Book.prototype);