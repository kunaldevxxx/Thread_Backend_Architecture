import { prismaclient } from "../lib/db";
import { Hmac ,createHmac,randomBytes} from "node:crypto";

export interface CreateUsePayload{
    firstName:string
    lastName:string
    email:string
    password:string
}
class UserService{
    public static createUser(payload:CreateUsePayload){
        const {firstName,lastName,email,password}=payload
        const salt = randomBytes(32).toString();
        const handlePassword=createHmac('sha256',salt).update(password).digest('hex')
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
}
export default UserService;