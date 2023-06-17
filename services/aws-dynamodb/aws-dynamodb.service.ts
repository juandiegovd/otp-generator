import { Otp } from "../../models/aws-dynamodb/otp";
import { DateUtils } from "../../utils/date-utils";
import { OtpExceptionCode } from "../../utils/enums/exception-code.enum";

export namespace AWSDynamoDbService{

    const REGION = process.env.REGION;
    const dbOtherAccount = process.env.DB_OTHER_ACCOUNT;

    export async function accessDatabaseFromAnotherAccount(AWS){
        try{
            const prueba = AWS.STS();
            const paramsSTS = {
                RoleArn: process.env.roleArn,//'access-dynamo-db-otp',
                RoleSessionName: 'DynamoDbAccess'
            }
            const creds = await prueba.assumeRole(paramsSTS).promise();
            const config = {
                region: REGION,
                accessKeyId: creds.Credentials?.AccessKeyId,
                secretAccessKey: creds.Credentials?.SecretAccessKey,
                sessionToken: creds.Credentials?.SessionToken,
            }
            AWS.config.update(config);
        }catch (err) {
            console.log("[AWS DYNAMODB SERVICE] Error connecting to database from another account:", err.message);
        }
    }

    export async function saveOtp(otp: Otp, codError: Number){
        
        var AWS = require('aws-sdk');
        const config = {
            region: REGION
        }

        AWS.config.update(config);
        if (dbOtherAccount){
            const prueba = AWS.STS();
            const paramsSTS = {
                RoleArn: process.env.roleArn,//'access-dynamo-db-otp',
                RoleSessionName: 'DynamoDbAccess'
            }
            const creds = await prueba.assumeRole(paramsSTS).promise();
            const config = {
                region: REGION,
                accessKeyId: creds.Credentials?.AccessKeyId,
                secretAccessKey: creds.Credentials?.SecretAccessKey,
                sessionToken: creds.Credentials?.SessionToken,
            }
            AWS.config.update(config);
        }
        const otpArray = await AWSDynamoDbService.getOtp(otp.nro_servicio, otp.cod_prod, otp.tip_id, otp.num_id, otp.cod_cue);
        if (otpArray.length > 0){
            for(const element of otpArray){
                await AWSDynamoDbService.updateOtp(element.SESSIONID);
            }
        }
        const params = {
            TableName: "OTP_TABLE",
            Item: {
                'SESSIONID': otp.sessionId,
                "NRO_SERVICIO": otp.nro_servicio,
                "COD_PROD": otp.cod_prod,
                "TIP_ID": otp.tip_id,
                "NUM_ID": otp.num_id,
                "COD_CUE": otp.cod_cue,
                "TIEMPO": otp.tiempo,
                "OTP": otp.otp,
                "CORREO": otp.correo,
                "ESTADO": otp.estado
            }
        }

        const date = DateUtils.getLocalDateTimeNow();
        if (codError == null){
            if (otp.celular){
                params.Item["CELULAR"] = otp.celular;
                params.Item["FECHAHORASMS"] = date;
            }
            else if (otp.correo){
                params.Item["CORREO"] = otp.correo;
                params.Item["FECHAHORACORREO"] = date;
            }
        }else{
            params.Item["COD_ERROR"] = codError;
            if (codError == OtpExceptionCode.OTP_EMAIL_NOT_SEND || codError == OtpExceptionCode.OTP_SMS_NOT_SEND){
                params.Item["MSJ_ERROR"] = "Error en el envío de OTP";
            }
            else{
                params.Item["MSJ_ERROR"] = "Error generico";
            }
        }

        try {
            const db = new AWS.DynamoDB.DocumentClient();
            await db.put(params).promise();
            console.log("[AWS DYNAMODB SERVICE] Success saving");
        } catch (err) {
            console.log("[AWS DYNAMODB SERVICE] Error saving:", err.message);
        }
    }

    export async function updateOtp(sessionId: string){
        var AWS = require('aws-sdk');
        const config = {
            region: REGION
        }

        AWS.config.update(config);
        if (dbOtherAccount) await accessDatabaseFromAnotherAccount(AWS);
        const params = {
            TableName: "OTP_TABLE",
            Key: {
                "SESSIONID": sessionId
            },
            UpdateExpression: "set ESTADO = :ESTADO",
            ExpressionAttributeValues: {
                ":ESTADO": 1
            }
        };

        try {
            const db = new AWS.DynamoDB.DocumentClient();
            await db.update(params).promise();
            console.log("[AWS DYNAMODB SERVICE] Success updating");
        } catch (err) {
            console.log("[AWS DYNAMODB SERVICE] Error updating:", err.message);
        }
    }

    export async function getOtp(nro_servicio: number, cod_prod: number, tip_id: string, num_id: number, cod_cue: number){
        var AWS = require('aws-sdk');
        if (dbOtherAccount) await AWSDynamoDbService.accessDatabaseFromAnotherAccount(AWS);
        else{
            
            const config = {
                region: REGION
            }

            AWS.config.update(config);
        }
        const params = {
            TableName: "OTP_TABLE",
            ExpressionAttributeValues: {
                ":NRO_SERVICIO": nro_servicio,
                ":COD_PROD": cod_prod,
                ":TIP_ID": tip_id,
                ":NUM_ID": num_id,
                ":COD_CUE": cod_cue
            },
            FilterExpression: "NRO_SERVICIO = :NRO_SERVICIO AND COD_PROD = :COD_PROD AND TIP_ID = :TIP_ID AND NUM_ID = :NUM_ID AND COD_CUE = :COD_CUE"
        };

        try {
            const db = new AWS.DynamoDB.DocumentClient();
            const data = await db.scan(params).promise();
            console.log("[AWS DYNAMODB SERVICE] Success getting items");
            return data.Items; 
        } catch (err) {
            console.log("[AWS DYNAMODB SERVICE] Error in getting:", err.message);
        }
    }
}