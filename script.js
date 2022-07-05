let gridShown = false;
let drawerCount = 1;
let svgDrawerCount = 1;
let myLibrary = [];
let allCards = [];
let fileCabinet = [];
let whiteLabel;
let drawerDiv;

let cardCabinet = document.querySelector('.card-cabinet');
let myCabinets = [cardCabinet];

const firstCard = document.querySelector('.card');
const form = document.querySelector('form');
const main = document.querySelector('main');
const stackedCabinet = document.querySelector('.stacked-cabinet');

const addBookBtn = document.querySelector('.btn');
addBookBtn.addEventListener('click', addBook);

const formDisplay = document.querySelector('.display-form');
formDisplay.addEventListener('click', displayForm);

const organizeButton = document.querySelector('.organize');
organizeButton.addEventListener('click', organizeBooks);

const showCardButton = document.querySelector('.show-cards');
showCardButton.addEventListener('click', showCards);

const exitFormButton = document.querySelector('.exit-form');
exitFormButton.addEventListener('click', exitForm);

const populateButton = document.querySelector('.populate');
populateButton.addEventListener('click', populateLibrary);


/*------ Create Book Object ------*/
class Book {
  constructor(title, author, pages, year, category, read, image) {
    this.title = title
    this.author = author;
    this.pages = pages;
    this.year = year;
    this.category = category;
    this.read = read;
    this.image = image;
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
    let nextCard = document.querySelector(`article[data-bookref="${bookref}"]`);
    nextCard.children.right.children[1].addEventListener('click', () => {
      nextCard.parentNode.removeChild(nextCard);
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
    let nextCard = document.querySelector(`article[data-bookref="${bookref}"]`);
    nextCard.addEventListener('click', (e) => {
      const deleteCardBtn = nextCard.children.right.children[1];
      if (deleteCardBtn.contains(e.target)) return;
      myCabinets.forEach((thisCardCabinet) => [...thisCardCabinet.children]
        .forEach((card) => {
        if (card.parentElement.classList.contains('card-cabinet') &&
          window.innerWidth < 600) { 
            card.style.zIndex = allCards.indexOf(card);
            let catalogNum = card.children.left.children[0];
          if (nextCard == card) {
            card.style.zIndex = allCards.length;
            catalogNum.style.top = '5px';
            catalogNum.style.bottom = 'auto';
          } else if (allCards.indexOf(card) < allCards.indexOf(nextCard)) {
            card.style.zIndex = allCards.indexOf(card);
            catalogNum.style.top = '5px';
            catalogNum.style.bottom = 'auto';
          } else {
            card.style.zIndex = allCards.length - allCards.indexOf(card);
            catalogNum.style.bottom = '2px';
            catalogNum.style.top = 'auto';
          }
        } else {
          if (card == nextCard) {
            card.style.zIndex = '2';
          } else if (card.parentElement == nextCard.parentElement) {
            card.style.zIndex = '1';
          }
        }
        card.children[0].style.backgroundColor = '#9c6b22';
        card.style.backgroundColor = '#d7a963';
        if (nextCard.parentElement.dataset.drawer == thisCardCabinet.dataset.drawer) {
          thisCardCabinet.style.zIndex = myCabinets.length;
        } else if (nextCard.parentElement.dataset.drawer < thisCardCabinet.dataset.drawer) {
          thisCardCabinet.style.zIndex = myCabinets.length - myCabinets.indexOf(thisCardCabinet);
        } else {
          thisCardCabinet.style.zIndex = myCabinets.indexOf(thisCardCabinet);
        }
      }));
      nextCard.style.display = 'flex';
      nextCard.children[0].style.backgroundColor = 'var(--card-color)';
      nextCard.style.backgroundColor = 'var(--card-color)';
    })
  }
  /*------ Function for creating and appending book cards and cabinets ------*/ 
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
      nextCard.children.right.children[0].src = book.image;
      /*------ Create initials tab for card ------*/
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
      
      if (cardCabinet.children.length == 1) {
        /*------ Create new cabinet drawer ------*/
        drawerDiv = document.querySelector('#drawer-template').cloneNode(true);
        drawerDiv.id = svgDrawerCount;
        drawerDiv.style.transform = 'var(--open-drawer)';
        drawerDiv.style.zIndex = '2';
        drawerDiv.addEventListener('click', openDrawer);
        fileCabinet.push(drawerDiv);
        /*------ Add label with first initials to cabinet drawer------*/
        let firstInitials = cardCabinet.children[0].children.middle.children.author.textContent.split(' ');
        let firstInitialsText = document.createTextNode(firstInitials.filter((bok) => {
          if (firstInitials.indexOf(bok) == 0 || firstInitials.indexOf(bok) == firstInitials.length - 1) {
              return bok;}}).map((it) => it[0]) + ' - ');
        whiteLabel = document.createElement('p');
        whiteLabel.appendChild(firstInitialsText);
        drawerDiv.appendChild(whiteLabel);
        stackedCabinet.appendChild(drawerDiv);
        stackedCabinet.style.position = window.innerHeight - stackedCabinet.offsetHeight < '122' ? 
          'absolute': 'fixed';

        main.appendChild(cardCabinet);
        myCabinets.push(cardCabinet);
        centerCards();
      } else if (cardCabinet.children.length % 6 == 0 && cardCabinet.children.length != 0) {
        drawerCount += 1;
        svgDrawerCount += 1;
        /*------ Add ending intials to cabinet drawer label ------*/
        let secondInitials = cardCabinet.children[5].children.middle.children.author.textContent.split(' ');
        let secondInitialsText = document.createTextNode(secondInitials.filter((bok) => {
          if (secondInitials.indexOf(bok) == 0 || secondInitials.indexOf(bok) == secondInitials.length - 1) {
            return bok;}}).map((it) => it[0]));
        whiteLabel.appendChild(secondInitialsText);
        /*------ Create new card cabinet ------*/
        cardCabinet = document.createElement('div');
        cardCabinet.classList.add('card-cabinet');
      }
      if (gridShown) {
        nextCard.style.position = 'relative';
        myCabinets.forEach((thisCardCabinet) => thisCardCabinet.classList.replace('card-cabinet', 'card-cabinet-displayed'));
      }
      cardCabinet.dataset.drawer = drawerCount;
      let bookref = nextCard.dataset.bookref;
      allCards.push(nextCard);
      book.deleteCard(bookref);
      book.useTabs(bookref);
      book.resetForm();
    })
  } 
}


