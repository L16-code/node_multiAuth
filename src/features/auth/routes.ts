import  express from "express"
import { validateRequest } from "../../middleware/SchemaValidation";
import HandleErrors from "../../middleware/handleErrors";
import { loginSchema, querySchema, registerSchema, updateProfileSchema } from "./validations";
import { GetAllUsers, GetProfile, UpdateProfile, UserRegister, userLogin } from "./controller";
import verifyToken from "../../middleware/authMiddleware";
import AdminAuth from "../../middleware/adminMiddleware";
const AuthRouter=express.Router()
AuthRouter.post('/register',validateRequest(registerSchema),HandleErrors(UserRegister));
AuthRouter.post('/login',validateRequest(loginSchema),HandleErrors(userLogin));
AuthRouter.get('/get-profile',verifyToken,HandleErrors(GetProfile));
AuthRouter.put('/update-profile',verifyToken,validateRequest(updateProfileSchema),HandleErrors(UpdateProfile));
// admin routes
AuthRouter.get('/all-users',verifyToken,AdminAuth,validateRequest(querySchema,'query'),HandleErrors(GetAllUsers));

export default AuthRouter;   
