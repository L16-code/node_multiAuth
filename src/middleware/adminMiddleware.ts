import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import envConfig from '../config/EnvConfig';

export interface CustomRequest extends Request {
    userId?: string | JwtPayload;
    userRole?: string | JwtPayload;
}

const env = envConfig();
const SecretKey=env.secretKey;
const AdminAuth= (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization');
    // console.log( token)
    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }

    try {
        const newToken=token.split(" ")[1];
        const decoded = jwt.verify(newToken, SecretKey);
        req.userId = (decoded as JwtPayload).userId;
        req.userRole = (decoded as JwtPayload).role;
        if(req.userRole !=='admin') {
            res.status(401).json({ error: 'Access denied' });
            return;
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export default AdminAuth;
