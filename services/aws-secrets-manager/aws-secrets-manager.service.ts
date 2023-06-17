var AWS = require('aws-sdk');

export namespace AWSSecretsManagerService{
    const REGION = process.env.REGION;
    const config = {
        region: REGION
    }

    AWS.config.update(config);

    export async function getSecret(secretName: string){
        const secretsManager = new AWS.SecretsManager(config);
        const secretValue = await secretsManager.getSecretValue({SecretId: secretName}).promise();
        return JSON.parse(secretValue.SecretString);
    }
}
