import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // The new style.css will be imported here
import config from './config.js';

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({
    id: '',
    title: '',
    author: '',
    publicationYear: '',
    isbn: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedBook, setFetchedBook] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${config.url}/bookapi`;//jenkins
  //const baseUrl = `${import.meta.env.VITE_API_URL}/bookapi`; for docker
  //and remove the war,finalname,servelt in backend and base url in frontend and add the corresponding docker files 

  useEffect(() => {
    fetchAllBooks();
  }, []);
  
  // Debounce message clearing
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchAllBooks = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setBooks(res.data);
    } catch (error) {
      setMessage('Error: Failed to fetch books.');
    }
  };

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // A simple validation to check for empty fields
    for (const key in book) {
      if (String(book[key]).trim() === '') {
        setMessage(`Error: Please fill out the '${key}' field.`);
        return false;
      }
    }
    // Publication year should be a number.
    if (isNaN(parseInt(book.publicationYear))) {
        setMessage(`Error: Publication Year must be a valid number.`);
        return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const apiCall = editMode 
      ? axios.put(`${baseUrl}/update`, book)
      : axios.post(`${baseUrl}/add`, book);

    try {
      await apiCall;
      setMessage(`Book ${editMode ? 'updated' : 'added'} successfully.`);
      fetchAllBooks();
      resetForm();
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Could not save the book.'}`);
    }
  };

  const deleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
        try {
          const res = await axios.delete(`${baseUrl}/delete/${id}`);
          setMessage(res.data);
          fetchAllBooks();
        } catch (error) {
          setMessage('Error: Could not delete the book.');
        }
    }
  };

  const getBookById = async () => {
    if (!idToFetch) {
        setMessage("Error: Please enter an ID to fetch.");
        return;
    }
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedBook(res.data);
      setMessage('Book found successfully.');
    } catch (error) {
      setFetchedBook(null);
      setMessage('Error: Book not found.');
    }
  };

  const handleEdit = (b) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setBook(b);
    setEditMode(true);
    setMessage(`Editing book: "${b.title}"`);
  };

  const resetForm = () => {
    setBook({
      id: '',
      title: '',
      author: '',
      publicationYear: '',
      isbn: ''
    });
    setEditMode(false);
    setMessage('');
  };

  return (
    <div className="book-container">
      {message && (
        <div key={message} className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>📚 Book Inventory Management</h2>

      <section>
        <h3>{editMode ? 'Edit Book Details' : 'Add a New Book'}</h3>
        <form onSubmit={handleSubmit}>
            <div className="form-grid">
                <input type="number" name="id" placeholder="Book ID" value={book.id} onChange={handleChange} required disabled={editMode} />
                <input type="text" name="title" placeholder="Title" value={book.title} onChange={handleChange} required />
                <input type="text" name="author" placeholder="Author" value={book.author} onChange={handleChange} required />
                <input type="number" name="publicationYear" placeholder="Publication Year" value={book.publicationYear} onChange={handleChange} required />
                <input type="text" name="isbn" placeholder="ISBN" value={book.isbn} onChange={handleChange} required />
            </div>

            <div className="btn-group">
              <button type="submit" className={editMode ? "btn-green" : "btn-blue"}>
                {editMode ? 'Update Book' : 'Add Book'}
              </button>
              {editMode && (
                <button type="button" className="btn-gray" onClick={resetForm}>Cancel</button>
              )}
            </div>
        </form>
      </section>

      <section>
        <h3>Find a Book by ID</h3>
        <div className="fetch-section">
            <input
              type="number"
              value={idToFetch}
              onChange={(e) => setIdToFetch(e.target.value)}
              placeholder="Enter Book ID to fetch"
            />
            <button className="btn-blue" onClick={getBookById}>Fetch Book</button>
        </div>

        {fetchedBook && (
          <div>
            <h4>Book Found:</h4>
            <pre>{JSON.stringify(fetchedBook, null, 2)}</pre>
          </div>
        )}
      </section>

      <section>
        <h3>Available Books</h3>
        {books.length === 0 ? (
          <p>No books found in the inventory.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Year</th>
                  <th>ISBN</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.publicationYear}</td>
                    <td>{b.isbn}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(b)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteBook(b.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default BookManager;