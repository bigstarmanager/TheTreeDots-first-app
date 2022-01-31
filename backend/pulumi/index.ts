import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

const env = pulumi.getStack();
const config = new pulumi.Config();

const coreStack = new pulumi.StackReference(config.require('coreStack'));

const name = `3pl-graphql-${env}`;
const baseTags = {
  Project: 'Pulumi GraphQL API',
  PulumiStack: env
};
const description = `${baseTags.Project} Application`;

// Get core VPC
const vpcId = coreStack.getOutput('vpcId');
const vpc = awsx.ec2.Vpc.fromExistingIds(`${name}-service-vpc`, { vpcId });

// Get core subnet ids
const publicSubnetIds = coreStack.getOutput('publicSubnetIds');

// Create ALB with target groups and listeners
const albSecGroup = [
  new awsx.ec2.SecurityGroup(`${name}-service-alb-sg`, {
    vpc,
    tags: {
      ...baseTags,
      Name: `${description} ALB Security Group`
    }
  })
];
const alb = new awsx.lb.ApplicationLoadBalancer(`${name}-service-alb`, {
  vpc,
  external: true,
  subnets: publicSubnetIds,
  securityGroups: albSecGroup,
  tags: {
    ...baseTags,
    Name: `${description} ALB`
  }
});
alb.createListener(`${name}-http`, {
  port: 80,
  protocol: 'HTTP',
  defaultAction: {
    type: 'redirect',
    redirect: {
      port: '443',
      protocol: 'HTTPS',
      statusCode: 'HTTP_301'
    }
  }
});
const target = alb.createTargetGroup(`${name}-tg`, {
  vpc,
  port: 80,
  protocol: 'HTTP',
  targetType: 'ip',
  tags: {
    ...baseTags,
    Name: `${description} ALB Target Group`
  }
});
const httpsListener = target.createListener(`${name}-https`, {
  port: 443,
  protocol: 'HTTPS',
  sslPolicy: 'ELBSecurityPolicy-2016-08',
  certificateArn: config.require('certificateArn')
});

// Build docker image
const img = awsx.ecs.Image.fromDockerBuild(name, {
  context: '../../..',
  dockerfile: '../Dockerfile'
});

// Create ECS cluster
const cluster = new awsx.ecs.Cluster(`${name}-cluster`, {
  vpc,
  securityGroups: [],
  tags: {
    ...baseTags,
    Name: `${description} ECS Cluster`
  }
});

// Create Fargate service
const appSecGroup = [
  new awsx.ec2.SecurityGroup(`${name}-service-sg`, {
    vpc,
    ingress: [
      {
        fromPort: 80,
        toPort: 80,
        protocol: 'tcp',
        cidrBlocks: ['0.0.0.0/0']
      }
    ],
    egress: [{ fromPort: 0, toPort: 0, protocol: '-1', cidrBlocks: ['0.0.0.0/0'] }],
    tags: {
      ...baseTags,
      Name: `${description} App Security Group`
    }
  })
];
// const dbEndpoint = coreStack.getOutput('dbEndpoint');
// const dbName = coreStack.getOutput('dbName');
// const dbAppPass = coreStack.getOutput('dbAppPass');
interface ServiceConfig {
  environment: Record<string, string>;
  secrets: Record<string, pulumi.Output<string>>;
}
const serviceConfig = config.getObject<ServiceConfig>('service');
const serviceEnvironmentConfig = serviceConfig?.environment || {};
const serviceSecretsConfig = serviceConfig?.secrets || {};
const serviceSecretKeys = [];
const serviceSecretParams = [];
for (const key in serviceSecretsConfig) {
  const value = serviceSecretsConfig[key];
  const secretParam = new aws.ssm.Parameter(`${name}-${key}`, {
    type: 'SecureString',
    value
  });
  serviceSecretKeys.push(key);
  serviceSecretParams.push(secretParam);
}
const serviceExecutionRole = new aws.iam.Role(`${name}-service-execution-role`, {
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Principal: {
          Service: 'ecs-tasks.amazonaws.com'
        },
        Effect: 'Allow',
        Sid: ''
      }
    ]
  },
  tags: {
    ...baseTags,
    Name: `${description} Fargate Service Execution Role`
  }
});
new aws.iam.RolePolicyAttachment(`${name}-service-ssm-policy-attachment`, {
  role: serviceExecutionRole.name,
  policyArn: 'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore'
});
new aws.iam.RolePolicyAttachment(`${name}-service-ecs-policy-attachment`, {
  role: serviceExecutionRole.name,
  policyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy'
});
new awsx.ecs.FargateService(`${name}-service`, {
  cluster,
  assignPublicIp: config.getBoolean('serviceAssignPublicIp'),
  subnets: publicSubnetIds,
  securityGroups: appSecGroup,
  desiredCount: config.getNumber('serviceDesiredCount') || 2,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    containers: {
      [name]: {
        image: img,
        cpu: config.getNumber('serviceCpu') || 256,
        memory: config.getNumber('serviceMemory') || 512,
        portMappings: [httpsListener],
        environment: Object.keys(serviceEnvironmentConfig).map((name) => ({
          name,
          value: serviceEnvironmentConfig[name]
        })),
        secrets: pulumi.all(serviceSecretParams.map((param) => param.arn)).apply((serviceSecretParamsArns) =>
          serviceSecretParamsArns.map((arn, index) => ({
            name: serviceSecretKeys[index],
            valueFrom: arn
          }))
        )
      }
    },
    executionRole: serviceExecutionRole
  },
  tags: {
    ...baseTags,
    Name: `${description} Fargate Service`
  }
});

export const url = httpsListener.endpoint.hostname;
