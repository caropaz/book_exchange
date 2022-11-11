var express = require('express'); 
var router = express.Router(); 
var Rental = require('../src/repositories/rental')
var users = require('../src/repositories/users')
var books = require('../src/repositories/books')
var date = require('../src/repositories/date');




/* GET home page. */
router.get('/', async function(req, res, next) {
  res.json(await Rental.getAll());
});


//GET POR ID
router.get('/:id', async function(req, res) {
  let alquiler =  await Rental.getById(req.params.id)
  if (alquiler){
    return res.json(alquiler)
  }
  res.status(404).end()
});

/*POST */
router.post('/', async function (req, res, next) {

let data= req.body;
const { userId, bookId, dateFrom, dateToExpect } = data;
dateNow=date.getDate()

  try {
      if(data) {

        if (! await  users.getById(req.body.userId) || !req.body.userId ) {  // si user existe y si userid no esta vacio
          return res.status(400).json({message:"is undefined"})
        }

        if (! await  books.getBookById(req.body.bookId) || !req.body.bookId ) { // si book existe y si bookid no esta vacio
          return res.status(400).json({message:"is undefined"})
        }

        if ( dateFrom < dateNow || !req.body.dateFrom) {    // si desde que fecha es menor del dia actual
          return res.status(400).json({message:"bad dateFrom"})
        }

        if ( (dateToExpect < dateNow && dateToExpect < dateFrom )|| !req.body.dateToExpect) { // si la fecha esperada es menor que la actual y menor que desde
          return res.status(400).json({message:"bad dateToExpect"})
        }

        // si user esta disponible
        // si book esta disponible

          let saved = await Rental.saveRental(userId, bookId,dateFrom , dateToExpect);

          // si saved da true, hay que pedirle a status que cambie el estado de user y book
          
          res.status(201).json(saved);
      }
  }catch(error) {
      res.status(400).json({message: error});
  }
});


/*PUT*/
router.put('/:id', async function(req, res) {
  let rentalId =  req.params.id;
  let rental = await Rental.getById(rentalId)
  let dateToReal = req.body.dateToReal
  dateNow=date.getDate()
  
  try {
    if(rental) {
      if ( dateToReal != dateNow || !dateToReal) { 
        return res.status(400).json({message:"bad dateToReal"})
      }
         console.log("antes de hacer el update");
         await Rental.updatedDateToReal(rentalId,dateToReal);
         rental= await Rental.getById(rentalId)
        res.status(201).json(rental);
    }
}catch(error) {
    res.status(400).json({message: error});
}
});



module.exports = router;