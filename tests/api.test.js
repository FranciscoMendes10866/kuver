const { test } = require("uvu");
const assert = require("uvu/assert");
const { request, gql } = require("graphql-request");

test("Should get the post and user data through the given id", async () => {
  const query = gql`
    query {
      find(id: 1) {
        title
        body
        user {
          username
          email
          address {
            street
          }
          company {
            name
          }
        }
      }
    }
  `;
  const { find: data } = await request("http://localhost:3333/graphql", query);
  assert.instance(data, Object);
  assert.instance(data.user, Object);
  assert.instance(data.user.address, Object);
  assert.equal(data.user.username, "Bret");
  assert.equal(data.user.address.street, "Kulas Light");
});

test.run();
