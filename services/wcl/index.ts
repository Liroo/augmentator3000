import { GraphQLClient } from 'graphql-request';

const WCLGraphQLEndpoint = 'https://www.warcraftlogs.com/api/v2/client';

export async function initWCLClient(WCLBearerToken: string) {
  const graphQLClient = new GraphQLClient(WCLGraphQLEndpoint, {
    headers: {
      authorization: `Bearer ${WCLBearerToken}`,
    },
  });

  return graphQLClient;
}

class WCLClient {
  client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(WCLGraphQLEndpoint);
  }

  async setWCLBearerToken(WCLBearerToken: string) {
    this.client.setHeaders({
      authorization: `Bearer ${WCLBearerToken}`,
    });
  }
}

const client = new WCLClient();

export default client;
