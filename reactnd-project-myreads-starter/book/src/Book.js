import React from 'react'

/**
 * 书架组件 包含书架名称和书架中的书籍  可以考虑把li中的内容抽成书籍组件
 */
class Book extends React.Component {
    render() {
        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" 
                    style={{ width: 128, height: 192, 
                    backgroundImage: `url(${this.props.book.imageLinks ? this.props.book.imageLinks.smallThumbnail : ''})` }}></div>
                    <div className="book-shelf-changer">
                        <select defaultValue={this.props.book.shelf} onChange={(event)=> this.props.updateBook(this.props.book, event.target.value)}>
                            <option value="none" disabled>Move to...</option>
                            <option value="currentlyReading" >Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                <div className="book-title">{this.props.book.title}</div>
                <div className="book-authors">{this.props.book.authors ? this.props.book.authors.join(', ') : ''}</div>
            </div>
        )
    }
}

export default Book