'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('statuses', [{
        id:0,
        state:"disabled",
        createdAt: "2022-01-01 22:58:01",
        updatedAt: "2022-01-01 22:58:01"
      }
    ,{
      id:0,
      state:"enabled",  
      
   createdAt: "2022-01-01 22:58:01",
  updatedAt: "2022-01-01 22:58:01"
    }]);
    
  },

  async down (queryInterface, Sequelize) {
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('statuses', null, {});
  }
}
};