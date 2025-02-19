import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import database from '../models/index.js'
import ErrorCodes from '../errors/ErrorCodes.js';

class UserService {
    static async signup(name, email, password) {
        try {
            const existingUser = await database.users.findOne({
                where: { email }
            });
            if (existingUser) {
                throw { ...ErrorCodes['100000'] };
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            let newUser = await database.users.create({ 
                name, 
                email, 
                password : hashedPassword });
            return newUser;
        } 
        catch (error) {
            throw error;
        }
    }

    static async login(email, password){
        try{
            const existingUser = await database.users.findOne({
                where: { email }
            });
            if (!existingUser) {
                throw { ...ErrorCodes['100001'] };
            }

            const isValidPassword = await bcrypt.compare(password, existingUser.password)
            if(!isValidPassword){
                throw { ...ErrorCodes['100002'] };
            }

            const token = jwt.sign(
                { id: existingUser.id, email: existingUser.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' })
            return {
                user: existingUser ,
                token
        };
        } catch(error){
            throw error
        }
    }
}

export default UserService;
