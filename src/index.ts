import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
    const app = express()
const PORT = Number(process.env.PORT)|| 8000
app.use(express.json())
//Create GraphQL Server
const server = new ApolloServer({
    typeDefs:'',//schemas
    resolvers:{},//resolvers or actual function
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