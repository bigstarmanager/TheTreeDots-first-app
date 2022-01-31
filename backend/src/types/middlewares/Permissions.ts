import { AuthenticationError } from 'apollo-server-express';
import { rule, shield, allow } from 'graphql-shield';
import { getUserCredentials } from '../utils/auth';
import { bulkAssignTask } from 'types/resolvers/mutations/bulkAssignTask';

const isAuthenticated = rule()((parent, args, context) => {
  const token = getUserCredentials(context);
  context.request.user = token;
  return token !== null;
});

export const permissions = shield(
  {
    Mutation: {
      signIn: allow,
      deleteUser: allow,
      updateUserById: allow,
      updateTeamAndUserIdInTask: allow,
      bulkAssignTask: allow,
      bulkAssignService: allow
    },
    Query: {
      allServiceType: allow
    },
    TlUsers: allow,
    TlTeamUsers: allow,
    TlTeamUserAccess: allow,
    TlRoles: allow,
    TlServiceTaskType: allow,
    TlServiceType: allow,
    TlJobs: allow,
    TlTasks: allow
  },
  {
    fallbackRule: isAuthenticated, // Default rule
    allowExternalErrors: true,
    fallbackError: new AuthenticationError('Not Authorized!')
  }
);
