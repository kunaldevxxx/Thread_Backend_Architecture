import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaclient } from './lib/db';

async function init() {
    const app = express()
const PORT = Number(process.env.PORT)|| 8000
app.use(express.json())
//Create GraphQL Server
const server = new ApolloServer({
    typeDefs:`
    type Query {
        hello:String,
        say(name:String):String,
    }
    type Mutation {
        createUser(firstName:String!,lastName:String!,email:String!,password:String!): Boolean
    } 
    `, //schemas
    resolvers:{
        Query: {
            hello:()=>`Hey There I Am Server`,
            say:(_,{name}:{name:string})=>`Hey ${name}`,
        },
        Mutation: {
            createUser:async(_,{firstName,lastName,email,password}:{firstName:string;lastName:string;email:string;password:string})=>{
                await  prismaclient.user.create({
                    data:{
                        firstName,
                        lastName,
                        email,
                        password,
                        salt:"random_salt",
                    },
                });
                return true;
            }
        }
        
        
    },//resolvers or actual function
  });
//Start GraphQL Server
await server.start();
app.get('/',(req,res)=>{
    res.json({message:'Server Is Up And Running'})
})
app.use('/graphql', expressMiddleware(server));

app.listen(PORT,()=> console.log(`Server Started At PORT:${PORT}`))
    
}
init();