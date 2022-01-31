import gql from 'graphql-tag';

export const queryAllServiceType = gql`
  query {
    allServiceType {
      id
      name
    }
  }
`;

export const queryAllServiceTaskType = gql`
  query allServiceTaskType($service_type_id: Int) {
    allServiceTaskType(service_type_id: $service_type_id) {
      id
      name
      sync_required
    }
  }
`;
