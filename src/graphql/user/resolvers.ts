import UserService, { CreateUsePayload } from "../../services/user";

const queries = {
  getusertoken: async (
    _: any,
    payload: { email: string; password: string }
  ) => {
    const token = await UserService.getusertoken({
      email: payload.email,
      password: payload.password,
    });
    return token;
  },
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const id = context.user.id;
      const user = await UserService.getUserById(id);
      return user;
    }
    throw new Error("I dont know who are you");
  },
};



const mutations = {
  createUser: async (_: any, payload: CreateUsePayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
