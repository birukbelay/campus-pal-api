import { ColorEnums, logTrace } from '../logger';

export function getMongoUri(uri: string, defaultVal = '', required = false) {
  const MongoTest = 'MONGODB_TEST_URI';
  if (process.env['NODE_ENV'] == 'test') {
    // logTrace('MongoENv=', 'TEST');
    return tryReadEnv(MongoTest, 'mongodb://127.0.0.1:27017/test3', required);
    // if (MongoTest in process.env) return process.env[MongoTest];
    // else return 'mongodb://127.0.0.1:27017/test3';
  }

  return tryReadEnv(uri, defaultVal, required);
}
export function tryReadEnv(
  variableId: string,
  defaultVal?: string,
  required = false,
) {
  if (variableId in process.env) {
    return process.env[variableId]!;
  }
  // if the Variable is Not Found
  if (process.env['NODE_ENV'] == 'production' || required) {
    throw new Error(
      `failed to read '${variableId}' environment variable, This IS a Production Enviroment`,
    );
  }
  if (defaultVal != null) {
    return defaultVal;
  }
  throw new Error(`failed to read '${variableId}' environment variable`);
}
export const getFireBasePrivateKey = () => {
  const pkey = tryReadEnv('FIREBASE_PRIVATE_KEY', '');
  try {
    // logTrace('Original value==', pkey, LogColors.BgYellow)
    const result = pkey.replace(/'/g, '"');
    // logTrace("replaced Value", result)
    const privateKey = JSON.parse(result);
    // logTrace('json parsed value==-', privateKey, LogColors.BgCyan)
    return privateKey.privateKey;
  } catch (e) {
    logTrace('error==', e.message, ColorEnums.BgYellow);
  }
};

export interface ConfigTypes {
  mode: string;
  port: number;
  serverUrl: string;
  clientUrl: string;
  mongodbUri: string;
  sessionSecret: string;
  cookieSecret: string;
  jwt: {
    jwtAccessSecret: string;
    jwtAccessExpiredTime: number;
    jwtRefreshSecret: string;
    jwtRefreshExpiredTime: number;
  };

  email: {
    sendgridApiKey: string;
    emailSender: string;
    host: string;
    user: string;
    pass: string;
  };

  firebaseConfig: {
    type: string;
    project_id: string;
    private_key: string;
    private_key_id: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
  };
  firebaseServiceAccount?: {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
  };

  firebase: {
    storageBucket: string;
    databaseURL: string;
  };
}

export const _CONF_NAMES: ConfigTypes = {
  clientUrl: '',
  cookieSecret: '',
  email: { emailSender: '', host: '', pass: '', sendgridApiKey: '', user: '' },
  firebase: { databaseURL: '', storageBucket: '' },
  firebaseConfig: {
    auth_provider_x509_cert_url: '',
    auth_uri: '',
    client_email: '',
    client_id: '',
    client_x509_cert_url: '',
    private_key: '',
    private_key_id: '',
    project_id: '',
    token_uri: '',
    type: '',
  },
  firebaseServiceAccount: {},
  jwt: {
    jwtAccessExpiredTime: 0,
    jwtAccessSecret: '',
    jwtRefreshExpiredTime: 0,
    jwtRefreshSecret: '',
  },
  mode: '',
  mongodbUri: 'MONGODB_URI',
  port: 0,
  serverUrl: '',
  sessionSecret: '',
};
