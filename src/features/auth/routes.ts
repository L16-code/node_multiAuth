import  express from "express"
import { validateRequest } from "../../middleware/SchemaValidation";
import HandleErrors from "../../middleware/handleErrors";
import { loginSchema, querySchema, registerSchema, updateProfileSchema } from "./validations";
import { GetAllUsers, GetProfile, UpdateProfile, UserRegister, userLogin } from "./controller";
import verifyToken from "../../middleware/authMiddleware";
const AuthRouter=express.Router()
AuthRouter.post('/register',validateRequest(registerSchema),HandleErrors(UserRegister));
AuthRouter.post('/login',validateRequest(loginSchema),HandleErrors(userLogin));
AuthRouter.get('/getprofile',verifyToken(null),HandleErrors(GetProfile));
AuthRouter.put('/updateprofile',verifyToken(null),validateRequest(updateProfileSchema),HandleErrors(UpdateProfile));
// admin routes
AuthRouter.get('/users',verifyToken('admin'),validateRequest(querySchema,'query'),HandleErrors(GetAllUsers));

export default AuthRouter;
