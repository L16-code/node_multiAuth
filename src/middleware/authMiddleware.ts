import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import envConfig from '../config/EnvConfig';

export interface CustomRequest extends Request {
    userId?: string | JwtPayload;
    userRole?: string | JwtPayload;
}

const env = envConfig();
const SecretKey=env.secretKey;
const verifyToken = (requiredRole: string | null = null) => {
    return (req: CustomRequest, res: Response, next: NextFunction): void => {
        const token = req.header('Authorization');
        // console.log(token)
        if (!token) {
            res.status(401).json({ error: 'Access denied' });
            return;
        }

        try {
            const newToken = token.split(' ')[1];
            const decoded = jwt.verify(newToken, SecretKey) as JwtPayload;

            req.userId = (decoded as JwtPayload).userId;
            req.userRole = (decoded as JwtPayload).role;
            console.log(req.userId, req.userRole)
            if (requiredRole && req.userRole !== requiredRole) {
                res.status(403).json({ error: 'Forbidden: This Routes Is protected For Admin Only' });
                return;
            }

            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };
};

export default verifyToken;
