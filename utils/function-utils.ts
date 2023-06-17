import { GenerateOtpRequest } from "../models/generate-otp-request.model";
import { OtpExceptionCode } from "./enums/exception-code.enum";
import { OtpExceptionMessage } from "./enums/exception-message.enum";
import { OtpException } from "./exception-utils";

export namespace FunctionUtils{
    export function validateGenerateOtpReq(req: GenerateOtpRequest) {
        const validSessionId = validateNotEmptyOrNull(req.sessionId);
        const validServicio = validateNotEmptyOrNull(req.servicio);
        const validProducto = validateNotEmptyOrNull(req.producto);
        const validTipoDoc = validateNotEmptyOrNull(req.tipoDoc);
        const validNumDoc = validateNotEmptyOrNull(req.nroDoc);
        const validCodCue = validateNotEmptyOrNull(req.codCue);
        const validTiempo = req.tiempo != null;
        
        const validReq = (validSessionId && validServicio && validProducto && validTipoDoc && validNumDoc && validCodCue && validTiempo);
        if (!validReq){
            throw new OtpException(OtpExceptionCode.REQ_NOT_VALID, OtpExceptionMessage.REQ_NOT_VALID);
        }
    }


    export function validateNotEmptyOrNull(x: string){
        if (x == null || x == '') return 0;
        return 1;
    }
}