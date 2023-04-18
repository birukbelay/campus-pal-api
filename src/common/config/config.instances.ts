import { ConfigTypes, tryReadEnv } from './configTypes';
import { ColorEnums, logTrace } from '../logger';
import * as dotenv from 'dotenv';
// import fs from 'fs';
import { LoadEnvConfig } from './loadEnvConfig';

export class EnvVar {
  private static _instance: EnvVar;
  envVariables: ConfigTypes;
  private constructor() {
    // we must have a .env file to tell us the Enviroment at first
    dotenv.config({ path: `.env` });
    const mode = tryReadEnv('NODE_ENV', '');
    // logTrace('ENv Mode == -----------', mode, ColorEnums.FgGreen);
    if (!mode) {
      dotenv.config({ path: `.env` });
      logTrace('NO NODE_ENV ', mode, ColorEnums.BgMagenta);
      this.loadEnv(false);
    } else if (mode === 'prod') {
      dotenv.config({ path: `.env.${mode}` });
      this.loadEnv(true);
    } else {
      logTrace('Mode NODE_ENV= ', mode, ColorEnums.BgCyan);
      dotenv.config({ path: `.env.${mode}` });
      this.loadEnv(false);
    }
  }
  loadEnv(req: boolean) {
    try {
      this.envVariables = LoadEnvConfig(req);
    } catch (e) {
      logTrace('FAILED TO LOAD ENV: z error is', e.message, ColorEnums.BgRed);
      throw new Error('failed to load enviroment variables, exiting');
    }
  }
  static get getInstance() {
    if (!EnvVar._instance) {
      EnvVar._instance = new EnvVar();
    }
    return this._instance.envVariables;
    // Do you need arguments? Make it a regular static method instead.
    // return this._instance || (this._instance = new this());
  }
}

export const EnvConfigs = EnvVar.getInstance;
