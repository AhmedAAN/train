const { Router } = require('express');
const router = Router();

const authController = require('../controllers/authController');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.post('/login', authController.login_post);
router.get('/login', (req, res) => {
    res.render('pages/login', { title: 'login', user: false })
});

router.post('/signup', authController.signup_post);
router.get('/signup', (req, res) => {
    res.render('pages/signup', { title: 'sign up', user: false })
});


router.get('/', authController.home_get)


module.exports = router;