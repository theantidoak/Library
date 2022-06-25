let myLibrary = [];
const form = document.querySelector('form').children;
const card = document.querySelector('.card');
const btn = document.querySelector('.btn');

btn.addEventListener('click', addBook)

/*------ Create Book Object ------*/
class Book {
  constructor() {
    this.title = form.titleDiv.children.titleInput.value;
    this.author = form.authorDiv.children.authorInput.value.split(' ').reverse().join(', ')
    this.pages = form.pagesDiv.children.pagesInput.value;
    this.year = form.yearDiv.children.yearInput.value;
    this.category = document.querySelector("form input[name='cat']:checked").value;
    this.read = form.readDiv.children.readInput.checked;
  }
  addReferenceNumber() {
    this.reference = this.author.substring(0, 2).toUpperCase() + 
      Math.floor(10 + Math.random() * 90) +
      this.title.charAt(0).toUpperCase() + Math.floor( +Math.random() * 9);
  }
  addCatalogNumber() {
    this.catalog = '#' + (myLibrary.indexOf(this) + 1).toString().padStart(4, '0');
  }
  readOrNot() {
    document
      .querySelector('#left input').checked = 
      form.readDiv.children.readInput.checked ? true: false;
    this.isRead = true;
  }
  display() {
    this.isDisplayed = true;
  }
}


/*------ Add Book to the array and display on page ------*/
addBook.prototype = Object.create(Book.prototype);
function addBook() {
  if (myLibrary.some((duplicate) => duplicate.title == new Book().title)) return;
  myLibrary.push(new Book());
  myLibrary.forEach((book) => {
    if (book.isDisplayed == true) return;
    book.addCatalogNumber();
    book.addReferenceNumber();
    book.readOrNot();
    book.display();
    /*------ Create new card ------*/
    let nextCard = card.cloneNode(true);
    nextCard.children.middle.children.title.textContent = book.title;
    nextCard.children.middle.children.author.textContent = book.author;
    nextCard.children.middle.children.pages.textContent = book.pages + ' pp.';
    nextCard.children.middle.children.year.textContent = 'c.' + book.year;
    nextCard.children.left.children.category.textContent = book.category;
    nextCard.children.left.children.catalog.textContent = book.catalog;
    nextCard.children.left.children.reference.textContent = book.reference;
    card.parentNode.appendChild(nextCard);
  })
}