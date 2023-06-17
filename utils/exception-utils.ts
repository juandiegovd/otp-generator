export class OtpException extends Error{
    public message: string;
    public code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}