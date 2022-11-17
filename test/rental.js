const { assert } = require('chai')
const request = require('supertest')
const app = require('../app')


describe('Rental', function() {
    describe('Registrar una renta', function() {

        it('Requiere el usuario no exista', function(done) {

            request(app)
                .post('/rental')
                .send(
                    {
                        "userId":485789,
                        "bookId":2,
                        "dateFrom": "2022-11-15",
                        "dateToExpect":"2022-11-16"
                        
                      }
                )
                .expect(400)
                .end(function(err, res) {
                    assert.equal(res.body.message, 'BAD_REQUEST')
                    if(err)  done(err);
                    return done();
                })
            }) 
                //---------------------------------------------------------
        it ('Requiere que el libro no exista', function(done) {

                    request(app)
                        .post('/rental')
                        .send(
                            {
                                "userId":1,
                                "bookId":21321,
                                "dateFrom": "2022-11-15",
                                "dateToExpect":"2022-11-16"
                                
                              }
                        )
                        .expect(400)
                        .end(function(err, res) {
                            assert.equal(res.body.message, 'BAD_REQUEST')
                            if(err)  done(err);
                            return done();
                    
                })})

                
                

        //-------------------------------------------------

        it (' Se requiere que el dateFrom sea menor del dia actual', function(done) {

            request(app)
                .post('/rental')
                .send(
                    {
                        "userId":1,
                        "bookId":2,
                        "dateFrom": "2022-11-15",
                        "dateToExpect":"2022-11-16"
                        
                    }
                )
                .expect(400)
                .end(function(err, res) {
                    assert.equal(res.body.message, 'INVALID_DATE_FROM')
                    if(err)  done(err);
                    return done();
            
        })})
        //---------------------------------------------------

        it (' Se requiere que el dateExpect sea menor que el dia actual y el dateFrom', function(done) {
            request(app)
                .post('/rental')
                .send(
                    {
                        "userId":1,
                        "bookId":2,
                        "dateFrom": "2022-11-16",
                        "dateToExpect":"2022-11-15"
                        
                    }
                )
                .expect(400)
                .end(function(err, res) {
                    assert.equal(res.body.message, 'INVALID_DATE_TO_EXPECT')
                    if(err)  done(err);
                    return done();
        })})

        //-------------------------------------------

        it (' Se requiere que el usuario no se encuentre habilitado para rentar', function(done) {
            request(app)
                .post('/rental')
                .send(
                    {
                        "userId":3,
                        "bookId":2,
                        "dateFrom": "2022-11-16",
                        "dateToExpect":"2022-11-16"
                        
                    }
                )
                .expect(400)
                .end(function(err, res) {
                    assert.equal(res.body.message, 'USER_DON\'T_ENABLE')
                    if(err)  done(err);
                    return done();
        })})

        //--------------------------------------------------------------------------

        it (' Se requiere que el libro no se encuentre disponible para rentar', function(done) {
            request(app)
                .post('/rental')
                .send(
                    {
                        "userId":1,
                        "bookId":7,
                        "dateFrom": "2022-11-16",
                        "dateToExpect":"2022-11-16"
                        
                    }
                )
                .expect(400)
                .end(function(err, res) {
                    assert.equal(res.body.message, 'BOOK_DON\'T_AVAILABLE')
                    if(err)  done(err);
                    return done();
        })})

        //----------------------------------------------------------------------------

        it (' Se requiere que el libro no se encuentre destinado para rental, es decir que tenga registro en la tabla de RentalPrice', function(done) {
            request(app)
                .post('/rental')
                .send(
                    {
                        "userId":1,
                        "bookId":3,
                        "dateFrom": "2022-11-16",
                        "dateToExpect":"2022-11-16"
                        
                    }
                )
                .expect(400)
                .end(function(err, res) {
                    assert.equal(res.body.message, 'BOOK_IS_NOT_A_RENT')
                    if(err)  done(err);
                    return done();
        })})

        //-------------------------------------------------------------------------------------------------------------

        it (' Se requiere que el usuario tenga penalidades con fecha vigente', function(done) {
            request(app)
                .post('/rental')
                .send(
                    {
                        "userId":2,
                        "bookId":2,
                        "dateFrom": "2022-11-16",
                        "dateToExpect":"2022-11-16"
                        
                    }
                )
                .expect(400)
                .end(function(err, res) {
                    assert.equal(res.body.message, 'PENALTY_VALID')
                    if(err)  done(err);
                    return done();
        })})

        

})

describe('Confirmar la devolucion de la renta', function() {

    it('Se requiere que el dateToReal no coincida con el dia actual', function(done) {

        request(app)
            .put('/rental/43')
            .send(
                {
                
                    "dateToReal":"2022-11-15"
                    
                  }
            )
            .expect(400)
            .end(function(err, res) {
                assert.equal(res.body.message, 'INVALID_DATE_TO_REAL')
                if(err)  done(err);
                return done();
            })
        }) 

    //-----------------------------------------------------------------------------
    
    it('Se requiere que el dateToReal coincida con el dia actual', function(done) {

        request(app)
            .put('/rental/43')
            .send(
                {
                
                    "dateToReal":"2022-11-15"
                    
                  }
            )
            .expect(400)
            .end(function(err, res) {
                assert.equal(res.body.message, 'INVALID_DATE_TO_REAL')
                if(err)  done(err);
                return done();
            })
        }) 

})
});



    