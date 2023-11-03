import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const firebase_params = {
    type: process.env.type,
    projectId: process.env.project_id,
    privateKeyId: process.env.private_key_id.replace(/\\n/gm, "\n"),
    privateKey: process.env.private_key,
    clientEmail: process.env.client_email,
    clientId: process.env.client_id,
    authUri: process.env.auth_uri,
    tokenUri: process.env.token_uri,
    authProviderX509CertUrl: process.env.auth_provider_x509_cert_url,
    clientC509CertUrl: process.env.client_x509_cert_url
}

@Injectable()
export class PreauthMiddleware implements NestMiddleware {

    private defaultApp: any;

    constructor() {
        this.defaultApp = firebase.initializeApp({
            credential: firebase.credential.cert(firebase_params)
        });
    }

    use(req: Request, res: Response, next: Function) {
        const token = req.headers.authorization;
        if (token != null && token != '') {
            this.defaultApp.auth().verifyIdToken(token.replace('Bearer ', ''))
                .then(async decodedToken => {
                    const user = {
                        email: decodedToken.email
                    }
                    req['user'] = user;
                    next();
                }).catch(error => {
                    console.error(error);
                    this.accessDenied(req.url, res);
                });
        } else {
            //return this.accessDenied(req.url, res);
            throw new HttpException('please log-in', HttpStatus.UNAUTHORIZED)
        }
    }

    private accessDenied(url: string, res: Response) {

        res.status(403).json({
            statusCode: 403,
            timestamp: new Date().toISOString(),
            path: url,
            message: 'Please log in'
        });
    }
}