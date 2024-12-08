import { log } from "console";
import Admin from "../modules/admin/onboarding/admin-model";

let speakeasy = require("speakeasy");
let qr_code = require("qrcode");

async function generate2FAQRCode(otp_url: string) {
    return await qr_code.toDataURL(otp_url);
}

export async function generate2FASecret(admin: Admin): Promise<{ secret: string, url: string }> {
    const secret = speakeasy.generateSecret();
    // secret.otpauth_url.label = `Skyhealth(${doc.username})`
    let url = secret.otpauth_url;
    url = url.replace("SecretKey", `LMJ Admin(${(admin.email).split("@")[0]})`);
    let qr_code_url = await generate2FAQRCode(url);

    await admin.update({two_factor_temp_secret: secret.base32})

    return {
        secret: secret.base32,
        url: qr_code_url,
    };
}

export async function verify2FAToken(otp: number, admin: Admin) {
    try {

        // Ensure secret exists before verification 
        let secret = admin.two_factor_temp_secret;
        if (!secret) {
            throw new Error('2FA secret not found for this admin');
        }

        log({ otp, secret })

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: otp,
            window: 1, // Number of past and future codes to check (usually 1)
        });

        log({ verified })

        return verified;

    } catch (error) {
        log({ error });
        return false
    }
}