let myLibrary = [];
let myCabinets = [];
let allCards = [];

let count = 0;
let drawerCount = 1;
let svgDrawerCount = 1;
let menuContent;
let cardCabinet = document.querySelector('.card-cabinet');
myCabinets.push(cardCabinet);
const firstCard = document.querySelector('.card');
const form = document.querySelector('form');
const btn = document.querySelector('.btn');
const formDisplay = document.querySelector('.display-form');
const main = document.querySelector('main');
const organizeButton = document.querySelector('.organize');
const stackedCabinet = document.querySelector('.stacked-cabinet')
let cabinet = [];
let newDrawer = document.querySelector('.drawer').cloneNode(true);
newDrawer.id = svgDrawerCount;
stackedCabinet.appendChild(newDrawer);
newDrawer.style.transform = 'translateY(1rem) scale(1.05)';
cabinet.push(newDrawer);
const showCardButton = document.querySelector('.show-cards');

showCardButton.addEventListener('click', showCards);
let shown = false;

let menu = document.querySelector('menu');
let labels = [];

const exitFormButton = document.querySelector('.exit-form');

document.addEventListener('click', exitForm);



function exitForm(e) {
  if (exitFormButton.contains(e.target)) {
    form.style.display = 'none';
    [...form.parentNode.parentNode.children]
      .forEach((el) => [...el.children]
        .forEach((child) => child.style.filter = 'blur(0)'));
    form.reset();
  }
}

cabinet.forEach((drawer) => drawer.addEventListener('click', openDrawer));

