import { GenerateOtpRequest } from "./generate-otp-request.model";

export class GenerateOtpResponse{
    sessionId: string;
    servicio: string;
    producto: string;
    tipoDoc: string;
    nroDoc: string;
    celular: string;
    correo: string;
    codCue: string;
    otp: string;
    tiempo: number;
    codigoWS: number;
    fechaHoraSms: string;
    fechaHoraCorreo: string;

    public static create(generateOtpRequest: GenerateOtpRequest){
        if (generateOtpRequest){
            const generateOtpResponse = new GenerateOtpResponse();
            generateOtpResponse.sessionId = generateOtpRequest.sessionId;
            generateOtpResponse.servicio = generateOtpRequest.servicio;
            generateOtpResponse.producto = generateOtpRequest.producto;
            generateOtpResponse.tipoDoc = generateOtpRequest.tipoDoc;
            generateOtpResponse.nroDoc = generateOtpRequest.nroDoc;
            generateOtpResponse.codCue = generateOtpRequest.codCue;
            generateOtpResponse.celular = generateOtpRequest.celular;
            generateOtpResponse.correo = generateOtpRequest.correo;
            generateOtpResponse.tiempo = generateOtpRequest.tiempo;

            return generateOtpResponse;
        }
    }
}