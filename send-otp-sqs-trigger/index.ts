import { SQSEvent, SQSHandler } from "aws-lambda";
import { Otp } from "../models/aws-dynamodb/otp";
import { SendOtpRequest } from "../models/send-otp-request.model";
import { SendOtpResponse } from "../models/send-otp-response.model";
import { AWSDynamoDbService } from "../services/aws-dynamodb/aws-dynamodb.service";
import { NotificationService } from "../services/notification-service/send-message.service";

export const handler: SQSHandler = async (event: SQSEvent) => {
    const req: SendOtpRequest = JSON.parse(event.Records[0]?.body || '');
    let resp: SendOtpResponse = SendOtpResponse.create(req.sessionId);
    try{
        resp = await NotificationService.sendOtpCode(req);
        await AWSDynamoDbService.saveOtp(Otp.create(req), null);
        console.log("[SEND OTP SQS TRIGGER] Exito en generación de OTP");
    }catch(err){
        console.log("[SEND OTP SQS TRIGGER] Error en envio de OTP"+err.message);
        await AWSDynamoDbService.saveOtp(Otp.create(req), err.code);
    }
}