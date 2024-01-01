"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../lib/db");
const node_crypto_1 = require("node:crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_secret = 'KunalDevxxxx';
class UserService {
    static generateHash(salt, password) {
        const handlePassword = (0, node_crypto_1.createHmac)('sha256', salt).update(password).digest('hex');
        return handlePassword;
    }
    static createUser(payload) {
        const { firstName, lastName, email, password } = payload;
        const salt = (0, node_crypto_1.randomBytes)(32).toString("hex");
        const handlePassword = UserService.generateHash(salt, password);
        return db_1.prismaclient.user.create({
            data: {
                firstName,
                lastName,
                email,
                salt,
                password: handlePassword,
            }
        });
    }
    static getuserbyemail(email) {
        return db_1.prismaclient.user.findUnique({ where: { email } });
    }
    static getusertoken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const user = yield UserService.getuserbyemail(email);
            if (!user)
                throw new Error('user not found');
            const userSalt = user.salt;
            const userhashpassword = UserService.generateHash(userSalt, password);
            if (userhashpassword !== user.password)
                throw new Error('Incorrect Password');
            //gen token
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, jwt_secret);
            return token;
        });
    }
    static decodeJWTToken(token) {
        return jsonwebtoken_1.default.verify(token, jwt_secret);
    }
    static getUserById(id) {
        return db_1.prismaclient.user.findUnique({ where: { id } });
    }
}
exports.default = UserService;
