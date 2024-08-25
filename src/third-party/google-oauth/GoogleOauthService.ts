import axios from "axios";
import { log } from "console";
import { OAuth2Client } from "google-auth-library"

export class GoogleOAuthService {

    private _oauthClient = new OAuth2Client()

    // not applicable for now: ignore
    async firebaseIdTokenVerification(idToken: string) {
        return idToken
    }

    async verifyGoogleIdToken(idToken: any) {

    try {
        
        let {data} = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        })

        return {
            email: data.email, name: data.name
        }

    } catch (e) {
        log("*****************Google OAuth Failed********************")
        console.log('error', e);
        return {email: null, name: null}
    }
}

}