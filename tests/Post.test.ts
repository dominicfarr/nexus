import { ServerInfo } from 'apollo-server';
import getPort, { makeRange } from 'get-port';
import { GraphQLClient } from 'graphql-request';
import { server } from '../api/server';

type TestContest = {
  client: GraphQLClient;
};
export function createTestContext(): TestContest {
  const context = {} as TestContest;
  const graphqlTestCtx = graphqlTestContext();

  beforeEach(async () => {
    const client = await graphqlTestCtx.before();
    Object.assign(context, {
      client,
    });
  });

  afterEach(async () => {
    await graphqlTestCtx.after();
  });

  return context;
}
function graphqlTestContext() {
  let serverInstance: ServerInfo | null = null;

  return {
    async before() {
      const port = getPort({ port: makeRange(4000, 6000) });
      serverInstance = await server.listen(port);
      return new GraphQLClient(`http://localhost:${port}`);
    },
    async after() {
      serverInstance?.server.close();
    },
  };
}
