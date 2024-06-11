import  express from "express";
import envConfig from "./config/EnvConfig";
import connectDB from "./db/dbConnect";
import AuthRouter from "./features/auth/routes";
const app= express();
app.use(express.json());
const env =envConfig();
const port=env.port;
connectDB()
app.use("/",AuthRouter);
app.listen(port,()=>{
    console.log("server is running on port http://localhost:"+port);
})