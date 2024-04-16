import { GraphQLClient } from "graphql-request";

const WCLGraphQLEndpoint = "https://www.warcraftlogs.com/api/v2/client";

export async function generateWCLBearerToken() {
  const res = await fetch("https://www.warcraftlogs.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(
        `${process.env.WARCRAFTLOGS_CLIENT_ID}:${process.env.WARCRAFTLOGS_CLIENT_SECRET}`
      )}`,
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
    }),
  });

  const data = await res.json();

  return data.access_token;
}

export async function initWCLClient() {
  const WCLBearerToken = await generateWCLBearerToken();

  const graphQLClient = new GraphQLClient(WCLGraphQLEndpoint, {
    headers: {
      authorization: `Bearer ${WCLBearerToken}`,
    },
  });

  return graphQLClient;
}
