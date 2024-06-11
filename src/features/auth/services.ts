import EnvConfig from "../../config/EnvConfig";
import { IProfileData, IResponse, IUser, IUserData, IUserListData, IUserLogin, IUserRegister, QueryParams } from "./interfaces";
import { UserModel } from "./model";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
class UserService {
    private createResponse<T>(message: string, success: boolean, data?: T): IResponse<T> {
        return { message, success, data };
    }
    async userRegister(userdata: IUserRegister): Promise<IResponse<null>> {
        try {
            const { username, password } = userdata;
            const existingUser = await UserModel.findOne({ username });
            if (existingUser) {
                return this.createResponse("UserName already exists", false);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new UserModel({
                username,
                password: hashedPassword,
            });
            const res = await user.save();
            if (res) {
                return this.createResponse("User registered successfully", true);
            } else {
                return this.createResponse("User not registered", false);
            }
        } catch (error) {
            return this.createResponse("An error occurred while registering the user", false);
        }

    }
    async userLogin(LoginData: IUserLogin): Promise<IResponse<IUserData | null>> {
        try {
            const { username, password } = LoginData;
            const user = await UserModel.findOne({ username });
            if (user) {
                const validPassword = await bcrypt.compare(password, user.password);
                if (validPassword) {
                    const env = EnvConfig();
                    const SecretKey = env.secretKey;
                    const token = jwt.sign(
                        { userId: user.id, role: user.role },
                        process.env.JWT_SECRET || SecretKey,
                        { expiresIn: '1h' }
                    );
                    const data: IUserData = {
                        token,
                        user: {
                            id: user.id,
                            username: user.username,
                        },
                    };
                    return this.createResponse("User logged in successfully", true, data);
                } else {
                    return this.createResponse("Invalid password", false, null);
                }
            } else {
                return this.createResponse("User not found", false, null);
            }
        } catch (error) {
            return this.createResponse("An error occurred while logging in the user", false, null);
        }
    }
    async GetProfile(Id: string): Promise<IResponse<IUser | null>> {
        try {
            const user = await UserModel.findById(Id, { username: 1, role: 1, _id: 1 }).lean();
            if (user) {
                const users: IUser = {
                    _id: user._id.toString(),
                    username: user.username,
                    role: user.role,
                };
                return this.createResponse("User found", true, users);
            } else {
                return this.createResponse("User not found", false, null);
            }
        } catch (error) {
            return this.createResponse("An error occurred while finding the user", false, null);
        }
    }
    async UpdateProfile(ProfileData: IProfileData, id: string): Promise<IResponse<null>> {
        try {
            const user = await UserModel.findByIdAndUpdate(id, ProfileData);
            if (user) {
                return this.createResponse("User updated successfully", true);
            } else {
                return this.createResponse("User cannot updated ", false);
            }
        } catch (error) {
            return this.createResponse("An error occurred while finding the user", false);
        }
    }
    async GetAllUsers(queryParams: QueryParams): Promise<IResponse<IUserListData | null>> {
        try {
            const { page, limit, sortBy, order, filter } = queryParams;
            const offset = (page - 1) * limit;
            const users = await UserModel.find({ username: new RegExp(filter, 'i'), role: 'user' })
                .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
                .skip(offset)
                .limit(limit).lean();
            const totalUsers = await UserModel.countDocuments({ username: new RegExp(filter, 'i') });
            const AllUsers: IUser[] = users.map(user => ({
                _id: user._id.toString(),
                username: user.username,
                role: user.role,
            }));
            const data: IUserListData = {
                users: AllUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
            };
            return this.createResponse("Users found", true, data);
        } catch (error) {
            return this.createResponse("An error occurred while finding the users", false, null);
        }
    }
}
export default new UserService