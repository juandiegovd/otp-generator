export namespace OtpGenerator{
    export function generateOTP(size: number){
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < size; i++ ) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }
}