let myLibrary = [];
let allCards = [];
let labels = [];
let gridShown = false;
let drawerCount = 1;
let svgDrawerCount = 1;

const firstCard = document.querySelector('.card');
const form = document.querySelector('form');

const addBookBtn = document.querySelector('.btn');
addBookBtn.addEventListener('click', addBook);

const formDisplay = document.querySelector('.display-form');
formDisplay.addEventListener('click', displayForm);

const main = document.querySelector('main');
const stackedCabinet = document.querySelector('.stacked-cabinet');

const organizeButton = document.querySelector('.organize');
organizeButton.addEventListener('click', organizeBooks);

const showCardButton = document.querySelector('.show-cards');
showCardButton.addEventListener('click', showCards);

const exitFormButton = document.querySelector('.exit-form');
document.addEventListener('click', exitForm);

const populateButton = document.querySelector('.populate');
populateButton.addEventListener('click', populateLibrary);

let menu = document.querySelector('menu');
let menuContent;

let cardCabinet = document.querySelector('.card-cabinet');
let myCabinets = [cardCabinet];

let newDrawer = document.querySelector('.drawer').cloneNode(true);
newDrawer.id = svgDrawerCount;
stackedCabinet.appendChild(newDrawer);
newDrawer.style.transform = 'translateY(1rem) scale(1.05)';
let fileCabinet = [newDrawer];
fileCabinet.forEach((drawer) => drawer.addEventListener('click', openDrawer));


