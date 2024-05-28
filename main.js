const inputbuku = document.querySelector("#inputbuku");
const addButton = document.getElementById("tbhbuku");
const closeinputbuku = document.getElementById("close");
const tombolcariButton = document.getElementById("searchSubmit");
const tombolcariinput = document.getElementById('tittlebook');
const UNCOMPLETED_BOOK_ID = "Blm_Dibaca";
const COMPLETED_BOOK_ID = "Sdh_Dibaca";
const BOOK_ITEMID = "itemId";

const addBook = () => {
  const uncompletedBook = document.getElementById(UNCOMPLETED_BOOK_ID);
  const masukanjudul = document.getElementById("title").value;
  const masukanpenulis = document.getElementById("author").value;
  const masukantahun = document.getElementById("year").value;

  const book = makeBook(masukanjudul, masukanpenulis, masukantahun, false);
  const bookObject = composeBookObject(
    masukanjudul,
    masukanpenulis,
    masukantahun,
    false
  );

  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  uncompletedBook.append(book);
  updateDataToStorage();
};

const makeBook = (title, author, year, isCompleted) => {
  const judulbuku = document.createElement("h3");
  judulbuku.innerText = title;

  const namapenulis = document.createElement("p");
  namapenulis.innerText = author;

  const tahunbuku = document.createElement("small");
  tahunbuku.innerText = year;

  const detail = document.createElement("div");
  detail.classList.add("detail-book");
  detail.append(judulbuku, namapenulis, tahunbuku);

  const container = document.createElement("div");
  container.classList.add("infobuku");
  container.append(detail);

  if (isCompleted) {
      container.append(createBlm_DibacaButton(), createTrashButton());
  } else {
      container.append(createSdh_DibacaButton(), createTrashButton());
  }

  return container;
};

const createButton = (buttonTypeClass, eventListener) => {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);

  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
};
const createSdh_DibacaButton = () => {
  return createButton("Sdh_Dibaca-button", function (event) {
    addBookToCompleted(event.target.parentElement);
  });
};
const addBookToCompleted = (bookElement) => {
  const bookCompleted = document.getElementById(COMPLETED_BOOK_ID);

  const judulbuku = bookElement.querySelector(".detail-book > h3").innerText;
  const bookAuthor = bookElement.querySelector(".detail-book > p").innerText;
  const tahunbuku = bookElement.querySelector(".detail-book > small").innerText;

  const newBook = makeBook(judulbuku, bookAuthor, tahunbuku, true);
  const book = cari(bookElement[BOOK_ITEMID]);
  book.isCompleted = true;
  newBook[BOOK_ITEMID] = book.id;

  bookCompleted.append(newBook);
  bookElement.remove();

  updateDataToStorage();
};

const removeBookFromCompleted = (bookElement) => {
  const bookPosition = cariIndex(bookElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);
  bookElement.remove();
  updateDataToStorage();
};

const createTrashButton = () => {
  return createButton("trash-book", function (event) {
    removeBookFromCompleted(event.target.parentElement);
  });
};

const undoBookFromCompleted = (bookElement) => {
  const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_ID);

  const judulbuku = bookElement.querySelector(".detail-book > h3").innerText;
  const bookAuthor = bookElement.querySelector(".detail-book > p").innerText;
  const tahunbuku = bookElement.querySelector(".detail-book > small").innerText;

  const newBook = makeBook(judulbuku, bookAuthor, tahunbuku, false);
  const book = cari(bookElement[BOOK_ITEMID]);
  book.isCompleted = false;
  newBook[BOOK_ITEMID] = book.id;

  listUncompleted.append(newBook);
  bookElement.remove();
  updateDataToStorage();
};

const createBlm_DibacaButton = () => {
  return createButton("Blm_Dibaca-button", function (event) {
    undoBookFromCompleted(event.target.parentElement);
  });
};

const booksLength = () => {
  const jumlahBuku = document.getElementById("jumlahBuku");
  const totalBooks = books.length;
  jumlahBuku.innerText = `Total buku :  ${totalBooks}`
};

addButton.addEventListener("click", () => {
  inputbuku.classList.toggle("inputbuku-open");
});
closeinputbuku.addEventListener("click", () => {
  inputbuku.style.transition = "1s";
  inputbuku.classList.toggle("inputbuku-open");
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    inputbuku.classList.remove("inputbuku-open");
    addBook();
  });

  if (checkStorage()) {
    loadDatafromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil disimpan.");
  booksLength();
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
  booksLength();
});

function search() {
  const hasil = document.getElementById('tittlebook').value.toUpperCase();
  const uncompletedBooks = document.getElementById(UNCOMPLETED_BOOK_ID);
  const completedBooks = document.getElementById(COMPLETED_BOOK_ID);
  
  const uncompletedBookItems = uncompletedBooks.querySelectorAll('.infobuku');
  const completedBookItems = completedBooks.querySelectorAll('.infobuku');

  let visibleUncompletedBooks = 0;
  let visibleCompletedBooks = 0;

  uncompletedBookItems.forEach((bookItem) => {
    const judulBuku = bookItem.querySelector('.detail-book > h3').innerText.toUpperCase();
    if (judulBuku.includes(hasil)) {
      bookItem.style.display = ''; 
      visibleUncompletedBooks++; 
    } else {
      bookItem.style.display = 'none'; 
    }
  });

  completedBookItems.forEach((bookItem) => {
    const judulBuku = bookItem.querySelector('.detail-book > h3').innerText.toUpperCase();
    if (judulBuku.includes(hasil)) {
      bookItem.style.display = ''; 
      visibleCompletedBooks++; 
    } else {
      bookItem.style.display = 'none'; 
    }
  });

  const jumlahBuku = document.getElementById("jumlahBuku");
  const totalBooks = visibleUncompletedBooks + visibleCompletedBooks;
  jumlahBuku.innerText = `Total buku : ${totalBooks}`;
};
