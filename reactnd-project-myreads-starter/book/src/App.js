import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf'
import { Route, Link } from 'react-router-dom'

//书架分类常量 
export const BOOK_SHELF_READING = "currentlyReading";
export const BOOK_SHELF_WANT = "wantToRead";
export const BOOK_SHELF_READED = "read";
export const BOOK_SHELF_NONE = "none";


class BooksApp extends React.Component {
  constructor() {
    super();

    this.state = {
      allBooks: [],
      booksReading: [],
      booksWantToRead: [],
      booksReaded: [],
      searchResults: []
    }
  }

  componentDidMount(){
    this.updateAllBooks();
  }

  /**
   * 网络获取所有书籍状态，并更新本地数据
   */
  updateAllBooks = () => {
    BooksAPI.getAll()
    .then(books => this.updateLocalBooks(books));
  }

  /**
   * 刷新整个本地书籍列表
   */
  updateLocalBooks = function(books) {
    this.setState({
      allBooks : books,
      booksReading : books.filter(book => book.shelf === BOOK_SHELF_READING),
      booksWantToRead : books.filter(book => book.shelf === BOOK_SHELF_WANT),
      booksReaded : books.filter(book => book.shelf === BOOK_SHELF_READED)
    });
  }

  /**
   * 更新一本本地书籍状态 并刷新整个数据集
   */
  updateLocalBook = (book) => {
    let allBooks = this.state.allBooks;
    this.insertOrUpdate(allBooks, book);
    this.updateLocalBooks(allBooks);
  }

  updateBook = (book, shelf) => {
    //后台更新书本状态
    BooksAPI.update(book, shelf);
    //更新本地数据
    book.shelf = shelf;
    this.updateLocalBook(book);
  }

  insertOrUpdate = function(array, obj) {
    let result = false;//是否更新成功 如果找到对应id的对象就算更新成功
    for (let index=0; index < array.length; index++) {
      if (array[index].id  === obj.id) {
        array[index] = obj;
        result = true;
        break;
      }
    }
    if (!result) {
      array.push(obj);
    }
  }


  /**
   * 通过搜索词更新搜索数据
   */
  updateSearch = (searchKey) => {
    if (searchKey) {
      BooksAPI.search(searchKey)
      .then(books => {
        //如果查询结果为空 返回的是一个对象 包括error信息 否则返回一个书籍array
        let results =  Array.isArray(books) ? books : [];
        for (let result of results) {//后台返回的查询结果中没有包含书籍的书架信息 需要跟本地数据进行对比 自己加上对应属性
          this.state.allBooks.filter(book => book.id === result.id).map(book => result.shelf = book.shelf);
          if (!result.shelf) {//如果本地没有这个书籍的信息 就初始化为none
            result.shelf = BOOK_SHELF_NONE;
          }
        }
        //更新搜索结果
        this.setState({
          searchResults: results
        });
      })
    } else {
      this.setState({searchResults: []})
    }
  }

  getShelfName(shelfKey) {
    let name = '';
    switch(shelfKey) {
      case BOOK_SHELF_READING:
        name = 'Currently Reading';
        break;
      case BOOK_SHELF_WANT:
        name = 'Want to Read';
        break;
      case BOOK_SHELF_READED:
        name = "Read";
        break;
    }
    return name;
  }
  /** 
   * 重置搜索的数据  当返回首页的时候 调用
  */
  resetSearch = () => {
    this.setState({searchResults: []})
  }

  render() {
    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf title={this.getShelfName(BOOK_SHELF_READING)} bookList={this.state.booksReading} updateBook={this.updateBook}/>
                <BookShelf title={this.getShelfName(BOOK_SHELF_WANT)} bookList={this.state.booksWantToRead} updateBook={this.updateBook}/>
                <BookShelf title={this.getShelfName(BOOK_SHELF_READED)} bookList={this.state.booksReaded} updateBook={this.updateBook}/>
              </div>
            </div>
            <div className="open-search">
              <Link to='/search'>Add a book</Link>
            </div>
          </div>
        )}/>

        <Route path='/search' render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link to='/' className="close-search" onClick={() => this.resetSearch()}>Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author" onChange={(event) => this.updateSearch(event.target.value)}/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                <BookShelf bookList={this.state.searchResults} updateBook={this.updateBook}/>
              </ol>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
