import { Message } from "firebase-admin/lib/messaging/messaging-api";
import { IPushNotification } from "./fcm-interface";
import keys from "./fcm-pk";

import * as firebase_admin from "firebase-admin"
import { log } from "console";

// var admin = require("firebase-admin");

const firebase = firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(keys as object)
});

export const FCM_Manager = {

    sendPushNotification: async(data:IPushNotification) => {
        try {

            if (data.user.firebase_token == null) return null;
            const message:Message = {
                token: data.user.firebase_token,
                notification: {
                    title: data.title,
                    body: data.content,
                    imageUrl: data.image,
                }
            }
            return await firebase.messaging().send(message)
            
        } catch (error) {
            log(error)
            return null
        }
    }

}