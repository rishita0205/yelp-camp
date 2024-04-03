const express=require('express');
const mongoose= require('mongoose');
const path=require('path')
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate');
const Campground=require('./models/campground')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("database connected")
})


const app=express();

app.engine('ejs',ejsMate);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/campground',async(req,res)=>{
    const campgrounds=await  Campground.find({});
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campground/new',(req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campground',async(req,res)=>{
    const campground=await Campground(req.body.campground)
   await campground.save();
   res.redirect(`campground/${campground._id}`)
})
app.get('/campground/:id',async(req,res)=>{
    const campground=await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground});
})
app.get('/campground/:id/edit',async(req,res)=>{
    const campground=await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground});
})

app.put('/campground/:id' ,async(req,res)=>{
    const {id}=req.params;
   const campground=await Campground.findByIdAndUpdate(id)
   res.redirect('/campground')
})

app.delete('/campground/:id' ,async(req,res)=>{
    const {id}=req.params;
   const campground=await Campground.findByIdAndDelete(id,{...req.body.campground})
   res.redirect('/campground')
})
app.listen(3000,()=>{
    console.log("listening")
})