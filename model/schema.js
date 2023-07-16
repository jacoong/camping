const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    photo: String,
    reviews: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }
    ],
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);