function openDrawer() {
  if (this.style.transform == 'translateY(0px) scale(1)') {
    this.style.transform = 'translateY(1rem) scale(1.05)';
    this.style.zIndex = '2';
    myCabinets.forEach((drawer) => {
      if (this.id == drawer.dataset.drawer) {
        drawer.style.display = 'grid';
        if (shown) {
          drawer.style.display = 'grid';
        } else if (!shown) {
          drawer.classList.replace('card-cabinet-displayed', 'card-cabinet');
        }
      } 
    })
  } else if (this.style.transform == 'translateY(1rem) scale(1.05)') {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.zIndex = '1';
    myCabinets.forEach((drawer) => {
      if (this.id == drawer.dataset.drawer) {
        drawer.style.display = 'none';
      } 
    })
  }
  moveLabelWithDrawer();
}

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
  constructor(title, author, pages, year, category, read) {
    this.title = title
    this.author = author;
    this.pages = pages;
    this.year = year;
    this.category = category;
    this.read = read;
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
    allCards.forEach((card) => {
      if (card.isRead) return;
      let checked = card.querySelector('#left input');
      checked.checked = this.read == true ? true : false;
      card.isRead = true;
    })
    
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
    
    thisCard.addEventListener('click', (e) => {
      if (thisCard.children.right.children[1].contains(e.target)) return;
      myCabinets.forEach((card) => [...card.children].forEach((child) => {
        child.style.zIndex = allCards.indexOf(child);
        if (child.parentElement.classList.contains('card-cabinet')) { 
          if (thisCard == child) {
            child.style.zIndex = allCards.length;
            child.children.left.children[0].style.top = '5px';
            child.children.left.children[0].style.bottom = 'auto';
          } else if (allCards.indexOf(child) < allCards.indexOf(thisCard)) {
            child.style.zIndex = allCards.indexOf(child);
            child.children.left.children[0].style.top = '5px';
            child.children.left.children[0].style.bottom = 'auto';
          } else {
            child.style.zIndex = allCards.length - allCards.indexOf(child);
            child.children.left.children[0].style.bottom = '2px';
            child.children.left.children[0].style.top = 'auto';
          }
        }
        child.children[0].style.backgroundColor = '#a97e3e';
        child.style.backgroundColor = '#d7a963';
        card.style.zIndex = '1';
        if (thisCard.parentElement.dataset.drawer == card.dataset.drawer) {
          card.style.zIndex = myCabinets.length + 1;
        } else if (thisCard.parentElement.dataset.drawer < card.dataset.drawer) {
          card.style.zIndex = myCabinets.length - myCabinets.indexOf(card);
        } else {
          card.style.zIndex = myCabinets.indexOf(card);
        }
      }));
      
      thisCard.style.display = 'flex';
      thisCard.children[0].style.backgroundColor = '#ecd6b6';
      thisCard.style.backgroundColor = '#ecd6b6';
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
      const nextCard = firstCard.cloneNode(true);
      nextCard.children.middle.children.title.textContent = book.title == '' ? 'Title?' : book.title;
      nextCard.children.middle.children.author.textContent = book.author = book.author;
      nextCard.children.middle.children.pages.textContent = book.pages == '' ? '???pp.' : book.pages + ' pp.';
      nextCard.children.middle.children.year.textContent = book.year == '' ? 'c.????' : 'c.' + book.year;
      nextCard.children.left.children.category.textContent = book.category;
      nextCard.children.left.children.catalog.textContent = book.catalog;
      nextCard.children.left.children.reference.textContent = book.reference;
      nextCard.children[0].textContent = book.author
        .split(' ')
        .filter((bok) => {
          if (book.author.split(' ').indexOf(bok) == 0 || book.author.split(' ').indexOf(bok) == book.author.split(' ').length - 1) {
              return bok;
          }
      })
        .map((it) => it[0])
        .join(', ');
  
      if (cardCabinet.children.length % 6 == 0 && cardCabinet.children.length != 0) {
        count = 0;
      }
      
      nextCard.children[0].style.left = count + 'rem';
      count += 4.2;
      if (document.querySelector("input[type='file']").files[0]) {
        nextCard.children.right.children[0].src = 
        URL.createObjectURL(document.querySelector("input[type='file']").files[0]);
      }
      nextCard.dataset.bookref = book.reference;
      nextCard.style.zIndex = myLibrary.indexOf(book) + 1;
      [...cardCabinet.children].forEach((oldCards) => {
        oldCards.children[0].style.backgroundColor = '#a97e3e';
        oldCards.style.backgroundColor = '#d7a963';
      })
      if (cardCabinet.children.length % 6 == 0 && cardCabinet.children.length != 0) {
        drawerCount += 1;
        svgDrawerCount += 1;
        cardCabinet.style.display = 'none';
        newDrawer.style.transform = 'translateY(0) scale(1)';
        
        let lastOrderName = cardCabinet.children[5].children.middle.children.author.textContent.split(' ');
        
        let secondMenuContent = document.createTextNode(lastOrderName.filter((bok) => {
          if (lastOrderName.indexOf(bok) == 0 || lastOrderName.indexOf(bok) == lastOrderName.length - 1) {
              return bok;}}).map((it) => it[0]));
        cardCabinet = document.createElement('div');
        cardCabinet.classList.add('card-cabinet');
        myCabinets.push(cardCabinet);
        main.appendChild(cardCabinet);
        newDrawer = document.querySelector('.drawer').cloneNode(true);
        newDrawer.id = svgDrawerCount;
        newDrawer.style.transform = 'translateY(1rem) scale(1.05)';
        
        stackedCabinet.appendChild(newDrawer);
        cabinet.push(newDrawer);
        cabinet.forEach((drawer) => drawer.addEventListener('click', openDrawer));
        menuContent.appendChild(secondMenuContent);
        if (cabinet.length > 3) {
          cabinet[0].parentElement.style.position = 'absolute';
        }
      } 

      cardCabinet.dataset.drawer = drawerCount;
      if (shown) {
        nextCard.style.position = 'relative';
        myCabinets.forEach((drawer) => drawer.classList.replace('card-cabinet', 'card-cabinet-displayed'));
      }
      cardCabinet.appendChild(nextCard);
      allCards.push(nextCard);
      if (shown) {
        cardCabinet.children[cardCabinet.children.length-1].style.left = 0; 
      }
      if (cardCabinet.children.length == 1) {
        let firstOrderName = cardCabinet.children[0].children.middle.children.author.textContent.split(' ');
        let firstMenuContent = document.createTextNode(firstOrderName.filter((bok) => {
          if (firstOrderName.indexOf(bok) == 0 || firstOrderName.indexOf(bok) == firstOrderName.length - 1) {
              return bok;}}).map((it) => it[0]) + ' - ');
        menuContent = document.createElement('li');
        menuContent.appendChild(firstMenuContent);
        
        labels.push(menuContent);
        menu.appendChild(menuContent);
      }

      let bookref = nextCard.dataset.bookref;
      book.deleteCard(bookref);
      book.useTabs(bookref);
      book.resetForm();
    })
    moveLabelWithDrawer();
  } 
}


/*------ Add Book to the array and display on page ------*/
function addBook(title, author, pages, year, category, read) {
  let newBook;
  let thisAuthor;
  if (this.type == 'button') {
    newBook = new Book();
    newBook.title = form.children.titleDiv.children.titleInput.value;  
    thisAuthor = form.children.authorDiv.children.authorInput.value
      .replace(/\s{2,}/g, ' ').trim().split(' ');
    
    newBook.pages = form.children.pagesDiv.children.pagesInput.value;
    newBook.year = form.children.yearDiv.children.yearInput.value;
    newBook.category = document.querySelector("form input[name='cat']:checked").value;
    newBook.read = form.children.readDiv.children.readInput.checked;
  } else {
    newBook = new Book(title, author, pages, year, category, read);
    thisAuthor = newBook.author.replace(/\s{2,}/g, ' ').trim().split(' ');
  }
    
    if (thisAuthor == '') {
      thisAuthor = 'Author?'
    } else {
      thisAuthor = thisAuthor.map((up) => up[0].toUpperCase().concat(up.substring(1)));
      thisAuthor.unshift(thisAuthor.pop() + ',')
      thisAuthor = thisAuthor.join(' ');
    }
    newBook.author = thisAuthor;

  if (myLibrary.some((duplicate) => {
    if (duplicate.title == newBook.title && 
    duplicate.author == newBook.author &&
    duplicate.year == newBook.year &&
    duplicate.pages == newBook.pages)
    return true;
  })) return;
  myLibrary.push(newBook);
  newBook.loopThroughLibrary();
}

