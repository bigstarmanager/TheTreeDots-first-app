import ApolloClient from 'apollo-client';
import { HttpLink, createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getToken } from '../utils/user-local';
import { ApolloLink, concat } from 'apollo-link';
import VueApollo from 'vue-apollo';
import config from 'src/config';
const getHeaders = () => {
  const headers = {};
  const token = getToken();
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  return headers;
};
const graphqlUrl = config.vue_app_base_url;
const httpLink = createHttpLink({
  uri: graphqlUrl
});
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: getHeaders()
  });
  return forward(operation);
});

export const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({
    addTypename: true
  })
});
export const apolloProvider = new VueApollo({
  defaultClient: client,
  errorHandler: ({ graphQLErrors, networkError }) => {
    console.log('graphQLErrors :::', graphQLErrors);
    console.log('networkError :::', networkError);
  }
});
export default ({ app, Vue }) => {
  Vue.use(VueApollo);
  app.apolloProvider = apolloProvider;
};
