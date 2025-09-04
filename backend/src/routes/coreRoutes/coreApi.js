const express = require('express');

const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const adminController = require('@/controllers/coreControllers/adminController');
const settingController = require('@/controllers/coreControllers/settingController');
const dashboardController = require('@/controllers/coreControllers/dashboardController');

const { singleStorageUpload } = require('@/middlewares/uploadMiddleware');

// //_______________________________ Admin management_______________________________

router.route('/admin/list').get(catchErrors(adminController.list));
router.route('/admin/read/:id').get(catchErrors(adminController.read));
router.route('/admin/password-update/:id').patch(catchErrors(adminController.updatePassword));

//_______________________________ Admin Profile _______________________________

router.route('/admin/profile/password').patch(catchErrors(adminController.updateProfilePassword));
router
  .route('/admin/profile/update')
  .patch(
    singleStorageUpload({ entity: 'admin', fieldName: 'photo', fileType: 'image' }),
    catchErrors(adminController.updateProfile)
  );

// //____________________________________________ API for Global Setting _________________

router.route('/setting/create').post(catchErrors(settingController.create));
router.route('/setting/read/:id').get(catchErrors(settingController.read));
router.route('/setting/update/:id').patch(catchErrors(settingController.update));
//router.route('/setting/delete/:id).delete(catchErrors(settingController.delete));
router.route('/setting/search').get(catchErrors(settingController.search));
router.route('/setting/list').get(catchErrors(settingController.list));
router.route('/setting/listAll').get(catchErrors(settingController.listAll));
router.route('/setting/filter').get(catchErrors(settingController.filter));
router
  .route('/setting/readBySettingKey/:settingKey')
  .get(catchErrors(settingController.readBySettingKey));
router.route('/setting/listBySettingKey').get(catchErrors(settingController.listBySettingKey));
router
  .route('/setting/updateBySettingKey/:settingKey?')
  .patch(catchErrors(settingController.updateBySettingKey));
router
  .route('/setting/upload/:settingKey?')
  .patch(
    catchErrors(
      singleStorageUpload({ entity: 'setting', fieldName: 'settingValue', fileType: 'image' })
    ),
    catchErrors(settingController.updateBySettingKey)
  );
router.route('/setting/updateManySetting').patch(catchErrors(settingController.updateManySetting));

// Dashboard Stats Endpoint
router.route('/dashboard/stats').get(catchErrors(dashboardController.getDashboardStats));

// Reports Endpoints
const reportsController = require('@/controllers/coreControllers/reportsController');
router.route('/reports/daily-sales').get(catchErrors(reportsController.getDailySalesSummary));
router.route('/reports/monthly-profit-loss').get(catchErrors(reportsController.getMonthlyProfitLoss));
router.route('/reports/top-selling-items').get(catchErrors(reportsController.getTopSellingItems));
router.route('/reports/bargain-impact').get(catchErrors(reportsController.getBargainImpactReport));
router.route('/reports/credit-aging').get(catchErrors(reportsController.getCreditAgingReport));
router.route('/reports/employee-sales').get(catchErrors(reportsController.getEmployeeSalesReport));
router.route('/reports/inventory-valuation').get(catchErrors(reportsController.getInventoryValuationReport));

// Reminders Endpoints
const remindersController = require('@/controllers/coreControllers/remindersController');
router.route('/reminders/credit-aging').get(catchErrors(remindersController.getCreditAgingSummary));
router.route('/reminders/send-overdue').post(catchErrors(remindersController.sendOverdueReminders));
router.route('/reminders/settings').get(catchErrors(remindersController.getReminderSettings));

// Setup Endpoints
const setupController = require('@/controllers/coreControllers/setupController');
router.route('/setup/erp-features').post(catchErrors(setupController.setupERPFeatures));
router.route('/setup/reset-erp-features').post(catchErrors(setupController.resetERPFeatures));

module.exports = router;
