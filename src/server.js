const Fastify = require("fastify");
const mercurius = require("mercurius");
const { gql } = require("graphql-request");
const axios = require("axios");

const app = Fastify();

const schema = gql`
  type Company {
    name: String
    catchPhrase: String
    bs: String
  }
  type Geo {
    lat: String
    lng: String
  }
  type Address {
    street: String
    suite: String
    city: String
    zipcode: String
    geo: Geo
  }
  type User {
    id: ID
    name: String
    username: String
    email: String
    phone: String
    website: String
    company: Company
    address: Address
  }
  type Find {
    userId: ID
    id: ID
    title: String
    body: String
    user: User
  }
  type Query {
    find(id: ID): Find
  }
`;

const resolvers = {
  Query: {
    find: async (root, { id }, ctx) => {
      const getUser = axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
      const getPost = axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
      const promises = await axios.all([getUser, getPost]);
      const user = promises[0].data;
      const post = promises[1].data[0];
      return { ...post, user };
    },
  },
};

app.register(mercurius, {
  schema,
  resolvers,
});

async function start(port) {
  try {
    await app.listen(port, () => {
      console.log(`Api running at http://localhost:${port}/graphql`);
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
}
start(3333);
