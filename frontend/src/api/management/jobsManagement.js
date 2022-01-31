import gql from 'graphql-tag';

export const queryAllJobs = gql`
  query queryAllJobs {
    allJobs {
      id
      td_tenant_id
      td_invoice_id
      td_order_id
      delivery_date
    }
  }
`;
