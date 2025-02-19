import UserService from '../services/userService.js';

class UserController {
    static async signup(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await UserService.signup(name, email, password);
            res.status(200).json(user);
        } catch (error) {
            console.error("Signup Error:", error); 
            res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            code: error.responseCode || "300003",
            type: error.type || "ServerError",
            });
        }
    }

    static async login(req,res){
        try{
            const {email, password} = req.body;
            const login = await UserService.login(email, password);
            console.log("🚀 ~ UserController ~ login ~ login:", login)
            res.status(200).json(login)

        } catch(error){
            console.error("Login Error:", error);
            res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            code: error.responseCode || "300003",
            type: error.type || "ServerError",
            });
        }
    }
}

export default UserController;
