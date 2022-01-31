import gql from 'graphql-tag';

export const getAllZonesByTeamId = gql`
  query getAllZonesByTeamId($team_id: Int) {
    getAllZonesByTeamId(team_id: $team_id) {
      id
      name
      description
      paths
      team_id
    }
  }
`;
export const updateZone = gql`
  mutation updateZone($zone_id: Int!, $data: ZoneInput) {
    updateZone(zone_id: $zone_id, data: $data) {
      id
      name
      description
      paths
      team_id
    }
  }
`;
export const addNewZone = gql`
  mutation addNewZone($name: String!, $description: String!, $paths: [PathInput], $team_id: Int!) {
    addNewZone(name: $name, description: $description, paths: $paths, team_id: $team_id) {
      id
      name
      description
      paths
      team_id
    }
  }
`;
export const deleteZone = gql`
  mutation deleteZone($zone_id: Int!) {
    deleteZone(zone_id: $zone_id)
  }
`;
