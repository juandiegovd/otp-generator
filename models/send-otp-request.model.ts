import { GenerateOtpRequest } from "./generate-otp-request.model";

export class SendOtpRequest{
    sessionId: string;
    servicio: string;
    producto: string;
    tipoDoc: string;
    nroDoc: string;
    codCue: string;
    otp: string;
    celular: string;
    correo: string;
    tiempo: number;

    public static create(req: GenerateOtpRequest, otp: string){
        if (req && otp){
            const sendOtpRequest= new SendOtpRequest();
            sendOtpRequest.sessionId = req.sessionId;
            sendOtpRequest.correo = req.correo;
            sendOtpRequest.celular = req.celular;
            sendOtpRequest.otp = otp;

            sendOtpRequest.producto = req.producto;
            sendOtpRequest.servicio = req.servicio;
            sendOtpRequest.tipoDoc = req.tipoDoc;
            sendOtpRequest.nroDoc = req.nroDoc;
            sendOtpRequest.codCue = req.codCue;
            sendOtpRequest.tiempo = req.tiempo;

            return sendOtpRequest;
        }
    }
}