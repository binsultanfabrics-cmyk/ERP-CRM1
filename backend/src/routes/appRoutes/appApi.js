const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');

const routerApp = (entity, controller) => {
  router.route(`/${entity}/create`).post(catchErrors(controller['create']));
  router.route(`/${entity}/read/:id`).get(catchErrors(controller['read']));
  router.route(`/${entity}/update/:id`).patch(catchErrors(controller['update']));
  router.route(`/${entity}/delete/:id`).delete(catchErrors(controller['delete']));
  router.route(`/${entity}/search`).get(catchErrors(controller['search']));
  router.route(`/${entity}/list`).get(catchErrors(controller['list']));
  router.route(`/${entity}/listAll`).get(catchErrors(controller['listAll']));
  router.route(`/${entity}/filter`).get(catchErrors(controller['filter']));
  router.route(`/${entity}/summary`).get(catchErrors(controller['summary']));

  if (entity === 'invoice') {
    router.route(`/${entity}/mail`).post(catchErrors(controller['mail']));
  }
  
  // Custom routes for specific entities
  if (entity === 'purchaseorder') {
    router.route(`/${entity}/updateStatus/:id`).patch(catchErrors(controller['updateStatus']));
    router.route(`/${entity}/receive/:id`).post(catchErrors(controller['receive']));
    router.route(`/${entity}/close/:id`).patch(catchErrors(controller['close']));
  }
  
  if (entity === 'location') {
    router.route(`/${entity}/inventory/:locationId`).get(catchErrors(controller['getInventory']));
    router.route(`/${entity}/transfer`).post(catchErrors(controller['transferStock']));
    router.route(`/${entity}/transferHistory`).get(catchErrors(controller['getTransferHistory']));
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;
