export interface SMSService {
  sendOTP(phone: string, code: string): Promise<boolean>;
}

export interface EmailService {
  sendEscalation(packet: any): Promise<boolean>;
}

export interface FaceDetectionService {
  detectAndBlur(imageBuffer: Buffer): Promise<Buffer>;
}

// Mocks used when env keys are absent (AGENTS.md # Adapters)
export class MockSMSService implements SMSService {
  async sendOTP(phone: string, code: string) {
    console.log(`[MOCK SMS] Sending ${code} to ${phone}`);
    return true;
  }
}

export class MockEmailService implements EmailService {
  async sendEscalation(packet: any) {
    console.log(`[MOCK EMAIL] Sending escalation to authority`, packet);
    return true;
  }
}

export class MockFaceDetectionService implements FaceDetectionService {
  async detectAndBlur(imageBuffer: Buffer) {
    console.log(`[MOCK BLUR] Returning unmodified buffer`);
    return imageBuffer;
  }
}
