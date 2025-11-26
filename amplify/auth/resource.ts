import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'profile'],
      },
      callbackUrls: [
        'https://s3.test.rug.zone/'
      ],
      logoutUrls: ['https://s3.test.rug.zone/'],
    },
  },

  userAttributes: {
    email: {
      mutable: false,
      required: true,
    },
  },
  groups: ['admin']
});
