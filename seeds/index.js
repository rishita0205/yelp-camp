const mongoose= require('mongoose');
const Campground=require('../models/campground')
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db=mongoose.connection;


db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("database connected")
})

const sample=(array)=>array[Math.floor(Math.random()*array.length)];


const seedDB =async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*1000)+100;
        const camp=new Campground({
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium eaque veniam, voluptates a quam quas esse dolor non veritatis! Quaerat mollitia inventore consequatur recusandae ipsa repellendus praesentium, fugiat voluptatum pariatur.',
            price
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})