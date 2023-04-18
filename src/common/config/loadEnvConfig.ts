import {
  ConfigTypes,
  getFireBasePrivateKey,
  getMongoUri,
  tryReadEnv,
} from './configTypes';

export const LoadEnvConfig = (req = false): ConfigTypes => {
  return {
    mode: tryReadEnv('NODE_ENV'),
    port: parseInt(tryReadEnv('PORT', '6040', req)),
    serverUrl: tryReadEnv('SERVER_URL', `http://localhost:5025`, req),
    clientUrl: tryReadEnv('CLIENT_URL', `http://localhost:3000`, req),
    mongodbUri: getMongoUri('MONGODB_URI', 'mongodb://127.0.0.1/test1'),
    sessionSecret: tryReadEnv('SESSION_SECRET', `some-very-strong-secret`, req),
    cookieSecret: tryReadEnv('COOKIE_SECRET', `some-very-strong-secret`, req),
    jwt: {
      jwtAccessSecret: tryReadEnv(
        'JWT_SECRET',
        `some-very-strong-jwt-secret`,
        req,
      ),
      jwtAccessExpiredTime: parseInt(
        tryReadEnv('JWT_EXPIRED_TIME', '7200', req),
      ),
      jwtRefreshSecret: tryReadEnv(
        'JWT_REFRESH_SECRET',
        `some-very-strong-jwt-refresh-secret`,
      ),
      jwtRefreshExpiredTime: parseInt(
        tryReadEnv('JWT_REFRESH_EXPIRED_TIME', '2592000', req),
      ),
    },
    email: {
      sendgridApiKey: tryReadEnv('SENDGRID_API_KEY', ''),
      emailSender: tryReadEnv('EMAIL_AUTH_USER', 'your-email@yopmail.com'),
      user: tryReadEnv('EMAIL_USER', ''),
      host: tryReadEnv('EMAIL_HOST', ''),
      pass: tryReadEnv('EMAIL_PASSWORD', `email password`),
    },
    firebaseConfig: {
      client_email: tryReadEnv(
        'FIREBASE_CLIENT_EMAIL',
        'email@gserviceaccount.com',
      ),
      project_id: tryReadEnv('FIREBASE_PROJECT_ID', ''),
      private_key: getFireBasePrivateKey(),
      type: tryReadEnv('FIREBASE_TYPE', ''),
      private_key_id: tryReadEnv('FIREBASE_PRIVATE_KEY_ID', ''),
      client_id: tryReadEnv('FIREBASE_CLIENT_ID', ''),
      auth_uri: tryReadEnv('FIREBASE_AUTH_URI', ''),
      token_uri: tryReadEnv('FIREBASE_TOKEN_URI', ''),
      auth_provider_x509_cert_url: tryReadEnv(
        'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
        '',
      ),
      client_x509_cert_url: tryReadEnv('FIREBASE_CLIENT_X509_CERT_URL', ''),
    },
    // firebaseServiceAccount: {
    //     clientEmail:
    //         tryReadEnv('FIREBASE_CLIENT_EMAIL' , 'email@gserviceaccount.com'),
    //     projectId: tryReadEnv('FIREBASE_PROJECT_ID' , ''),
    //     privateKey: getFireBasePrivateKey(),
    // },
    firebase: {
      storageBucket: tryReadEnv('FIREBASE_STORAGE_BUCKET', ''),
      databaseURL: tryReadEnv('FIREBASE_DATABASE_URL', ''),
    },
  };
};
