const {
    assert,
    expect
} = require('chai')
const app = require('../app')
var penalties = require('../src/repositories/penalty')
var user = require('../src/repositories/users')
var date = require('../src/repositories/date')
const {
    book,
    Users,
    Penalty
} = require("../db/models")
let uIdNow





async function createBook(data) {
    const {
        authorId,
        editionYear,
        title,
        categoryId,
        languageId,
        synopsis,
        availabilityId,
        userId
    } = data;
    const newdBook = await book.create({
        "authorId": authorId,
        "editionYear": editionYear,
        "title": title,
        "categoryId": categoryId,
        "languageId": languageId,
        "synopsis": synopsis,
        "availabilityId": availabilityId,
        "userId": userId
    });

    return newdBook
}

async function createUser(data) {
    const {
        name,
        surname,
        email,
        password
    } = data;
    const newdUser = await Users.create({
        "name": name,
        "surname": surname,
        "email": email,
        "password": password,
    });

    return newdUser
}
async function createPenalty(data) {

    const {
        userId,
        cantPenalty,
        dateTo
    } = data;
    const newdPenalty = await Penalty.create({
        "userId": userId,
        "cantPenalty": cantPenalty,
        "dateTo": dateTo
    });

    return newdPenalty
}
async function deleteUser(i) {
    return await Users.destroy({
        where: {
            id: i
        }
    })
   
}

async function deletePenalty(uId) {
    
    return await Penalty.destroy({
        where: {
            "userId": uId
        }
    });
    
    
}
async function deleteBook(i) {
    return await book.destroy({
        where: {
            "id": i
        }
    })
    
}





describe('Penalty', function () {
    let userDescribe, bookDescribe
    


    before(async function () {

        let dataUser = {
            "name": "Juan",
            "surname": "Perez",
            "email": "juanperez@correo.com",
            "password": "123456"
        }
        userDescribe = await createUser(dataUser)


        let dataBook = {

            "authorId": 1,
            "editionYear": 2018,
            "title": "Test",
            "categoryId": 1,
            "languageId": 1,
            "synopsis": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. masa aeneana. Cum sociis natoque penatibus et",
            "availabilityId": 1,
            "userId": userDescribe.id

        }
        bookDescribe = await createBook(dataBook)

    })
    describe('Registrar primera penalidad', async function () {
        it('Se requiere crear por primera vez  un registro de penalizacion a usuario ', async function () {
            
            let penalty = await penalties.getPenaltyByIdUser(userDescribe.id)
            if (penalty == null) {
                await penalties.generarPenalidad(userDescribe.id)
            }
            penalty = await penalties.getPenaltyByIdUser(userDescribe.id)
            assert.isNotNull(penalty, 'invocando mismo metodo para penalty, paso de null a !null');
            

        })
    }) 
    after(async function () {
        await deletePenalty(userDescribe.id)
    });

    describe('Actualizaciones de Penalty', async function () {
        
      it('Se requiere aumentar la cantidad de penalidad y actualizar dateTo no vigente', async function () {
            
            let dataPenalty = {
                "userId": userDescribe.id,
                "cantPenalty": 1,
                "dateTo": "2022-11-16"
            }
            let pBefore = await createPenalty(dataPenalty)
            let cantPenaltyBefore = pBefore.cantPenalty
            if (cantPenaltyBefore == 1) { 
                await penalties.generarPenalidad(userDescribe.id)
            }
            penaltyFinal = await penalties.getPenaltyByIdUser(userDescribe.id)
            cantPenaltyAfter = penaltyFinal.cantPenalty
            assert.equal(2, cantPenaltyAfter, 'se actualiza el cantPenalty de 1 a 2');
            await deletePenalty(userDescribe.id)
            
            
        })
        after(async function () {
            await deletePenalty(userDescribe.id)
        });

        

        it('Se requiere aumentar la cantidad de penalidad y actualizar dateTo vigente',async function () {
           
            let dataPenalty = {
                "userId": userDescribe.id,
                "cantPenalty": 1,
                "dateTo": "2022-11-22"
            }
            let penaltyIt=  await createPenalty(dataPenalty)
            await penalties.generarPenalidad(userDescribe.id)
            penaltyIt= await penalties.getPenaltyByIdUser(userDescribe.id)
            
            dateUpdate = date.setFormatDateToExpect(penaltyIt.dateTo)
          assert.equal("2022-11-27", dateUpdate, 'actualizado');

    })  
    after(async function () {
        await deletePenalty(userDescribe.id)
      }); 
    })
    describe('Actualizaciones de User con mas de 10 cantPenalty', async function () {
        it('User con mas de 10 cantidad de penalidades, se requiere cambiar su status', async function () {
        const DISABLE = 1;
              
              let dataPenalty = {
                  "userId": userDescribe.id,
                  "cantPenalty": 10,
                  "dateTo": "2022-11-16"
              }
            await createPenalty(dataPenalty)
            await penalties.generarPenalidad(userDescribe.id)
            userUpdate = await user.getById(userDescribe.id)
            userStatusAfter = userUpdate.statusId

             
              assert.equal(DISABLE, userStatusAfter, 'se actualiza el status de user a no habilitador');
              
  
          })
          after(async function () {
             
           await deletePenalty(userDescribe.id)
          });
        })
    
    after(async function () {
        await deleteUser(userDescribe.id)
        await deletePenalty(userDescribe.id)
        await deleteBook(bookDescribe.id)
    });

}); 