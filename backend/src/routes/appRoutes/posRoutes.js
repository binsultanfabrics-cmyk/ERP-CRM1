const express = require('express');
const router = express.Router();
const posController = require('../../controllers/appControllers/posController');
const posSettingsController = require('../../controllers/appControllers/posSettingsController');
const { isAdmin, isStaff } = require('../../middlewares/permissions');

// POS Sales Routes - Temporarily removing auth for testing
router.post('/sales', posController.create);
router.get('/sales', posController.list);
router.get('/sales/:id', posController.read);
router.put('/sales/:id', posController.update);
router.delete('/sales/:id', posController.remove);

// POS Sales Analytics Routes
router.get('/sales/stats', posController.getSalesStats);
router.get('/sales/top-products', posController.getTopSellingProducts);
router.post('/sales/:id/cancel', posController.cancelSale);

// POS Settings Routes
router.post('/settings', posSettingsController.create);
router.get('/settings', posSettingsController.list);
router.get('/settings/:id', posSettingsController.read);
router.put('/settings/:id', posSettingsController.update);
router.delete('/settings/:id', posSettingsController.remove);

// POS Settings Special Routes
router.get('/settings/defaults', posSettingsController.getDefaultSettings);
router.post('/settings/:type/reset', posSettingsController.resetToDefaults);

module.exports = router;
