import { SendOtpRequest } from "../send-otp-request.model";

export class Otp{
    id: number;
    sessionId: string;
    nro_servicio: string;
    cod_prod: string;
    tip_id: string;
    num_id: string;
    cod_cue: string;
    tiempo: number;
    otp: string;
    fechahorasms: Date;
    fechahoracorreo: Date;
    celular: string;
    correo: string;
    estado: number;
    codError: number;

    public static create(sendOtpRequest: SendOtpRequest){
        const otp = new Otp();
        otp.sessionId = sendOtpRequest.sessionId;
        otp.nro_servicio = sendOtpRequest.servicio;
        otp.cod_prod = sendOtpRequest.producto;
        otp.tip_id = sendOtpRequest.tipoDoc;
        otp.num_id = sendOtpRequest.nroDoc;
        otp.cod_cue = sendOtpRequest.codCue;
        otp.tiempo = sendOtpRequest.tiempo;
        otp.celular = sendOtpRequest.celular;
        otp.correo = sendOtpRequest.correo;
        otp.otp = sendOtpRequest.otp;
        otp.estado = 0;
        return otp;
    }
}