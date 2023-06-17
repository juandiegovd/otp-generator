import { SendOtpRequest } from "../send-otp-request.model";

export class Otp{
    id: number;
    sessionId: string;
    nro_servicio: number;
    cod_prod: number;
    tip_id: string;
    num_id: number;
    cod_cue: number;
    tiempo: number;
    otp: number;
    fechahorasms: Date;
    fechahoracorreo: Date;
    celular: string;
    correo: string;
    estado: number;
    codError: number;

    public static create(sendOtpRequest: SendOtpRequest){
        const otp = new Otp();
        otp.sessionId = sendOtpRequest.sessionId;
        otp.nro_servicio = Number.parseInt(sendOtpRequest.servicio);
        otp.cod_prod = Number.parseInt(sendOtpRequest.producto);
        otp.tip_id = sendOtpRequest.tipoDoc;
        otp.num_id = Number.parseInt(sendOtpRequest.nroDoc);
        otp.cod_cue = Number.parseInt(sendOtpRequest.codCue);
        otp.tiempo = sendOtpRequest.tiempo;
        otp.celular = sendOtpRequest.celular;
        otp.correo = sendOtpRequest.correo;
        otp.otp = Number.parseInt(sendOtpRequest.otp);
        otp.estado = 0;
        return otp;
    }
}