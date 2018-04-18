import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf'

class BooksApp extends React.Component {
  constructor() {
    super();

    this.state = {
      showSearchPage: false,
      booksReading: [],
      booksWantToRead: [],
      booksReaded: []
    }
  }

  componentDidMount(){
    BooksAPI.getAll()
    .then(books => this.setState({
        booksReading : books.filter(book => book.shelf === "currentlyReading"),
        booksWantToRead : books.filter(book => book.shelf === "wantToRead"),
        booksReaded : books.filter(book => book.shelf === "read")
      }))
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf title="Currently Reading" bookList={this.state.booksReading}/>
                <BookShelf title="Want to Read" bookList={this.state.booksWantToRead}/>
                <BookShelf title="Read" bookList={this.state.booksReaded}/>
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
