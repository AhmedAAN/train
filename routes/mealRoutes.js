const { Router } = require('express');
const router = Router();
const { requireAuth } = require('../middleware/authMiddleware');
const mealController = require('../controllers/mealController');
const cookieParser = require('cookie-parser');
router.use(cookieParser());


router.get('/meals/create', requireAuth, mealController.createMeal_get);
router.post('/meals', requireAuth, mealController.createMeal_post);
router.get('/meals', requireAuth, mealController.meals_get);
router.get('/meals/:id', requireAuth, mealController.oneMeal_get);
router.delete('/meals/:id', requireAuth, mealController.oneMeal_delete);
router.post('/meals/:id', requireAuth, mealController.oneMeal_update);
router.get('/meals/update/:id', requireAuth, mealController.updateMeal_get);

module.exports = router;