import { asNexusMethod, enumType, scalarType } from 'nexus';
import { Kind } from 'graphql/language';

import { DateTimeResolver, DateResolver, JSONResolver } from 'graphql-scalars';
import { GraphQLUpload } from 'graphql-upload';
import { DeliveryProofType, JobSchedulesEvery, OrderJobsEvery } from '@treedots/prisma';
// export const AuthType = enumType({
//   name: 'AuthType',
//   members: ['Email', 'Facebook', 'Google', 'Apple'],
// });

enum GenderType {
  Male = 'Male',
  Female = 'Female'
}
export const Gender = scalarType({
  name: 'Gender',
  asNexusMethod: 'gender',
  parseValue(value: GenderType): GenderType {
    if (GenderType[value]) {
      return value;
    }
  },
  serialize(value) {
    return value;
  }
});

export const ScalarDeliveryProof = scalarType({
  name: 'DeliveryProofType',
  asNexusMethod: 'deliveryProofType',
  parseValue(value: DeliveryProofType): DeliveryProofType {
    if (DeliveryProofType[value]) {
      return value;
    }
  },
  serialize(value) {
    return value;
  }
});

export const DecimalScalar = scalarType({
  name: 'Decimal',
  asNexusMethod: 'decimal',
  description: 'Decimal scalar type',
  parseValue(value: number) {
    return Number(value);
  },
  serialize(value) {
    return Number(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
      return Number(ast.value);
    }
    return null;
  }
});

export const ScalarJobSchedulesEvery = scalarType({
  name: 'JobSchedulesEvery',
  asNexusMethod: 'jobSchedulesEvery',
  parseValue(value: JobSchedulesEvery): JobSchedulesEvery {
    if (JobSchedulesEvery[value]) {
      return value;
    }
  },
  serialize(value) {
    return value;
  }
});

export const ScalarOrderJobsEvery = scalarType({
  name: 'OrderJobsEvery',
  asNexusMethod: 'orderJobsEvery',
  parseValue(value: OrderJobsEvery): OrderJobsEvery {
    if (OrderJobsEvery[value]) {
      return value;
    }
  },
  serialize(value) {
    return value;
  }
});

export const Upload = GraphQLUpload;
// export const scalarDate = asNexusMethod(Date, 'date');
// export const scalarDateTime = asNexusMethod(DateTime, 'dateTime')

export const resolverMap = {
  Json: JSONResolver,
  DateTime: DateTimeResolver,
  Date: DateResolver
};
