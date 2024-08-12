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
