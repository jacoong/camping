const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const ExpressError = require('./views/utils/ExpressError');
const campgroundsRouter = require('./routers/campgrounds');
const reviewsRouter= require('./routers/reviews');
const userRouter= require('./routers/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./model/userSchema');
const LocalStrategy = require('passport-local').Strategy;

mongoose.connect('mongodb://127.0.0.1:27017/camping')
.then(console.log('success!'))
.catch(e=>{console.log(e)});

app.set('view engine','ejs')  // set view of engine
app.set('views',path.join(__dirname +'/views'));  //directory 지정
app.engine('ejs', engine);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

app.use('/campgrounds', campgroundsRouter)
const sessionConfig = {
    secret : 'heykey',
    resave : false,
    saveUninitiaized : true
}

app.use(session(sessionConfig));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // save user info to session when you got success into Login
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    console.log(req.session);
    res.locals.currentUser = req.user;
    if(req.user){
        console.log('유저 있음')
    }else{
        console.log('노 유져')
    }
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use('/main', campgroundsRouter);
app.use('/main', reviewsRouter);
app.use('/', userRouter);

app.get('/', ((req, res) => {
    res.render('hello');
  }))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found!', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).send(message);
    console.log('success');
});

app.listen(3000, () => {
  console.log(`Example app listening on por`)
})    