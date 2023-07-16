const express = require('express');
const router = express.Router();
const catchAsync = require('../views/utils/catchAsync');
const Joi = require('joi');
const Review = require('../model/reviewSchema');
const Campground = require('../model/schema');
const { isLoggedIn } = require('../isLoggedIn');



router.post('/show/:showid', catchAsync(async (req, res,next) => {
    const reviewSchema = Joi.object({
            textarea:Joi.string().required(),
            rating:Joi.number().required(),
    });
    
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(req.body);
        const ErrorMessage = (error.details[0].message);
        return res.status(404).render('main/error',{ErrorMessage});
  }
    const {showid} = req.params;
    const ratingValue = new Review(req.body);
    const reviewer = req.user._id;
    ratingValue.author = reviewer;

    const Camp = await Campground.findById(showid);
    
    Camp.reviews.push(ratingValue);
    Camp.save();
    ratingValue.save();
    console.log(Camp);
    res.redirect(`/main/show/${showid}`);
}))

router.delete('/show/:showid/:reviewid',catchAsync(async (req, res,next) => {
    const {showid,reviewid } = req.params;
    await Campground.findByIdAndUpdate(showid,{$pull:{reviews:reviewid} });
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/main/show/${showid}`);

}))

module.exports = router;