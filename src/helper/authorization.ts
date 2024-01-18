import { verify, sign } from 'jsonwebtoken';
import { randomBytes } from 'crypto';

export class JWTToken {
    private algorithm: string;
    private secret: string;
    private expiresIn: string;

    constructor(algorithm: string, secret: string, expiresIn: string) {
        this.algorithm = algorithm;
        this.secret = secret;
        this.expiresIn = expiresIn;
    }

    async generateToken(payload: object): Promise<string> {
        return new Promise((resolve, reject) => {
            sign(payload, this.secret, { expiresIn: this.expiresIn }, (err, token:any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    async validateToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            verify(token, this.secret, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    async disableToken(): Promise<void> {
        this.secret = randomBytes(256).toString('hex');
    }
}