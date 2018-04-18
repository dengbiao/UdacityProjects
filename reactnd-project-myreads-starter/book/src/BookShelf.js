import React from 'react'
import * as App from './App'
import Book from './Book'

/**
 * 书架组件 包含书架名称和书架中的书籍  可以考虑把li中的内容抽成书籍组件
 * 当书架没有书籍的时候显示“没有书籍” 如果书架没有名字的话 那也不显示这个提示语了（搜索的时候就不需要）
 */
class BookShelf extends React.Component {

    render () {
        return (
            <div className="bookshelf">
                {this.props.title && (
                <h2 className="bookshelf-title">{ this.props.title }</h2>
                )}
                <div className="bookshelf-books">
                {this.props.bookList && this.props.bookList.length > 0 && (
                <ol className="books-grid">
                    {this.props.bookList.map( book => (
                    <li key={book.id}>
                        <Book book={book} updateBook={this.props.updateBook}/>
                    </li>
                    ))}
                </ol>)}

                {this.props.title && (!this.props.bookList || this.props.bookList.length === 0)&& (
                    <div>No books in this shelf.</div>
                )}
                </div>
            </div>
        )
    }
}

export default BookShelf