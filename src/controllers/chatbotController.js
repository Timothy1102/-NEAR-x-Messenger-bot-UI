require("dotenv").config();
import request from "request";
<<<<<<< HEAD
=======
import { sendUSN, updateAccountList, sendReward } from '../near/utils';
>>>>>>> d271b47... msg

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

<<<<<<< HEAD
let getHomePage = (req, res) => {
    return res.send("xin chaoo, this is Tim");
};

let getWebhook = (req, res) => {
    res.send("hey");
=======
const express = require('express');
const app = express();
const path = require('path');

let getHomePage = (req, res) => {
    // return res.send("xin chaoo, this is Tim");
    res.sendFile(path.join(__dirname, '../index.html'));
};

let getWebhook = (req, res) => {
>>>>>>> d271b47... msg
    // Your verify token. Should be a random string.

    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

let postWebhook = (req, res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === "page") {
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log("Sender PSID: " + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send("EVENT_RECEIVED");
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

<<<<<<< HEAD
// Handles messages events
function handleMessage(sender_psid, received_message) {
=======
// var send_usn_token = false;
// Handles messages events
async function handleMessage(sender_psid, received_message) {

>>>>>>> d271b47... msg

    let response;

    // Check if the message contains text
    if (received_message.text) {
<<<<<<< HEAD

        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
=======
        let info = received_message.text.toString().split(" ");

        // send USN
        if (info.length == 2) {
            let acc = info[0];
            let am = info[1];
            let am_int = parseInt(am);
            let message = { "text": `You sent ${am} USN to "${acc}".` };
            callSendAPI(sender_psid, message);

            const tx_id = await sendUSN(acc, am, sender_psid);
            updateAccountList(am_int, sender_psid);
            
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Click to view detail",
                            "subtitle": "https://explorer.testnet.near.org",
                            "default_action": {
                                "type": "web_url",
                                "url": "https://explorer.testnet.near.org/transactions/" + tx_id,
                                "webview_height_ratio": "full"
                              },
                        }]
                    }
                }
            }

        } else {
            if (sender_psid === "5232916690131626") {
                response = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": `What do you want to do?? `,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Login",
                                    "payload": "login"
                                },
                                {
                                    "type": "postback",
                                    "title": "Send USN",
                                    "payload": "sendUSN"
                                },
                                {
                                    "type": "postback",
                                    "title": "Distribute Reward",
                                    "payload": "send_reward"
                                }
                            ]
                        }
                    }
                }
            } else {
                response = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": `What do you want to do? `,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Login",
                                    "payload": "login"
                                },
                                {
                                    "type": "postback",
                                    "title": "Send USN",
                                    "payload": "sendUSN"
                                }
                            ]
                        }
                    }
                }
            }
        }
    } else if (received_message.attachments) {
>>>>>>> d271b47... msg
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }
<<<<<<< HEAD

=======
>>>>>>> d271b47... msg
    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
<<<<<<< HEAD
function handlePostback(sender_psid, received_postback) {
    let response;
    
    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { "text": "Thanks!" }
    } else if (payload === 'no') {
      response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
  }
  
=======
async function handlePostback(sender_psid, received_postback) {
    let response;
    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    } else if (payload === 'login') {
        if (sender_psid === "5232916690131626") {
            response = { "text": "You logged in as timthang1.testnet." };
        }
        if (sender_psid === "5631406660222773") {
            response = { "text": "You logged in as timthang2.testnet." };
        }
        if (sender_psid === "5220728768021003") {
            response = { "text": "You logged in as timthang3.testnet." };
        }
    } else if (payload === 'sendUSN') {
        response = { "text": "Enter the recipient's account and the amount in USN you want to send (separatly by a space). " };
    } else if (payload === 'send_reward') {
        response = { "text": "Sent reward to top 3 accounts with highest tracsaction volume." };
        let message = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Click to view detail",
                        "subtitle": "https://explorer.testnet.near.org/accounts/messenger-near.testnet",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://explorer.testnet.near.org/accounts/messenger-near.testnet",
                            "webview_height_ratio": "full"
                          },
                    }]
                }
            }
        }
        callSendAPI(sender_psid, message);
        sendReward();
    } else if (payload === 'logout') {
        response = { "text": "You logged out as timthang3.testnet." };
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

>>>>>>> d271b47... msg

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
<<<<<<< HEAD
=======
        // "messaging_type": "RESPONSE",
>>>>>>> d271b47... msg
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
<<<<<<< HEAD

=======
>>>>>>> d271b47... msg
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}


module.exports = {
    getHomePage: getHomePage,
    getWebhook: getWebhook,
    postWebhook: postWebhook,
};
