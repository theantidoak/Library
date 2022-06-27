let myLibrary = [];
let count = 0;
const form = document.querySelector('form');
const card = document.querySelector('.card');
const cardCabinet = document.querySelector('.card-cabinet');
const btn = document.querySelector('.btn');
const formDisplay = document.querySelector('.display-form');

btn.addEventListener('click', addBook);
formDisplay.addEventListener('click', displayForm);

function displayForm() {
  [...form.parentNode.parentNode.children]
    .forEach((el) => [...el.children]
      .forEach((child) => child.style.filter = 'blur(2px)'));
  form.style.display = 'flex';
  form.style.filter = 'blur(0)';
}


/*------ Create Book Object ------*/
class Book {
  constructor() {
    this.title = form.children.titleDiv.children.titleInput.value;
    this.author = form.children.authorDiv.children.authorInput.value
      .split(' ')
      .map((up) => up[0].toUpperCase().concat(up.substring(1)))
      .reverse()
      .join(', ');
    this.pages = form.children.pagesDiv.children.pagesInput.value;
    this.year = form.children.yearDiv.children.yearInput.value;
    this.category = document.querySelector("form input[name='cat']:checked").value;
    this.read = form.children.readDiv.children.readInput.checked;
  }
  addReferenceNumber() {
    this.reference = this.author.substring(0, 2).toUpperCase() + 
      Math.floor(10 + Math.random() * 90) +
      this.title.charAt(0).toUpperCase() + Math.floor(Math.random() * 9);
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
  deleteCard(bookref) {
    let thisCard = document.querySelector(`article[data-bookref="${bookref}"]`);
    thisCard.children.right.children[1].addEventListener('click', () => {
      thisCard.parentNode.removeChild(thisCard);
      myLibrary = myLibrary.filter((book) => book.author != this.author)
    });
  }
  resetForm() {
    form.style.display = 'none';
    [...form.parentNode.parentNode.children]
      .forEach((el) => [...el.children]
        .forEach((child) => child.style.filter = 'blur(0)'));
    form.reset();
  }
  useTabs(bookref) {
    let thisCard = document.querySelector(`article[data-bookref="${bookref}"]`);
    thisCard.children[0].addEventListener('click', () => {
      [...cardCabinet.children].forEach((card) => {
        card.style.zIndex = 1;
        card.children[0].style.backgroundColor = '#ecd6b6'
      });
      thisCard.style.zIndex = 2;
      thisCard.children[0].style.backgroundColor = '#E0c9A6';
    })
  }
}


/*------ Add Book to the array and display on page ------*/
addBook.prototype = Object.create(Book.prototype);
function addBook() {
  if (myLibrary.some((duplicate) => duplicate.title == new Book().title)) return;
  [...card.parentElement.children].forEach((prev) => prev.children[0].style.backgroundColor = '#ecd6b6');
  myLibrary.push(new Book());
  myLibrary.forEach((book) => {
    if (book.isDisplayed == true) return;
    book.addCatalogNumber();
    book.addReferenceNumber();
    book.readOrNot();
    book.display();
    /*------ Create new card ------*/
    let nextCard = card.cloneNode(true);
    nextCard.children.middle.children.title.textContent = book.title == '' ? '????' : book.title;
    nextCard.children.middle.children.author.textContent = book.author == '' ? '????, ????' : book.author;
    nextCard.children.middle.children.pages.textContent = book.pages == '' ? '???pp.' : book.pages + ' pp.';
    nextCard.children.middle.children.year.textContent = book.year == '' ? 'c.????' : 'c.' + book.year;
    nextCard.children.left.children.category.textContent = book.category;
    nextCard.children.left.children.catalog.textContent = book.catalog;
    nextCard.children.left.children.reference.textContent = book.reference;
    console.log(book.reference);
    nextCard.children[0].textContent = book.author
      .split(' ')
      .map((it) => it[0])
      .join(', ');
    nextCard.children[0].style.left = count + 'rem';
    count += 4.1;
    if (document.querySelector("input[type='file']").files[0]) {
      nextCard.children.right.children[0].src = 
      URL.createObjectURL(document.querySelector("input[type='file']").files[0]);
    }
    nextCard.dataset.bookref = book.reference;
    nextCard.style.zIndex = myLibrary.indexOf(book) + 1;
    nextCard.children[0].style.backgroundColor = '#E0c9A6'
    card.parentNode.appendChild(nextCard);
    let bookref = nextCard.dataset.bookref;
    book.deleteCard(bookref);
    book.useTabs(bookref);
    book.resetForm();
  })
}