organizeButton.addEventListener('click', organizeBooks);

function organizeBooks() {
  count = 0;
  drawerCount = 1;
  svgDrawerCount = 1;
  myCabinets = [];
  cabinet = [];
  labels = [];
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
  });
  menu = document.createElement('menu');
  

  cabinet.push(newDrawer);
  myCabinets.push(cardCabinet);
  newDrawer.id = svgDrawerCount;
  stackedCabinet.appendChild(menu);
  stackedCabinet.appendChild(newDrawer);
  main.appendChild(stackedCabinet);
  main.appendChild(cardCabinet);
  let newBook = new Book();
  newBook.loopThroughLibrary();
}

function moveLabelWithDrawer() {

  if (labels.length < 1) return;
  cabinet.forEach((drawer) => {
    if (drawer.style.transform == 'translateY(0px) scale(1)') {
      let index = cabinet.indexOf(drawer);
      if (labels[index] == undefined) return;
      let label = labels[index];
      label.style.transform = 'translateY(0px) scale(1)';
    } else if (drawer.style.transform == 'translateY(1rem) scale(1.05)') {
      let index = cabinet.indexOf(drawer);
      if (labels[index] == undefined) return;
      let label = labels[index];
      label.style.transform = 'translateY(1rem) scale(1.05)';
    }
  })
}



function showCards() {
  const gridSVG = document.querySelector('.grid-svg');
  const tabsSVG = document.querySelector('.tabs-svg');
  
  if (!shown) {
    gridSVG.style.display = 'block';
    tabsSVG.style.display = 'none';
    myCabinets.forEach((cabinet) => {
      cabinet.classList.replace('card-cabinet', 'card-cabinet-displayed');
      if (window.innerWidth < 600) return;
      [...cabinet.children].forEach((child) => {
        child.style.position = 'relative';
        child.style.left = '0';
      })
    })
  } else if (shown) {
    gridSVG.style.display = 'none';
    tabsSVG.style.display = 'block';
    myCabinets.forEach((cabinet) => {
      cabinet.classList.replace('card-cabinet-displayed', 'card-cabinet');
      if (window.innerWidth < 600) return;
      [...cabinet.children].forEach((child) => {
        child.style.position = 'absolute';
        child.style.left = '.5rem';
      })
    })
  }
  shown = !shown;
}

const populateButton = document.querySelector('.populate');
populateButton.addEventListener('click', populateLibrary);

function populateLibrary() {
  // title, author, pages, year, category, read
  addBook("The Wind-Up Bird Chronicle", "Haruki Murakami", "607", "1995", "Fiction", true);
  addBook("War and Peace", "Leo Tolstoy", "1225", "1867", "Fiction", true);
  addBook("Dune", "Frank Herbert", "412", "1965", "Fiction", true);
  addBook("East of Eden", "John Steinbeck", "704", "1952", "Fiction", true);
  addBook("The Count of Monte Cristo", "Alexandre Dumas", "636", "1846", "Fiction", true);
  addBook("Kafka on the Shore", "Haruki Murakami", "505", "2002", "Fiction", true);
  addBook("Fathers and Sons", "Ivan Turgenev", "226", "1862", "Fiction", true);
  addBook("The Brothers Karamazov", "Fyodor Dostoevsky", "824", "1880", "Fiction", true);
  addBook("Treasure Island", "Robert Louis Stevenson", "292", "1883", "Fiction", true);
  addBook("The Castle", "Franz Kafka", "416", "1926", "Fiction", true);
  addBook("Crime and Punishment", "Fyodor Dostoevsky", "492", "1866", "Fiction", true);
  addBook("Anna Karenina", "Leo Tolstoy", "864", "1878", "Fiction", true);
  addBook("A Gentleman in Moscow", "Amor Towles", "462", "2016", "Fiction", true);
  addBook("Master and Commander", "Patrick O'Brian", "412", "1969", "Fiction", true);
  addBook("The Trial", "Franz Kafka", "178", "1925", "Fiction", true);
  addBook("All the Light We Cannot See", "Anthony Doerr", "544", "2014", "Fiction", true);
  addBook("Flashman", "George MacDonald Fraser", "256", "1969", "Fiction", true);
  addBook("The Garden of Evening Mists", "Tan Twan Eng", "448", "2012", "Fiction", true);
  organizeBooks();
  myCabinets.forEach((cabinet) => cabinet.style.display = 'grid');
  cabinet.forEach((drawer) => drawer.style.transform = 'translateY(1rem) scale(1.05)');
  moveLabelWithDrawer();
}