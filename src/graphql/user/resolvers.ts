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
};

const mutations = {
  createUser: async (_: any, payload: CreateUsePayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
