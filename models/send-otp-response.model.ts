export class SendOtpResponse{
    sessionId: string;
    fechaHoraSms: string;
    fechaHoraCorreo: string;
    codigoWS: string;

    public static create(sessionId: string){
        const sendOtpResponse = new SendOtpResponse();
        sendOtpResponse.sessionId = sessionId;
        return sendOtpResponse;
    }
}