/*------ Create Book Object ------*/
class Book {
  constructor(title, author, pages, year, category, read, img) {
    this.title = title
    this.author = author;
    this.pages = pages;
    this.year = year;
    this.category = category;
    this.read = read;
    this.img = img;
  }
  addReferenceNumber() {
    this.reference = this.author.substring(0, 2).toUpperCase() + 
      Math.floor(10 + Math.random() * 90) +
      this.title.charAt(0).toUpperCase() + Math.floor(Math.random() * 9);
  }
  addCatalogNumber() {
    this.catalog = '#' + (myLibrary.indexOf(this) + 1).toString().padStart(4, '0');
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
      const deleteCardBtn = thisCard.children.right.children[1];
      if (deleteCardBtn.contains(e.target)) return;
      myCabinets.forEach((thisCardCabinet) => [...thisCardCabinet.children].forEach((card) => {
        if (card.parentElement.classList.contains('card-cabinet') &&
          window.innerWidth < 600) { 
            card.style.zIndex = allCards.indexOf(card);
            let catalogNum = card.children.left.children[0];
          if (thisCard == card) {
            card.style.zIndex = allCards.length;
            catalogNum.style.top = '5px';
            catalogNum.style.bottom = 'auto';
          } else if (allCards.indexOf(card) < allCards.indexOf(thisCard)) {
            card.style.zIndex = allCards.indexOf(card);
            catalogNum.style.top = '5px';
            catalogNum.style.bottom = 'auto';
          } else {
            card.style.zIndex = allCards.length - allCards.indexOf(card);
            catalogNum.style.bottom = '2px';
            catalogNum.style.top = 'auto';
          }
        } else {
          if (card == thisCard) {
            card.style.zIndex = '2';
          } else if (card.parentElement == thisCard.parentElement) {
            card.style.zIndex = '1';
          }
        }
        thisCardCabinet.style.zIndex = '1';
        card.children[0].style.backgroundColor = '#a97e3e';
        card.style.backgroundColor = '#d7a963';
        if (thisCard.parentElement.dataset.drawer == thisCardCabinet.dataset.drawer) {
          thisCardCabinet.style.zIndex = myCabinets.length + 1;
        } else if (thisCard.parentElement.dataset.drawer < thisCardCabinet.dataset.drawer) {
          thisCardCabinet.style.zIndex = myCabinets.length - myCabinets.indexOf(thisCardCabinet);
        } else {
          thisCardCabinet.style.zIndex = myCabinets.indexOf(thisCardCabinet);
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
      book.display();
      
      /*------ Create new card ------*/
      const nextCard = firstCard.cloneNode(true);
      nextCard.children.middle.children.title.textContent = book.title == '' ? 'Title?' : book.title;
      nextCard.children.middle.children.pages.textContent = book.pages == '' ? '???pp.' : book.pages + ' pp.';
      nextCard.children.middle.children.year.textContent = book.year == '' ? 'c.????' : 'c.' + book.year;
      nextCard.children.left.children.category.textContent = book.category;
      nextCard.children.left.children.catalog.textContent = book.catalog;
      nextCard.children.left.children.reference.textContent = book.reference;
      nextCard.children.left.children[3].children[0].checked = book.read;
      nextCard.children.middle.children.author.textContent = book.author;
      nextCard.children.right.children[0].src = book.img;
      
      // Tab with Initials
      nextCard.children[0].textContent = book.author.split(' ')
        .filter((bok) => {
          if (book.author.split(' ').indexOf(bok) == 0 || 
            book.author.split(' ').indexOf(bok) == book.author.split(' ').length - 1) {
              return bok;
          }})
        .map((it) => it[0])
        .join(', ');
      nextCard.dataset.bookref = book.reference;
      nextCard.style.zIndex = myLibrary.indexOf(book) + 1;
      nextCard.children[0].style.left = (cardCabinet.children.length * 4.2) + 'rem';
      cardCabinet.appendChild(nextCard);
      cardCabinet.dataset.drawer = drawerCount;

      if (cardCabinet.children.length == 1) {

        // Add label with first initials to cabinet drawer
        let firstInitials = cardCabinet.children[0].children.middle.children.author.textContent.split(' ');
        let firstInitialsText = document.createTextNode(firstInitials.filter((bok) => {
          if (firstInitials.indexOf(bok) == 0 || firstInitials.indexOf(bok) == firstInitials.length - 1) {
              return bok;}}).map((it) => it[0]) + ' - ');
        menuContent = document.createElement('li');
        menuContent.appendChild(firstInitialsText); 
        menu.appendChild(menuContent);
        labels.push(menuContent);
      } else if (cardCabinet.children.length % 6 == 0 && cardCabinet.children.length != 0) {
        
        // Data-attribute for card-cabinet and drawer
        drawerCount += 1;
        svgDrawerCount += 1;
        newDrawer.style.transform = 'translateY(0) scale(1)';

        // Add ending intials to cabinet drawer
        let secondInitials = cardCabinet.children[5].children.middle.children.author.textContent.split(' ');
        let secondInitialsText = document.createTextNode(secondInitials.filter((bok) => {
          if (secondInitials.indexOf(bok) == 0 || secondInitials.indexOf(bok) == secondInitials.length - 1) {
            return bok;}}).map((it) => it[0]));
        menuContent.appendChild(secondInitialsText);
        
        // Create new card cabinet
        cardCabinet = document.createElement('div');
        cardCabinet.classList.add('card-cabinet');
        main.appendChild(cardCabinet);
        myCabinets.push(cardCabinet);
        
        // Create new cabinet drawer
        newDrawer = document.querySelector('.drawer').cloneNode(true);
        newDrawer.id = svgDrawerCount;
        newDrawer.style.transform = 'translateY(1rem) scale(1.05)';
        stackedCabinet.appendChild(newDrawer);
        fileCabinet.push(newDrawer);
        newDrawer.addEventListener('click', openDrawer);
        
        fileCabinet[0].parentElement.style.position = fileCabinet.length > 3 ? 
          'absolute': 'fixed';
      }
      if (gridShown) {
        nextCard.style.position = 'relative';
        myCabinets.forEach((drawer) => drawer.classList.replace('card-cabinet', 'card-cabinet-displayed'));
      }
      let bookref = nextCard.dataset.bookref;
      allCards.push(nextCard);
      book.deleteCard(bookref);
      book.useTabs(bookref);
      book.resetForm();
    })
    moveLabelWithDrawer();
  } 
}

function exitForm(e) {

  if (exitFormButton.contains(e.target)) {
    form.style.display = 'none';
    [...form.parentNode.parentNode.children]
      .forEach((el) => [...el.children]
        .forEach((child) => child.style.filter = 'blur(0)'));
    form.reset();
  }
}


function openDrawer() {

  if (this.style.transform == 'translateY(0px) scale(1)') {
    this.style.transform = 'translateY(1rem) scale(1.05)';
    this.style.zIndex = '2';
    myCabinets.forEach((drawer) => {
      if (this.id == drawer.dataset.drawer) {
        drawer.style.display = 'grid';
        if (!gridShown) {
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

function displayForm() {
  [...form.parentNode.parentNode.children]
    .forEach((el) => [...el.children]
      .forEach((child) => child.style.filter = 'blur(2px)'));
  form.style.display = 'flex';
  form.style.filter = 'blur(0)';
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
    newBook.img = document.querySelector("input[type='file']").files[0] ? 
      URL.createObjectURL(document.querySelector("input[type='file']").files[0]) : 
      firstCard.children.right.children[0].src;
  } else {
    newBook = new Book(title, author, pages, year, category, read);
    newBook.img = "photos/pexels-olena-bohovyk-3646105.jpg";
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


function organizeBooks() {
  drawerCount = 1;
  svgDrawerCount = 1;
  myCabinets = [];
  fileCabinet = [];
  labels = [];
  myLibrary.forEach((book) => {
    book.isDisplayed = false;
  });
  
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
  

  fileCabinet.push(newDrawer);
  myCabinets.push(cardCabinet);
  newDrawer.id = svgDrawerCount;
  stackedCabinet.appendChild(menu);
  stackedCabinet.appendChild(newDrawer);
  main.appendChild(stackedCabinet);
  main.appendChild(cardCabinet);
  new Book().loopThroughLibrary();
}


function moveLabelWithDrawer() {

  if (labels.length < 1) return;
  fileCabinet.forEach((drawer) => {
    let index = fileCabinet.indexOf(drawer);
    if (labels[index] == undefined) return;
    let label = labels[index];
    if (drawer.style.transform == 'translateY(0px) scale(1)') {
      label.style.transform = 'translateY(0px) scale(1)';
    } else if (drawer.style.transform == 'translateY(1rem) scale(1.05)') {
      label.style.transform = 'translateY(1rem) scale(1.05)';
    }
  })
}


function showCards() {
  const gridSVG = document.querySelector('.grid-svg');
  const tabsSVG = document.querySelector('.tabs-svg');
  
  if (!gridShown) {
    gridSVG.style.display = 'block';
    tabsSVG.style.display = 'none';
    myCabinets.forEach((cabinet) => {
      cabinet.classList.replace('card-cabinet', 'card-cabinet-displayed');
      if (window.innerWidth < 600) return;
      [...cabinet.children].forEach((child) => {
        child.style.position = 'relative';
      })
    })
  } else if (gridShown) {
    gridSVG.style.display = 'none';
    tabsSVG.style.display = 'block';
    myCabinets.forEach((cabinet) => {
      cabinet.classList.replace('card-cabinet-displayed', 'card-cabinet');
      if (window.innerWidth < 600) return;
      [...cabinet.children].forEach((child) => {
        child.style.position = 'absolute';
      })
    })
  }
  gridShown = !gridShown;
}


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
  fileCabinet.forEach((drawer) => drawer.style.transform = 'translateY(1rem) scale(1.05)');
  moveLabelWithDrawer();
}