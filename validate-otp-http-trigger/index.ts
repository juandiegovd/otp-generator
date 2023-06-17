import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ValidateOtpRequest } from '../models/validate-otp-request.model';
import { ValidateOtpResponse } from '../models/validate-otp-response.model';
import { AWSDynamoDbService } from "../services/aws-dynamodb/aws-dynamodb.service";
import { DateUtils } from "../utils/date-utils";
import { ValidateOtpCodWs } from "../utils/enums/validate-otp-codws.enum";
import { FunctionUtils } from "../utils/function-utils";
import { ValidateOtpResult } from "../utils/enums/validate-otp-result.enum";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const req: ValidateOtpRequest = JSON.parse(event.body || '');
    const resp: ValidateOtpResponse = new ValidateOtpResponse();
    try{
        const otpArray = await AWSDynamoDbService.getOtp(req.servicio, req.producto, req.tipoDoc, req.nroDoc,req.codCue);
        if (otpArray.length > 0){
            const otp = otpArray.filter((element) => element.ESTADO == 0)[0];
            const fechaHora = FunctionUtils.validateNotEmptyOrNull(otp.FECHAHORASMS) ? otp.FECHAHORASMS : FunctionUtils.validateNotEmptyOrNull(otp.FECHAHORACORREO) ? otp.FECHAHORACORREO : "";
            if (fechaHora == '') throw new Error();
            
            if (req.otp == otp.OTP){
                if (DateUtils.compareDates(fechaHora, otp.TIEMPO)) {
                    resp.resultado = ValidateOtpResult.OTP_SUCCESS;
                    resp.codigoWS = ValidateOtpCodWs.OTP_SUCCESS;
                }
                else{
                    resp.resultado = ValidateOtpResult.OTP_EXPIRED;
                    resp.codigoWS = ValidateOtpCodWs.OTP_EXPIRED;
                }
            }
            else{
                resp.resultado = ValidateOtpResult.OTP_FAIL;
                resp.codigoWS = ValidateOtpCodWs.OTP_FAIL;
            }
        }
        else{
            resp.resultado = ValidateOtpResult.OTP_NOT_FOUND;
            resp.codigoWS = ValidateOtpCodWs.OTP_NOT_FOUND;
        }
        return {
            statusCode: 200,
            body: JSON.stringify(resp)
        };
    } catch (err) {
        resp.codigoWS = ValidateOtpCodWs.ERROR_WS;
        console.log("[VALIDATE OTP HTTP TRIGGER] Error en validación de OTP",err.message);
        return {
            statusCode: 500,
            body: err,
        };
    }
    
}