"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuthService = void 0;
const console_1 = require("console");
const google_auth_library_1 = require("google-auth-library");
class GoogleOAuthService {
    constructor() {
        this._oauthClient = new google_auth_library_1.OAuth2Client();
    }
    verifyGoogleIdToken(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, console_1.log)({ idToken });
                const response = yield this._oauthClient.verifyIdToken({
                    idToken,
                    audience: [
                        "1:201897428364:android:8ac9269ab35340a9fb02a9",
                        "1:201897428364:ios:200483f37aecef4ffb02a9"
                    ],
                });
                const payload = response.getPayload();
                if (payload) {
                    const { email, name } = payload;
                    return { email, name };
                }
                else {
                    console.log('token is invalid!');
                    (0, console_1.log)("*****************Google OAuth Bad Token********************");
                    return { email: null, name: null };
                }
            }
            catch (e) {
                (0, console_1.log)("*****************Google OAuth Failed********************");
                console.log('error', e);
                return { email: null, name: null };
            }
        });
    }
}
exports.GoogleOAuthService = GoogleOAuthService;
