export namespace NotificationUtils{
    const URL_NOTIFICATION_SMS = `${process.env.URL_NOTIFICATION_SMS}`
    const URL_NOTIFICATION_EMAIL = `${process.env.URL_NOTIFICATION_EMAIL}`

    export function getUrlMail() {
        return URL_NOTIFICATION_EMAIL;
    }

    export function getUrlPhone() {
        return URL_NOTIFICATION_SMS;
    }
}