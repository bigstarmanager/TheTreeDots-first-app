import gql from 'graphql-tag';

export const allDriverUnderTeam = gql`
  query allDriverUnderTeam($teamId: Int) {
    allDriverUnderTeam(teamId: $teamId) {
      id
      email
      mobile
      first_name
      last_name
    }
  }
`;

export const allUsersUnderTeam = gql`
  query allUsersUnderTeam($teamId: Int) {
    allUsersUnderTeam(teamId: $teamId) {
      id
      email
      mobile
      first_name
      last_name
    }
  }
`;
export const mutationCreateUser = gql`
  mutation mutationCreateUser(
    $first_name: String!
    $last_name: String!
    $email: String!
    $mobile: String!
    $password: String!
    $tl_role_id: Int!
    $tl_team_id: Int!
  ) {
    addNewUser(
      first_name: $first_name
      last_name: $last_name
      email: $email
      mobile: $mobile
      password: $password
      tl_role_id: $tl_role_id
      tl_team_id: $tl_team_id
    ) {
      id
    }
  }
`;
export const mutationUpdateUser = gql`
  mutation mutationUpdateUser(
    $id: Int!
    $first_name: String
    $last_name: String
    $email: String
    $mobile: String
  ) {
    updateUserById(id: $id, first_name: $first_name, last_name: $last_name, email: $email, mobile: $mobile) {
      id
    }
  }
`;
export const mutationDeleteUser = gql`
  mutation mutationDeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;
