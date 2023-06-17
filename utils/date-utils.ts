export namespace DateUtils{
    export function getLocalDateTimeNow(){
        const date = new Date();
        const date2 = date.toUTCString();
        const date3 = new Date(date2)
        date3.setHours(date3.getHours()-5);
        return date3.toISOString();
    }

    export function compareDates(dateOtpStr: string, secondsMax: number){
        const actualDate = new Date(getLocalDateTimeNow());
        const dateOtp = new Date(dateOtpStr);

        const secondsDif = (actualDate.getTime()-dateOtp.getTime())/1000;
        if (secondsDif > secondsMax) return 0;
        return 1;
    }
}