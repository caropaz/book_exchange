const {
  Penalty,
  Users
} = require('../../db/models')
var userRep = require('./users')

var date = require('./date')
const DISABLE = 1;
const MAX_PENALTY = 10;


const getAll = async (params = {}) => {
  let query = {
    where: {},
    attributes: {
      exclude: ['id']
    },
    include: [{
      model: Users,
      attributes: ['id', 'name', 'surname', 'email']
    }]
  }
  return await Penalty.findAll(query);
};
async function getPenaltyByIdUser(uID) {
  return await Penalty.findOne({
    where: {
      userId: uID
    }
  })
}

const getById = async (paramsId) => {
  return await Penalty.findOne({
    where: {
      userId: paramsId
    }
  })
}





function setDatePenalty(penalty) {
  return date.setFormatDateToExpect(penalty.dateTo)
}

async function generarPenalidad(userId) {
 
 
  let penalty = await getPenaltyByIdUser(userId)
  
  if (!penalty) {
      return await createPenalty(userId)
  }
  if (penalty.cantPenalty < MAX_PENALTY) {
    
      return await penaltyForExpired(penalty)
  }
  return await disableUser(userId)
}

async function updatePenaltyDate(penalty) {
  let dateToPenalty =  date.updateDateForPenalty(penalty.dateTo) // actualiza el dateTo
  return await updatedPenalty(penalty.id, penalty.cantPenalty, dateToPenalty)
}

async function penaltyForExpired(penalty) {
  
 
  let dateNow = await date.getDateNow()
  let dateToPenalty = setDatePenalty(penalty)
  if (dateToPenalty <= dateNow) { // fecha vencida 
    
      return await updatedPenalty(penalty.id, penalty.cantPenalty)
  }
  return updatePenaltyDate(penalty)
}

async function disableUser(userId) {
  await userRep.changeStatus(userId, DISABLE)

}
async function createPenalty(userId) {

  let dateTo = date.getDateForPenalty()
  return await Penalty.create({
    userId,
    dateTo,
  })

}
async function updatedPenalty(penaltyId, cantPenalty, dateTo) {


  
  if (!dateTo) {
    dateTo = date.getDateForPenalty()
  }
  cantPenalty++

  return await Penalty.update(

    {
      cantPenalty: cantPenalty,
      dateTo: dateTo
    }, {
      where: {
        id: penaltyId
      }
    }
  )
};





module.exports = {
  getById,
  getAll,
  generarPenalidad,
  updatedPenalty,
  getPenaltyByIdUser,
}