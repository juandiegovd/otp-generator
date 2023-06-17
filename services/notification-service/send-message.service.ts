import { SendOtpRequest } from "../../models/send-otp-request.model";
import axios, { AxiosError, AxiosRequestConfig} from "axios";
import { FunctionUtils } from "../../utils/function-utils";
import { SendOtpResponse } from "../../models/send-otp-response.model";
import { OtpException } from "../../utils/exception-utils";
import { OtpExceptionCode } from "../../utils/enums/exception-code.enum";
import { OtpExceptionMessage } from "../../utils/enums/exception-message.enum";
import { AWSSecretsManagerService } from "../aws-secrets-manager/aws-secrets-manager.service";

export namespace NotificationService{
    
    const subject = "Código de validación";
    const template = process.env.TEMPLATE_NOTIFICATION;

    export async function sendOtpCode(sendOtpRequest: SendOtpRequest): Promise<SendOtpResponse>{
        if (FunctionUtils.validateNotEmptyOrNull(sendOtpRequest.celular)){
            return await sendMessagePhone(sendOtpRequest);
        }
        else if(FunctionUtils.validateNotEmptyOrNull(sendOtpRequest.correo)){
            return await sendMessageMail(sendOtpRequest);
        }
        else{
            throw new OtpException(OtpExceptionCode.GENERIC_ERROR, OtpExceptionMessage.GENERIC_ERROR);
        }
    }

    async function sendMessageMail(sendOtpRequest: SendOtpRequest){
        const recipient = sendOtpRequest.correo;
        const secret = await AWSSecretsManagerService.getSecret("SEND_MASIV_PARAMETERS");
        const config: AxiosRequestConfig = {
            headers:{
                Authorization: 'Basic '+secret["TOKEN_NOTIFICATION"]
            }
        }
        const res = {
            Subject: subject,
            From: secret["EMAIL_FROM"],
            Template: {
                Type: "text/html",
                Value: template+sendOtpRequest.otp
            },
            ReplyTo: secret["REPLY_EMAIL_TO"],
            Recipients:[{
                To: recipient
            }]
        };
        console.log("[SEND MESSAGE SERVICE] Send Message to Mail: ", res);
        return await axios.post<string>(secret["URL_NOTIFICATION_EMAIL"], res, config)
            .then((response) =>{
                console.log("[SEND MESSAGE SERVICE] Response: ", response);
                if (response.status === 200){
                    console.log("[SEND MESSAGE SERVICE] Envio exitoso");
                    return response.data['message'];
                }else{
                    console.log("[SEND MESSAGE SERVICE] Codigo de error:", response.status);
                    throw new OtpException(OtpExceptionCode.OTP_EMAIL_NOT_SEND, OtpExceptionMessage.OTP_EMAIL_NOT_SEND);
                }
            })
            .catch((err: AxiosError) => {
                console.log("[SEND MESSAGE SERVICE] Error in sending:", err.message);
                throw new OtpException(OtpExceptionCode.OTP_EMAIL_NOT_SEND, OtpExceptionMessage.OTP_EMAIL_NOT_SEND);
            });
    }

    async function sendMessagePhone(sendOtpRequest: SendOtpRequest){
        const recipient = "51"+sendOtpRequest.celular;
        const secret = await AWSSecretsManagerService.getSecret("SEND_MASIV_PARAMETERS");
        const config: AxiosRequestConfig = {
            headers:{
                Authorization: 'Basic '+secret["TOKEN_NOTIFICATION"]
            }
        }
        const res = {
            originator: secret["SMS_ORIGINATOR"],
            text: template+sendOtpRequest.otp,
            to: recipient
        };
        console.log("[SEND MESSAGE SERVICE] Send Message to SMS: ", res);
        return await axios.post<string>(secret["URL_NOTIFICATION_SMS"], res, config)
            .then((response) =>{
                if (response.status === 200){
                    console.log("[SEND MESSAGE SERVICE] Envio exitoso");
                    return response.data['message'];
                }else{
                    console.log("[SEND MESSAGE SERVICE] Codigo de error:", response.status);
                    throw new OtpException(OtpExceptionCode.OTP_SMS_NOT_SEND, OtpExceptionMessage.OTP_SMS_NOT_SEND);
                }
            })
            .catch((err: AxiosError) => {
                console.log("[SEND MESSAGE SERVICE] Error in sending:", err.message);
                throw new OtpException(OtpExceptionCode.OTP_SMS_NOT_SEND, OtpExceptionMessage.OTP_SMS_NOT_SEND);
            });
    }
}