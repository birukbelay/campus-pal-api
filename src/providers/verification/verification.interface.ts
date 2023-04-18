export interface VerificationServiceInterface {
  sendVerificationCode(to: string, code: string): Promise<void>;
  sendEmailLinkConfirmation(email: string, token: string): Promise<void>;
}
