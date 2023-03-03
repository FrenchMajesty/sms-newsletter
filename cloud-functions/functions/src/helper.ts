import { https, config, logger } from 'firebase-functions';
import Twilio from 'twilio';

const accountSid = config().twilio.account_sid;
const authToken = config().twilio.auth_token;
const twilioClient = Twilio(accountSid, authToken);

/**
 * Make a request to the Twilio API to send a message
 * @param phoneNumber The phone number to send the message to
 * @param message The message to send
 * @param twilioPhoneNumber The originating phone number
 * @returns
 */
export const sendTwilioMessage = async (
  phoneNumber: string,
  message: string,
  twilioPhoneNumber: string,
) => {
  try {
    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });
    logger.info(twilioMessage);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
/**
 * Set the header config necessary to allow CORS request
 * @param req The request object
 * @param res The response object
 * @returns Whether the request is pre-flight
 */
export const allowCors = (req: https.Request, res: any) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  if (req.method === 'OPTIONS') {
    /* handle preflight OPTIONS request */

    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // cache preflight response for 3600 sec
    res.set('Access-Control-Max-Age', '3600');

    res.sendStatus(204);
    return true;
  }

  return false;
};
