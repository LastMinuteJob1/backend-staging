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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuthService = void 0;
const axios_1 = __importDefault(require("axios"));
const console_1 = require("console");
const google_auth_library_1 = require("google-auth-library");
class GoogleOAuthService {
    constructor() {
        this._oauthClient = new google_auth_library_1.OAuth2Client();
    }
    // not applicable for now: ignore
    firebaseIdTokenVerification(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return idToken;
        });
    }
    verifyGoogleIdToken(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { data } = yield axios_1.default.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${idToken}`
                    }
                });
                return {
                    email: data.email, name: data.name
                };
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
