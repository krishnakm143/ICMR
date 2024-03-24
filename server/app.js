import express from "express"; 
import mongoose from "mongoose";
import 'dotenv/config'
import cors from "cors"
import session from "express-session";
import passport from "passport";
import router from "./AuthRouters/auth.js";
import "./AuthRouters/passport.js"
import sendEmail from "./controllers/sendEmail.js";
const mongoURL = process.env.MONGO_URL;
const client = process.env.CLIENT_URL

mongoose.connect(mongoURL).then(()=>{
    console.log("Database connected...");
}).catch((err)=>{
    console.log(err);
})

const app = express();

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 1000*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(cors(
    {
        origin : [   `${client}`   ,   `${client}/sign-up`   ,   `${client}/sign-in`],
        methods : "GET,POST,PUT,DELETE",
        credentials : true
    }
))

app.use(router)


app.get("/getotp",(req,res)=>{
    sendEmail();
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})