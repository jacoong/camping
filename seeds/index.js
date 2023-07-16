const mongoose = require('mongoose');
const Campground = require('../model/schema')
const {descriptors,places} = require('./locations')
const fetch = require('node-fetch')
const citys = require('./citys');

const getPhotoApi = () =>{
return fetch('https://api.unsplash.com/photos/random?client_id=tUDY17chFCvnVTvJvz_5rUDnxz_7mCgrtxJG3ZBgA60&query=tree')
.then((res)=> res.json())
.then((d)=> {
    const value1 = (d.urls.regular);
    return value1

})
.catch(e=>{console.log(e)})
}


mongoose.connect('mongodb://127.0.0.1:27017/camping')
.then(console.log('success!!!'))
.catch(e=>{console.log(e)});

const random = (array) => {return Math.floor(Math.random() * array.length+1)}
const randomPrice = () => {return Math.floor(Math.random() * 101)+5;}

const seedDB = async() => {
    await Campground.deleteMany({})
    for(i=0;i<20;i++){
        const value1 = await getPhotoApi();
        const randomNumber = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author:'6437d234be6b9e8925ac4f96',
            title:`${descriptors[random(descriptors)]} ${places[random(places)]}`,
            location:`${citys[randomNumber].city}, ${citys[randomNumber].state}`,
            photo: value1,
            price: randomPrice(),
            description:'cozy and good way of camping store !!cozy and good way of camping store !cozy and good way of camping store !cozy and good way of camping store !cozy and good way of camping store !cozy and good way of camping store !'
        })
        await camp.save();
    }
}
seedDB();