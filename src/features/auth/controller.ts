import express from "express";
import UserService from "./services"
import { CustomRequest } from "../../middleware/authMiddleware";
export const UserRegister = async (request: express.Request, response: express.Response) => {
    try {
        const { username, email, password, dob, gender } = request.body;
        const registerData = { username, email, password, dob, gender };
        const result = await UserService.userRegister(registerData)
        response.status(201).json(result)
    } catch (error) {
        response.status(400).json(error)
    }
};
export const userLogin = async (request: express.Request, response: express.Response) => {
    try {
        const { username, password } = request.body;
        const LoginData = { username, password }
        const result = await UserService.userLogin(LoginData)
        response.status(200).json(result)
    } catch (error) {
        response.status(400).json(error)
    }
}
export const GetProfile = async (request: CustomRequest, response: express.Response) => {
    try {
        if (!request.userId) {
            return response.status(400).json({ message: "Invalid Token" });
        }
        const result = await UserService.GetProfile(request.userId as string);
        response.status(200).json(result);
    } catch (error) {
        response.status(400).json({ message: "Invalid Token" });
    }
}
export const UpdateProfile = async(request: CustomRequest, response: express.Response) => {
    try {
        console.log(request.userId)
        if (!request.userId) {
            return response.status(400).json({ message: "Invalid Token" });
        }
        const { username, dob, gender, email } = request.body;
        const profileData = { username, dob, gender, email };
        console.log(request.userId as string);
        const result = await UserService.UpdateProfile(profileData, request.userId as string);
        response.status(200).json(result);
    } catch (error) {
        response.status(400).json({ message: "Error In code" });
    }
}
export const GetAllUsers = async(request: express.Request, response: express.Response)=>{
    try {
        const { page = 1, limit = 10, sortBy = 'username', order = 'asc', filter = '' } = request.query;
        const result = await UserService.GetAllUsers({
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            sortBy: sortBy as string,
            order: order as string,
            filter: filter as string,
        });
        response.status(200).json(result);
    } catch (error) {
        response.status(400).json({ message: "Error In code" });
    }
}