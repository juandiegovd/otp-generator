import { SQSEvent } from 'aws-lambda';
import { GenerateOtpRequest } from '../models/generate-otp-request.model';
import { SendOtpRequest } from '../models/send-otp-request.model';
import { FunctionUtils } from '../utils/function-utils';
import { OtpConstants } from '../utils/otp-constants';
import { OtpGenerator } from '../utils/otp-generator.function';
import { AWSSqsService } from '../services/aws-sqs/aws-sqs.service';
import { AWSSecretsManagerService } from '../services/aws-secrets-manager/aws-secrets-manager.service';

export const handler = async (event: SQSEvent) => {

  const sendSQSOtp = await AWSSecretsManagerService.getSecret("SEND_SQS_OTP");
  const sqsRoute = sendSQSOtp["SEND_SQS_URL"]+'/'+sendSQSOtp["SEND_SQS_NAME"];
  
  const req: GenerateOtpRequest = JSON.parse(event.Records[0]?.body || '');
    try {
      const otpNumber = OtpGenerator.generateOTP(OtpConstants.OTP_SIZE);
      FunctionUtils.validateGenerateOtpReq(req);
      await AWSSqsService.sendMessage(JSON.stringify(SendOtpRequest.create(req, otpNumber)), sqsRoute);
      console.log("[REQUEST OTP SQS TRIGGER] Exito en generación de OTP");
    } catch (err) {
      console.log("[REQUEST OTP SQS TRIGGER] Error en generación de OTP"+err.message);
    }
}