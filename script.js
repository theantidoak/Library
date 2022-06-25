let myLibrary = [];
const form = document.querySelector('form');
const cardCabinet = document.querySelector('.card-cabinet');
const card = document.querySelector('.card');
const btn = document.querySelector('.btn');
let nextCard;

// bookTitleInput.addEventListener('keydown', addBook);
btn.addEventListener('click', addBook)

class Book {
  constructor() {
    this.title = form.children.titleDiv.children.titleInput.value;
    this.author = form.children.authorDiv.children.authorInput.value;
    this.pages = form.children.pagesDiv.children.pagesInput.value;
    // this.category = form.children.catDiv.children
    this.year = form.children.yearDiv.children.yearInput.value;
    this.read = form.children.readDiv.children.readInput.value;
  }
  
  addTitle() {
    card.children.middle.children.title.textContent = bookTitleInput.value;
  }
  addAuthor() {
    card.children.middle.children.author.textContent = bookTitleInput.value;
  }
  addPages() {
    card.children.middle.children.pages.textContent = bookTitleInput.value;
  }
  chooseCategory() {
    card.children.middle.children.category.textContent = bookTitleInput.value;
  }
  addYear() {
    card.children.middle.children.year.textContent = bookTitleInput.value;
  }
  readOrNot() {
    card.children.middle.children.read.textContent = bookTitleInput.value;
  }

  addCard() {
    let nextCard = card.cloneNode(true);
    cardCabinet.appendChild(nextCard);
  }
}




function addBook() {
  let east = new Book()
  console.log(east);
}

// function addBook(e) {


//   if (e.key == 'Enter' || e.type == 'click') {
//     e.preventDefault();
//     myLibrary.push(bookTitleInput.value);
//     let nextCard = card.cloneNode(true);
//     card.children.middle.children.author.textContent = bookTitleInput.value;
//     cardCabinet.appendChild(nextCard);
//   }
// }

addBook.prototype = Object.create(Book.prototype);

