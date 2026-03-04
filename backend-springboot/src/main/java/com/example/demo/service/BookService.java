package com.example.demo.service;

import java.util.List;
import com.example.demo.entity.Book;

public interface BookService {
    Book addBook(Book book);
    List<Book> getAllBooks();
    Book getBookById(int id);
    Book updateBook(Book book);
    void deleteBookById(int id);
}