import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'design-image-processing', // Replace with your existing bucket name
  isDefault: true,
  bucketName: 'design-image-processing', // Specify the existing bucket name here
  access: (allow) => ({
    'public/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'admin/*': [
      allow.groups(['admin']).to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
  }),
});
