import { OtpExceptionCode } from "../../utils/enums/exception-code.enum";
import { OtpExceptionMessage } from "../../utils/enums/exception-message.enum";
import { OtpException } from "../../utils/exception-utils";

var AWS = require('aws-sdk');

export namespace AWSSqsService{
  const REGION = process.env.REGION;
  const config = {
    region: REGION
  }
  
  AWS.config.update(config);

  export async function sendMessage(message: string,queueName: string){
    const params = {
      DelaySeconds: 10,
      MessageBody: message,
      QueueUrl: queueName
    };


    try {
      const sqs = new AWS.SQS();
      const data = await sqs.sendMessage(params).promise();
      console.log("[SQS SERVICE] Send Message to SQS with id: ", data.MessageId);
      return data;
    } catch (err) {
      console.log("[SQS SERVICE] Error Send Message to SQS: ", err);
      throw new OtpException(OtpExceptionCode.GENERIC_ERROR, OtpExceptionMessage.GENERIC_ERROR);
    }
  }
}