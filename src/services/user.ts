import { prismaclient } from "../lib/db";
import { Hmac ,createHmac,randomBytes} from "node:crypto";
import jwt from 'jsonwebtoken';

import { Token } from "graphql";
const jwt_secret='KunalDevxxxx'
export interface CreateUsePayload{
    firstName:string
    lastName:string
    email:string
    password:string
}
export interface GetUserTokenPayload{
    email:string
    password:string
}
class UserService{
    private static generateHash(salt:string,password:string){
        const handlePassword=createHmac('sha256',salt).update(password).digest('hex')
        return handlePassword
    }
    public static createUser(payload:CreateUsePayload){
        const {firstName,lastName,email,password}=payload
        const salt = randomBytes(32).toString("hex");
        const handlePassword=UserService.generateHash(salt,password)
        return prismaclient.user.create({
            data:{
                firstName,
                lastName,
                email,
                salt,
                password:handlePassword,
            }
        })

    }
    private static getuserbyemail(email:string){
        return prismaclient.user.findUnique({ where :{ email }})
    }
    public static async getusertoken(payload:GetUserTokenPayload){
        const {email,password}= payload;
        const user= await UserService.getuserbyemail(email);
        if(!user) throw new Error('user not found')
        const userSalt = user.salt;
        const userhashpassword=UserService.generateHash(userSalt,password)
        if(userhashpassword !== user.password) 
        throw new Error('Incorrect Password')
        //gen token
       const token = jwt.sign({ id: user.id,email: user.email},jwt_secret )
       return token;


    }
    public static decodeJWTToken(token: string) {
        return jwt.verify(token, jwt_secret);
      }
    public static getUserById(id: string) {
        return prismaclient.user.findUnique({ where: { id } });
      }
    
}
export default UserService;