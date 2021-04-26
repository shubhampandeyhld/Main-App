var express=require("express");
const app=express();

//importing object schema and model
const model=require("./models/blogmodel")
app.set("view engine","ejs");
var bodyParser=require("body-parser");
const { all } = require("async");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static('public'));
var mongoose=require("mongoose");
const { schema } = require("./models/blogmodel");


const url="mongodb+srv://root:root@cluster0.qcptk.mongodb.net/Demo?retryWrites=true&w=majority"
let connect=mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})



//Get the blogs
app.get("/blog/Allblogs",(req,res)=>{
    model.find({},(err,blogs)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            res.render("blogs",{blogs:blogs})
        }
    })
})


//Like a Blog

app.post("/blog/like/:blogid",async(req,res)=>
{   
  let blog=  await model.findOne({_id:req.params.blogid})
  blog.likes++;
  blog.save();
  res.send("Liked")
  
})



//get new post 
app.get("/blog/create",(req,res)=>{
    res.render("create");
})

// post new post
app.post("/blog/create",(req,res)=>{
model.create({
    title:req.body.blog_title,
    category:req.body.blog_category,
    content:req.body.blog_content,
    likes:0
    
},(err,current)=>{
    if(err)
    {
        console.log(err)
    }
    else{
        console.log(current)
    }
})

res.redirect("Allblogs");
console.log(body);
res.render("blogs",{allblogs:blog})
})


//Blog detail
app.get("/blog/:id",(req,res)=>{
const blogId=req.params.id;
//get the specfic blog 
var myblog=model.findById(blogId,(err,blog)=>{
    res.render("Detail",{blog:blog})
})
})


//Edit blog-Get

app.get("/blog/:id/edit",(req,res)=>{
    model.findById(req.params.id,(err,myblog)=>{
        if(!err)
        {
            res.render("edit",{blog:myblog})
        }
    })
})

//Edit  blog-Post
app.post("/blog/:id",(req,res)=>{
    let blogUpdate={
        title:req.body.blog_title,
        category:req.body.blog_category,
        content:req.body.blog_content
    }
    model.findByIdAndUpdate(req.params.id,blogUpdate,(err,updatedBlog)=>{
   if(!err)
   {
       res.redirect("/blog/Allblogs");
   }
   else{
       res.redirect("blog/:req.params.id/edit")
   }
    })
})



//Delete  route
app.get("/blog/:id/delete",(req,res)=>{
    model.findByIdAndDelete(req.params.id,(err)=>{
        if(!err)
        {
            res.redirect("/blog/Allblogs")
        }
        else{
            res.send("Cannot delete the respective post")
        }
    })
})
const hostname='0.0.0.0'
app.listen(3000,hostname,(err)=>{
    if(!err)
    {
        console.log("server is fine!!!");
        }
})