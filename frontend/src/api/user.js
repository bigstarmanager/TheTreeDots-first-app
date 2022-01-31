import gql from 'graphql-tag';

export const mutationUserSignIn = gql`
  mutation signIn($identity: String!, $password: String!) {
    signIn(identity: $identity, password: $password) {
      id
      first_name
      last_name
      email
      token
      tokenJWT
      TlTeamUsers {
        id
        tl_team_id
      }
      TlTeamUserAccess {
        id
        tl_role_id
        TlRoles {
          id
          name
        }
      }
    }
  }
`;

export const queryMe = gql`
  query getOneUser {
    getOneUser {
      id
      first_name
      last_name
      email
      token
      tokenJWT
      TlTeamUsers {
        id
        tl_team_id
      }
      TlTeamUserAccess {
        id
        tl_role_id
        TlRoles {
          id
          name
        }
      }
    }
  }
`;
