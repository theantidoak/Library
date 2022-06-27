let myLibrary = [];
let count = 0;
let topCount = 0;
let cardCabinet = document.querySelector('.card-cabinet');
const form = document.querySelector('form');
const card = document.querySelector('.card');
const btn = document.querySelector('.btn');
const formDisplay = document.querySelector('.display-form');
const main = document.querySelector('main');
const organizeButton = document.querySelector('.organize');
const firstCard = document.querySelector('.card');


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
    this.author = form.children.authorDiv.children.authorInput.value == '' ? '????' :
    form.children.authorDiv.children.authorInput.value
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
      console.log('hi');
      console.log(thisCard);
      [...thisCard.parentElement.children].forEach((card) => {
        card.style.zIndex = 1;
        card.children[0].style.backgroundColor = '#E0c9A6';
      });
      thisCard.style.zIndex = 2;
      thisCard.style.display = 'flex';
      thisCard.children[0].style.backgroundColor = '#ecd6b6';
    })
  }
  loopThroughLibrary() {
    myLibrary.forEach((book) => {
      if (book.isDisplayed == true) return;
      book.addCatalogNumber();
      book.addReferenceNumber();
      book.readOrNot();
      book.display();
      /*------ Create new card ------*/
      let nextCard = card.cloneNode(true);
      nextCard.children.middle.children.title.textContent = book.title == '' ? '????' : book.title;
      nextCard.children.middle.children.author.textContent = book.author = book.author;
      nextCard.children.middle.children.pages.textContent = book.pages == '' ? '???pp.' : book.pages + ' pp.';
      nextCard.children.middle.children.year.textContent = book.year == '' ? 'c.????' : 'c.' + book.year;
      nextCard.children.left.children.category.textContent = book.category;
      nextCard.children.left.children.catalog.textContent = book.catalog;
      nextCard.children.left.children.reference.textContent = book.reference;
      nextCard.children[0].textContent = book.author
        .split(' ')
        .map((it) => it[0])
        .join(', ');
  
      if (cardCabinet.children.length % 6 == 0 && cardCabinet.children.length != 1) {
        console.log(cardCabinet.children.length % 6);
        count = 0;
        topCount += 15;
      }
      nextCard.children[0].style.left = count + 'rem';
      nextCard.style.top = topCount + 'rem';
      count += 4.1;
      if (document.querySelector("input[type='file']").files[0]) {
        nextCard.children.right.children[0].src = 
        URL.createObjectURL(document.querySelector("input[type='file']").files[0]);
      }
      nextCard.dataset.bookref = book.reference;
      nextCard.style.zIndex = myLibrary.indexOf(book) + 1;
      [...cardCabinet.children].forEach((oldCards) => {
        if ([...cardCabinet.children][0] != oldCards) {
          oldCards.children[0].style.backgroundColor = '#E0c9A6'
        }});
  
      if (cardCabinet.children.length % 6 == 0) {
        let newCabinet = document.createElement('div');
        cardCabinet = newCabinet;
        main.appendChild(cardCabinet);
      } 
      cardCabinet.appendChild(nextCard);
      let bookref = nextCard.dataset.bookref;
      book.deleteCard(bookref);
      book.useTabs(bookref);
      book.resetForm();
    })
  }

}


/*------ Add Book to the array and display on page ------*/
function addBook() {
  let newBook = new Book();
  if (myLibrary.some((duplicate) => {
    if (duplicate.title == newBook.title && 
    duplicate.author == newBook.author &&
    duplicate.year == newBook.year &&
    duplicate.year == newBook.pages)
    return true;
  })) return;
  myLibrary.push(newBook);
  newBook.loopThroughLibrary();
  organizeButton.addEventListener('click', organizeBooks);
}

function organizeBooks() {
  count = 0;
  topCount = 0;
  myLibrary.forEach((book) => {
    book.isDisplayed = false;
  })
  myLibrary.sort((a, b) => a.author.localeCompare(b.author));
  [...main.children].forEach((child) => {
    if (child.tagName == 'DIV') {
      while (child.firstChild) {
        child.removeChild(child.lastChild);
      }
      child.parentElement.removeChild(child);
    }
    })
  cardCabinet.appendChild(firstCard);
  main.appendChild(cardCabinet);
  let newBook = new Book();
  newBook.loopThroughLibrary();
}