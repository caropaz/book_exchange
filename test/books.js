const { assert } = require('chai')
const request = require('supertest')
const app = require('../app')

describe('Books', function() {
    describe('Alta de libro', function() {
       
        /* before(function() {
            console.log('BEFORE TEST');
        })
    
        after(function() {
            console.log('AFTER TEST');
            
        })

        beforeEach(function() {
            console.log('BEFORE_EACH TEST');
        })
    
        afterEach(function() {
            console.log('AFTER_EACH TEST');
            
        }) */

        it('Se requiere un JSON con TODOS los datos obligatorios del libro', async function() {

            return request(app)
                .post('/books')
                .send({})
                .expect(400)
                .then( res => {
                    assert.equal(res.body.message, 'BAD_REQUEST')

                })
                /* .end(function(err, res) {
                    assert.equal(res.body.message, 'BAD_REQUEST')
                    console.log(res.body);
                    if(err)  done(err);
                    return done();
                }) */

        })

        it('Requiere un usuario que exista en la DB para dar de alta un libro', function(done) {

            request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 2000,
                        "title": "El más crack 3",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial.",
                        "userId": 255,
                        "price": 5000
                    }
                )
                .expect(400)
                .end(function(err, res) {
                    assert.equal(res.body.message, 'USER_DOES_NOT_EXIST')
                    if(err)  done(err);
                    return done();
                })

        })

        it('Requiere un autor que ya exista en la DB', function(done) {
            request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 899,
                        "editionYear": 2000,
                        "title": "El más crack 3",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial.",
                        "userId": 2,
                        "price": 5000
                    }
                )
                .expect(400)
                .end(function(err, res) {
                    assert.equal(res.body.message, 'AUTHOR_DOES_NOT_EXIST')
                    if(err)  done(err);
                    return done();
                })
        })

        it('Requiere una categoría que ya exista en la DB', async function() {
            return request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 2000,
                        "title": "El más crack 3",
                        "categoryId": 288,
                        "languageId": 3,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial.",
                        "userId": 2,
                        "price": 5000
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'CATEGORY_DOES_NOT_EXIST')
                })
        })

        it('Requiere un lenguaje que ya exista en la DB', async function() {
            return request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 2000,
                        "title": "El más crack 3",
                        "categoryId": 2,
                        "languageId": 3789,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial.",
                        "userId": 2,
                        "price": 5000
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'LANGUAGE_DOES_NOT_EXIST')
                })
        })

        it('Requiere un año de edición que sea válido (mayor que "0")', async function() {
            return request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 0,
                        "title": "El más crack 3",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial.",
                        "userId": 2,
                        "price": 5000
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'INVALID_EDITION_YEAR')
                })
        })

        it('Requiere un título válido para el libro (de 1 a 100 caracteres)', async function() {
            return request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 150,
                        "title": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ma",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial.",
                        "userId": 2,
                        "price": 5000
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'INVALID_TITLE')
                })
        })

        it('Requiere una sinopsis válida para el libro (de 1 a 255 caracteres)', async function() {
            return request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 150,
                        "title": "Lorem ipsum dolor sit amet",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
                        "userId": 2,
                        "price": 5000
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'INVALID_SYNOPSIS')
                })
        })

        it('Requiere un valor decimal válido para el precio de alquiler del libro, mayor que "0"', async function() {
            return request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 150,
                        "title": "Lorem ipsum dolor sit amet",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis",
                        "userId": 2,
                        "price": 0
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'INVALID_PRICE')
                })
        })

        it('Registro éxitoso de un libro para INTERCAMBIO', async function() {
            return request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 150,
                        "title": "Lorem ipsum dolor sit amet",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
                        "userId": 2
                    }
                )
                .expect(201)
                .then((res) => {
                    assert.isObject(res.body, 'No se ha devuelto un objeto de libro');

                })
        })

        it('Registro éxitoso de un libro para ALQUILER', async function() {
            return request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 150,
                        "title": "Lorem ipsum dolor sit amet",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
                        "userId": 2,
                        "price": 1500
                    }
                )
                .expect(201)
                .then((res) => {
                    assert.isObject(res.body, 'No se ha devuelto un objeto de libro');

                })
        })
    });

    describe('Modificación de libro', function() {
       
        /* before(function() {
            console.log('BEFORE TEST');
        })
    
        after(function() {
            console.log('AFTER TEST');
            
        })

        beforeEach(function() {
            console.log('BEFORE_EACH TEST');
        })
    
        afterEach(function() {
            console.log('AFTER_EACH TEST');
            
        }) */

        it('Se requiere un JSON con TODOS los datos obligatorios para editar los campos de un libro', async function() {

            return request(app)
                .put('/books/3')
                .send({})
                .expect(400)
                .then( res => {
                    assert.equal(res.body.message, 'BAD_REQUEST')

                })
        })

        it('Se requiere que el libro que se desea editar, debe estar dado de alta en la DB', async function() {

            return request(app)
                .put('/books/358')
                .send(
                    {
                        "authorId": 5,
                        "editionYear": 6400,
                        "title": "La señora Dalloway",
                        "categoryId": 6,
                        "languageId": 2,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial",
                        "price": 3007
                    }
                )
                .expect(400)
                .then( res => {
                    assert.equal(res.body.message, 'BAD_REQUEST')

                })
        })

        it('Se requiere que el libro que se desea editar, debe tener un estado "DISPONIBLE"', async function() {

            return request(app)
                .put('/books/2')
                .send(
                    {
                        "authorId": 5,
                        "editionYear": 6400,
                        "title": "La señora Dalloway",
                        "categoryId": 6,
                        "languageId": 2,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial",
                        "userId": 6
                    }
                )
                .expect(400)
                .then( res => {
                    assert.equal(res.body.message, "BOOK_DON'T_AVAILABLE")

                })
        })

        it('Se requiere ingresar un autor que ya exista en la DB', function(done) {
            request(app)
                .put('/books/19')
                .send(
                    {
                        "authorId": 899,
                        "editionYear": 2000,
                        "title": "El más crack 3",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial."
                    }
                )
                .expect(400)
                .end(function(err, res) {
                    assert.equal(res.body.message, 'AUTHOR_DOES_NOT_EXIST')
                    if(err)  done(err);
                    return done();
                })
        })

        it('Se requiere ingresar una categoría que ya exista en la DB', async function() {
            return request(app)
                .put('/books/19')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 2000,
                        "title": "El más crack 3",
                        "categoryId": 288,
                        "languageId": 3,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial."
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'CATEGORY_DOES_NOT_EXIST')
                })
        })

        it('Se requiere ingresar un lenguaje que ya exista en la DB', async function() {
            return request(app)
                .put('/books/19')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 2000,
                        "title": "El más crack 3",
                        "categoryId": 2,
                        "languageId": 3789,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial."
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'LANGUAGE_DOES_NOT_EXIST')
                })
        })

        it('Se requiere ingresar un año de edición que sea válido (mayor que "0")', async function() {
            return request(app)
                .put('/books/19')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 0,
                        "title": "El más crack 3",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial."
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'INVALID_EDITION_YEAR')
                })
        })

        it('Se requiere ingresar un título válido para el libro (de 1 a 100 caracteres)', async function() {
            return request(app)
                .put('/books/19')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 150,
                        "title": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ma",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "La señora Dalloway (título original en inglés, Mrs. Dalloway) es la cuarta novela de Virginia Woolf, publicada el 14 de mayo de 1925. Detalla un día en la vida de Clarissa Dalloway, en la Inglaterra posterior a la Primera Guerra Mundial."
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'INVALID_TITLE')
                })
        })

        it('Se requiere ingresar una sinopsis válida para el libro (de 1 a 255 caracteres)', async function() {
            return request(app)
                .post('/books')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 150,
                        "title": "Lorem ipsum dolor sit amet",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem."
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'INVALID_SYNOPSIS')
                })
        })

        it('Requiere un valor decimal válido para el precio de alquiler del libro, mayor que "0"', async function() {
            return request(app)
                .put('/books/1')
                .send(
                    {
                        "authorId": 8,
                        "editionYear": 150,
                        "title": "Lorem ipsum dolor sit amet",
                        "categoryId": 2,
                        "languageId": 3,
                        "synopsis": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis",
                        "price": 0
                    }
                )
                .expect(400)
                .then((res) => {
                    assert.equal(res.body.message, 'INVALID_PRICE')
                })
        })
    })
})