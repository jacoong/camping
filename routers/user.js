const express = require('express');
const router = express.Router();
const catchAsync = require('../views/utils/catchAsync');
const passport = require('passport');
const User = require('../model/userSchema');



router.get('/login', catchAsync(async (req, res) => {
    console.log(req.session);
    res.render('main/login');
}))

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/main';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/register', catchAsync(async (req, res) => {
    res.render('main/register');
}))

router.post('/register', catchAsync(async (req, res) => {
try{
    const {username , password} = req.body;
    const user = new User({username});
    const registerUser = await User.register(user,password);
    req.login(registerUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/main');
    })
} catch (e) {
    req.flash('error', e.message);
    res.redirect('/asdfasfase');
}
}))


router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success', "Goodbye!");
        res.redirect('/main');
    });
});


module.exports = router;