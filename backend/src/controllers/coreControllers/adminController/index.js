const createUserController = require('@/controllers/middlewaresControllers/createUserController');
const Admin = require('@/models/coreModels/Admin');
module.exports = createUserController(Admin);
