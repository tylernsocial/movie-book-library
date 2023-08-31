
class Book {
    constructor(title, author, pages, status){
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
    }
}


class Store {

    static getBooks() {
        let books;
        localStorage.getItem('books') === null ? books = [] : books = JSON.parse(localStorage.getItem('books'));
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(bookTitle) {
        const books = Store.getBooks();
        books.forEach((book, index) => { book.title === bookTitle ? books.splice(index, 1) : books});
        localStorage.setItem('books', JSON.stringify(books));
    }

    static updateBookStatus(bookTitle, status) {
        const books = Store.getBooks();
        const bookToUpdate = books.find(book => book.title === bookTitle);
        if (bookToUpdate) {
            bookToUpdate.status = status;
            localStorage.setItem('books', JSON.stringify(books));
        }
    }
}


class UI {

    static displayBooks() {
        const books = Store.getBooks()
        UI.usageTip();
        books.forEach((book)=> UI.addBookToLibrary(book));
    }

    static activateBtn(){
        function removeTransition(e) {
            if (e.propertyName !== 'transform') return;
            e.target.classList.remove('clicked');
        }
        
        document.addEventListener('transitionend', (e) => {
            if (e.target.tagName === 'BUTTON') {
                removeTransition(e);
            }
        });
    }
    static usageTip(){
        const main = document.querySelector('main');
        const usageTipPrompt = document.querySelector('.usage-tip');

        if(main.children.length !== 0) {
            main.classList.add('usage-tip-active');
            usageTipPrompt.classList.add('animated', 'spaceInLeft');
            usageTipPrompt.classList.remove('disabled');

        } if(main.children.length > 1 ) {
            main.classList.remove('usage-tip-active');
            usageTipPrompt.classList.remove('spaceInLeft');
            usageTipPrompt.classList.add('disabled');
        }
    }
    static addBookToLibrary(book) {
        const librarySection = document.querySelector('main');
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card', 'animated', 'float');
    
        const { status, process, summary } = this.processBookStatus(book);
    
        const bookCardContent = `
            <div class="description">
                <h2>${book.title}</h2>
                <h3>by ${book.author}</h3>
                <p>Episodes: ${book.pages}</p>
            </div>
            <div class="action-btns">
                <button class="read read-status ${process}">${status}</button>
                <button class="delete">Delete</button>
            </div>
            <div class="status">${summary}</div>
        `;
    
        bookCard.innerHTML = bookCardContent;
        librarySection.appendChild(bookCard);
    
        UI.activateBtn();
        UI.usageTip();
    
        setTimeout(() => {
            bookCard.classList.remove('float');
        }, UI.ANIMATION_DELAY);
    }

    static processBookStatus(book) {
        const processedBook = { ...book };
    
        if (processedBook.status === true) {
            processedBook.status = 'finished'; 
            processedBook.process = 'success';
            processedBook.summary = 'Completed';
        } else {
            processedBook.status = 'not done'; 
            processedBook.process = 'failure'; 
            processedBook.summary = 'still watching';
        }
    
        return processedBook;
    }

    static removeBook(element) {
        if (!element.classList.contains('delete')) return;
    
        const bookCard = element.closest('.book-card');
        if (!bookCard) return;
    
        element.classList.add('clicked');
        bookCard.classList.add('vanishOut');
        
        setTimeout(() => {
            bookCard.remove();
            UI.usageTip();
        }, 1000);
    
        const bookTitle = bookCard.querySelector('.description h2').textContent;
        Store.removeBook(bookTitle);
    }

    static clearFields(){
        const form = document.querySelectorAll('input');
        form.forEach(el => el.type != 'checkbox' ? el.value = '' : el.checked = false);
    }

    static updateBook(element) {
        if (!element.classList.contains('read-status')) return;
    
        const bookCard = element.parentElement.parentElement;
        const bookTitle = bookCard.querySelector('.description h2').textContent;
        const statusElement = element;
        const summaryElement = bookCard.querySelector('.status');
    
        element.classList.add('clicked');
        const isRead = statusElement.textContent === 'finished';
        
        statusElement.textContent = isRead ? 'not done' : 'finished';
        summaryElement.textContent = isRead ? 'still watching' : 'Completed';
    
        statusElement.classList.toggle('success', !isRead);
        statusElement.classList.toggle('failure', isRead);
    
        Store.updateBookStatus(bookTitle, !isRead);
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit', (e)=>{
    e.preventDefault();

    const title = document.querySelector('#title').value,
          author = document.querySelector('#author').value,
          pages = document.querySelector('#pages').value,
          submitBtn = document.querySelector('.submit-btn'),
          status = document.querySelector('.read-status-determiner').checked;

    submitBtn.classList.add('clicked');

     document.querySelector("#togglerCheckbox").checked = false; 

    setTimeout(()=>{
        const book = new Book(title, author, pages, status);
        UI.addBookToLibrary(book);
        Store.addBook(book);
    }, 200)

    UI.clearFields();
});

document.querySelector('main').addEventListener('click', (e)=>{UI.removeBook(e.target); UI.updateBook(e.target)});
document.querySelector('.try-books').addEventListener('click', (e)=>{UI.tryBooks();});