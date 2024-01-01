import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import createGraphqlServer from './graphql';
import UserService from './services/user';
import { decode } from 'jsonwebtoken';
// import { prismaclient } from './lib/db';

async function init() {
const app = express()
const PORT = Number(process.env.PORT)|| 8000
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({message:'Server Is Up And Running'})
});

// app.use('/graphql', expressMiddleware(await createGraphqlServer()));
app.use(
    "/graphql",
    expressMiddleware(await createGraphqlServer(), {
      context: async ({ req }) => {
        // @ts-ignore
        const token = req.headers["token"];

        try {
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

app.listen(PORT,()=> console.log(`Server Started At PORT:${PORT}`));
    
}
init();