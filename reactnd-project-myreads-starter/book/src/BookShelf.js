import React from 'react'
import * as App from './App'

class BookShelf extends React.Component {

    render () {
        return (
            <div className="bookshelf">
                {this.props.title && (
                <h2 className="bookshelf-title">{ this.props.title }</h2>
                )}
                <div className="bookshelf-books">
                <ol className="books-grid">
                    {console.log(this.props.bookList)}
                    {this.props.bookList.map( book => (
                    <li key={book.id}>
                        <div className="book">
                            <div className="book-top">
                                <div className="book-cover" 
                                style={{ width: 128, height: 192, 
                                backgroundImage: `url(${book.imageLinks ? book.imageLinks.smallThumbnail : ''})` }}></div>
                                <div className="book-shelf-changer">
                                    <select defaultValue={book.shelf} onChange={(event)=> this.props.updateBook(book, event.target.value)}>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading" >Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            <div className="book-authors">{book.authors ? book.authors.join(', ') : ''}</div>
                        </div>
                    </li>
                    ))}
                </ol>
                </div>
            </div>
        )
    }
}

export default BookShelf