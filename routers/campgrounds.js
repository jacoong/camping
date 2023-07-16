const express = require('express');
const router = express.Router();
const catchAsync = require('../views/utils/catchAsync');
const Joi = require('joi');
const Campground = require('../model/schema');
const flash = require('connect-flash');
const {isLoggedIn} = require('../isLoggedIn');

router.get('/', catchAsync(async (req, res) => {
      const Camps = await Campground.find({})
      res.render('main/mainPage',{Camps});
  }))

router.get('/show/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const Camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
          path: 'author'
        }
      })
      .populate('author');
      console.log('------------------------------------------------------------');
    console.log(Camp.author)
    res.render('main/show',{Camp});
}));



router.get('/new',isLoggedIn, catchAsync(async(req,res)=>{
    res.render('main/new');
}))

router.post('/new', catchAsync(async(req,res,next)=>{
    const campSchema = Joi.object({
        campsss: Joi.object({
            title:Joi.string().required(),
            location:Joi.string().required(),
            price:Joi.number().required(),
            description:Joi.string().required(),
            photo:Joi.string().required()
        }).required()
    })
    try{
    const value = req.body;
    const camp = new Campground(value);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a new campground!');
    }
    catch{
        req.flash('error','error happen omg so sorry :(')
    }
    res.redirect('/main');
}))

router.delete('/delete/:id', catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/main');
}))

router.get('/edit/:id', catchAsync(async(req,res)=>{
    const {id} = req.params;
    const Camp = await Campground.findById(id);
    res.render('main/edit',{Camp});
}))

router.put('/edit/:id', catchAsync(async(req,res)=>{
    const types = ["title","location","price","description","photo"]
    const {id} = req.params;
    const previousValue = await Campground.findById(id);  //{value="something"}
    const updateValue = req.body;  //{value=""}
    for(typ of types){
        if(updateValue[typ] == ''){
            updateValue[typ] = previousValue[typ]
            console.log(updateValue);
        }else{
            console.log(updateValue);
        }
      } 
      const Camp = await Campground.findByIdAndUpdate(id,updateValue,{runValidators:"true"});
      await Camp.save();
    res.redirect(`/main/show/${id}`);
}))

module.exports = router;