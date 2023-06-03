//nodemonは変更を反映してくれる

const express = require('express');
const app = express();
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const PORT = 4000;
const mongoose = require('mongoose');
require("dotenv").config(); 


//データベース接続
mongoose.connect(process.env.MONGOURL
).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

//middlewareの設定 ルーティング
app.use(express.json())
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);


app.get("/",(req,res) =>{
    res.send("hello express")
})

// app.get("/users",(req,res) =>{
//     res.send("hello users")
// })


app.listen(PORT,() => console.log("サーバーが起動しました"));