/*------ Add Book to the array and display on page ------*/
function addBook(title, author, pages, year, category, read, image) {
  let newBook;
  let thisAuthor;
  /*------ If data comes from the Add book form ------*/
  if (this.type == 'button') {
    newBook = new Book();
    newBook.title = form.children.titleDiv.children.titleInput.value;  
    thisAuthor = form.children.authorDiv.children.authorInput.value
      .replace(/\s{2,}/g, ' ').trim().split(' ');  
    newBook.pages = form.children.pagesDiv.children.pagesInput.value;
    newBook.year = form.children.yearDiv.children.yearInput.value;
    newBook.category = document.querySelector("form input[name='cat']:checked").value;
    newBook.read = form.children.readDiv.children.readInput.checked;
    newBook.image = document.querySelector("input[type='file']").files[0] ? 
      URL.createObjectURL(document.querySelector("input[type='file']").files[0]) : 
      firstCard.children.right.children[0].src;
  } else {
    /*------ If data comes from internal source ------*/
    newBook = new Book(title, author, pages, year, category, read, image);
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


/*------ Open the drawer and display the card cabinet ------*/
function openDrawer() {
  if (this.style.transform == 'var(--closed-drawer)') {
    this.style.transform = 'var(--open-drawer)';
    this.style.zIndex = '2';
    this.children[0].style.backgroundColor = 'var(--open-drawer-color)';
    myCabinets.forEach((thisCardCabinet) => {
      if (this.id == thisCardCabinet.dataset.drawer) {
        thisCardCabinet.style.display = 'grid';
        if (!gridShown) {
          thisCardCabinet.classList.replace('card-cabinet-displayed', 'card-cabinet');
        }
      } 
    })
  } else if (this.style.transform == 'var(--open-drawer)') {
    this.style.transform = 'var(--closed-drawer)';
    this.style.zIndex = '1';
    this.children[0].style.backgroundColor = 'var(--closed-drawer-color)';
    myCabinets.forEach((thisCardCabinet) => {
      if (this.id == thisCardCabinet.dataset.drawer) {
        thisCardCabinet.style.display = 'none';
      } 
    })
  }
  centerCards();
}

/*------ Display the Add book form ------*/
function displayForm() {
  [...form.parentNode.parentNode.children]
    .forEach((el) => [...el.children]
      .forEach((child) => child.style.filter = 'blur(2px)'));
  form.style.display = 'flex';
  form.style.filter = 'blur(0)';
}

/*------ Delete button on the Add book form ------*/
function exitForm() {
  form.style.display = 'none';
  [...form.parentNode.parentNode.children]
    .forEach((el) => [...el.children]
      .forEach((child) => child.style.filter = 'blur(0)'));
  form.reset();
}


/*------ Use some of my favorite books to populate the library ------*/
function populateLibrary() {
  // title, author, pages, year, category, read, image
  addBook("The Wind-Up Bird Chronicle", "Haruki Murakami", "607", "1995", "Fiction", false, "photos/thewindupbirdchronicle.jpg");
  addBook("War and Peace", "Leo Tolstoy", "1225", "1867", "Fiction", false, "photos/warandpeace.jpg");
  addBook("Dune", "Frank Herbert", "412", "1965", "Fiction", false, "photos/dune.jpg");
  addBook("The Count of Monte Cristo", "Alexandre Dumas", "636", "1846", "Fiction", false, "photos/thecountofmontecristo.jpg");
  addBook("Kafka on the Shore", "Haruki Murakami", "505", "2002", "Fiction", false, "photos/kafkaontheshore.jpg");
  addBook("East of Eden", "John Steinbeck", "704", "1952", "Fiction", true, "photos/east of eden.jpg");
  addBook("Fathers and Sons", "Ivan Turgenev", "226", "1862", "Fiction", false, "photos/fathersandsons.jpg");
  addBook("The Brothers Karamazov", "Fyodor Dostoevsky", "824", "1880", "Fiction", false, "photos/brotherskaramazov.jpg");
  addBook("Treasure Island", "Robert Louis Stevenson", "292", "1883", "Fiction", false, "photos/treasureisland.jpg");
  addBook("The Castle", "Franz Kafka", "416", "1926", "Fiction", false, "photos/thecastle.jpg");
  addBook("Crime and Punishment", "Fyodor Dostoevsky", "492", "1866", "Fiction", false, "photos/crimeandpunshment.jpg");
  addBook("A Gentleman in Moscow", "Amor Towles", "462", "2016", "Fiction", false, "photos/agentlemaninmoscow.jpg");
  addBook("Anna Karenina", "Leo Tolstoy", "864", "1878", "Fiction", false, "photos/annakarenina.jpg");
  addBook("Master and Commander", "Patrick O'Brian", "412", "1969", "Fiction", false, "photos/masterandcommander.jpg");
  addBook("The Trial", "Franz Kafka", "178", "1925", "Fiction", false, "photos/thetrial.jpg");
  addBook("All the Light We Cannot See", "Anthony Doerr", "544", "2014", "Fiction", false, "photos/all the light.jpg");
  addBook("Flashman", "George MacDonald Fraser", "256", "1969", "Fiction", false, "photos/flashman.jpg");
  addBook("The Garden of Evening Mists", "Tan Twan Eng", "448", "2012", "Fiction", true, "photos/thegardenofeveningmists.jpg");
  organizeBooks();
  myCabinets.forEach((thisCardCabinet) => thisCardCabinet.style.display = 'grid');
  fileCabinet.forEach((drawer) => drawer.style.transform = 'var(--open-drawer)');
}


/*------ Sort Alphabetically ------*/
function organizeBooks() {
  drawerCount = 1;
  svgDrawerCount = 1;
  myCabinets = [];
  fileCabinet = [];
  allCards = [];
  myLibrary.forEach((book) => {
    book.isDisplayed = false;
  });

  this.tagName == 'BUTTON' ? myLibrary.sort((a, b) => a.author.localeCompare(b.author)) :
    null;
  
  [...main.children].forEach((child) => {
    if (child.tagName == 'DIV') {
      while (child.firstChild) {
        child.removeChild(child.lastChild);
      }
      child.parentElement.removeChild(child);
    }
  });
  
  myCabinets.push(cardCabinet); 
  main.appendChild(stackedCabinet);
  main.appendChild(cardCabinet);
  new Book().loopThroughLibrary();
}


/*------ Display the cards in grid format or tab format ------*/
function showCards() {
  const gridSVG = document.querySelector('.grid-svg');
  const tabsSVG = document.querySelector('.tabs-svg');
  if (!gridShown) {
    gridSVG.style.display = 'block';
    tabsSVG.style.display = 'none';
    main.style.paddingLeft = 'clamp(2.25rem, 100vw - 21rem, 11rem)';
    myCabinets.forEach((thisCardCabinet) => {
      thisCardCabinet.classList.replace('card-cabinet', 'card-cabinet-displayed');
      if (window.innerWidth < 600) return;
      [...thisCardCabinet.children].forEach((child) => {
        child.style.position = 'relative';
      })
    })
  } else if (gridShown) {
    gridSVG.style.display = 'none';
    tabsSVG.style.display = 'block';
    myCabinets.forEach((thisCardCabinet) => {
      thisCardCabinet.classList.replace('card-cabinet-displayed', 'card-cabinet');
      if (window.innerWidth < 600) return;
      [...thisCardCabinet.children].forEach((child) => {
        child.style.position = 'absolute';
      })
    })
    centerCards();
  }
  gridShown = !gridShown;
}


/*--- Center the cards on the page when only one drawer is open ---*/
function centerCards() {
  if (window.innerWidth < 800) return;
  if (gridShown) return;
  let openDrawers = fileCabinet.filter((label) => label.style.transform == 
    'var(--open-drawer)').length;
  main.style.paddingLeft = openDrawers == 1 ? '1.5rem' : 
    'clamp(2.25rem, 100vw - 21rem, 11rem)';
}