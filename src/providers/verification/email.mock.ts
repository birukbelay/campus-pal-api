import { Injectable } from './dependencies';
import { VerificationServiceInterface } from './verification.interface';
import { ColorEnums, logTrace } from './dependencies';

@Injectable()
export class EmailMockService implements VerificationServiceInterface {
  sendEmailLinkConfirmation(email: string, token: string): Promise<void> {
    return Promise.resolve(undefined);
  }
  sendVerificationCode(to: string, code: string): Promise<void> {
    logTrace(
      '------------------------------',
      '--------------------',
      ColorEnums.BgWhite,
    );
    logTrace(
      '----------------------||||',
      '--------------------',
      ColorEnums.FgYellow,
    );
    logTrace('----------------------TO:', to, ColorEnums.FgYellow);
    logTrace('----------------------Code :', code, ColorEnums.FgYellow);
    logTrace(
      '-------------------------------=====',
      '--------------------',
      ColorEnums.FgYellow,
    );
    logTrace(
      '------------------------------',
      '--------------------',
      ColorEnums.BgWhite,
    );
    return Promise.resolve(undefined);
  }
}
