DROP TABLE IF EXISTS books;

CREATE TABLE books (
   
    title VARCHAR(256),
    authors VARCHAR(256),
    isbn VARCHAR(256),
    url VARCHAR(256),
    description VARCHAR(256)

);

INSERT INTO books (title,authors,isbn,url,description) VALUES('foo','ghaid','321541','www.wwwff.ffd','foolish book')