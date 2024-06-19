import { log } from "console";
import { OAuth2Client } from "google-auth-library"

export class GoogleOAuthService {

    private _oauthClient = new OAuth2Client()

    async verifyGoogleIdToken(idToken: string) {

    try {
        log({idToken})
        const response = await this._oauthClient.verifyIdToken({
            idToken,
            audience: [
                "1:201897428364:android:8ac9269ab35340a9fb02a9",
                "1:201897428364:ios:200483f37aecef4ffb02a9"
            ],
        });
        const payload = response.getPayload();

        if (payload) {

            const { email, name } = payload;

            return { email, name }

        } else {
            console.log('token is invalid!');
            log("*****************Google OAuth Bad Token********************")
            return {email: null, name: null}
        }
    } catch (e) {
        log("*****************Google OAuth Failed********************")
        console.log('error', e);
        return {email: null, name: null}
    }
}

}