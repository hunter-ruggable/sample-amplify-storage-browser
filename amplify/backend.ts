import { defineBackend } from '@aws-amplify/backend';
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { auth } from './auth/resource';



/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth
});

const customBucketStack = backend.createStack("design-image-processing-stack");

// Import existing bucket
const customBucket = Bucket.fromBucketAttributes(customBucketStack, "MyCustomBucket", {
  bucketArn: "arn:aws:s3:::design-image-processing",
  region: "us-west-2"
});

const customBucket2 = Bucket.fromBucketAttributes(customBucketStack, "MyCustomBucket2", {
  bucketArn: "arn:aws:s3:::ruggable-design-backup-backup",
  region: "us-west-2"
});

const customBucket3 = Bucket.fromBucketAttributes(customBucketStack, "MyCustomBucket3", {
  bucketArn: "arn:aws:s3:::esxi-nas-sync-prod-backup",
  region: "us-west-2"
});

backend.addOutput({
  storage: {
    aws_region: customBucket.env.region,
    bucket_name: customBucket.bucketName,
    buckets: [
      {
        aws_region: customBucket.env.region,
        bucket_name: customBucket.bucketName,
        name: customBucket.bucketName,
        paths: {
          "*": {
            guest: ["get", "list"],
            authenticated: ["get", "list", "write", "delete"],
          },
        },
      },
      {
        aws_region: customBucket2.env.region,
        bucket_name: customBucket2.bucketName,
        name: customBucket2.bucketName,
        paths: {
          "*": {
            guest: ["get", "list"],
            authenticated: ["get", "list", "write", "delete"],
          },
        },
      },
      {
        aws_region: customBucket3.env.region,
        bucket_name: customBucket3.bucketName,
        name: customBucket3.bucketName,
        paths: {
          "*": {
            guest: ["get", "list"],
            authenticated: ["get", "list", "write", "delete"],
          },
        },
      }
    ]
  },
});

// ... Unauthenticated/guest user policies and role attachments go here ...
/*
  Define an inline policy to attach to Amplify's auth role
  This policy defines how authenticated users can access your existing bucket
*/ 
const authPolicy = new Policy(backend.stack, "customBucketAuthPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "s3:GetObject",
        "s3:PutObject", 
        "s3:DeleteObject",
        "s3:GetDataAccess"
      ],
      resources: [`${customBucket.bucketArn}/*`,`${customBucket2.bucketArn}/*`, `${customBucket3.bucketArn}/*`],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `${customBucket.bucketArn}`,
        `${customBucket.bucketArn}/*`
        ],
      conditions: {
        StringLike: {
          "s3:prefix": ["Caldera-Nexio-Files/*", "Caldera-Nexio-Files/",],
        },
      },
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `${customBucket2.bucketArn}`,
        `${customBucket2.bucketArn}/*`
        ],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `${customBucket3.bucketArn}`,
        `${customBucket3.bucketArn}/*`
        ],
    }),
  ],
});

// Add the policies to the authenticated user role
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(authPolicy);