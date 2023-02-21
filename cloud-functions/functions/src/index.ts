import { logger, pubsub, https, config } from 'firebase-functions';
import * as admin from 'firebase-admin';
import Twilio from 'twilio';
import moment from 'moment';
import { allowCors } from './helper';

admin.initializeApp();
const accountSid = config().twilio.account_sid;
const authToken = config().twilio.auth_token;
const twilioClient = Twilio(accountSid, authToken);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = https.onRequest((request, response) => {
  const isPreflight = allowCors(request, response);
  if (isPreflight) return;

  logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const sendScheduledMessages = pubsub
  .schedule('every 5 minutes')
  .timeZone('America/Chicago')
  .onRun(async (context) => {
    logger.info('This will be run every 5 minutes!');
    /*
      Fetch all accounts where scheduled.scheduled_at was 5 minutes ago or less
      Then fetch all the subscribers from the subcollection
      Then send a message to each subscriber using Twilio
      After that's done, update the account's scheduled to null
      Then add a history entry to the account's history subcollection
    */
    try {
      const now = moment();
      const accounts = await admin
        .firestore()
        .collection('Accounts')
        .where('scheduled.scheduled_at', '<=', now.valueOf())
        .where(
          'scheduled.scheduled_at',
          '>=',
          now.subtract(5, 'minutes').valueOf(),
        )
        .get();
      logger.info(`Found ${accounts.size} accounts with scheduled messages.`);
      accounts.forEach(async (account) => {
        const accountData = account.data();
        if (!accountData.scheduled) {
          return;
        }
        const { message, method, scheduled_at } = accountData.scheduled;
        const subscribers = await account.ref.collection('subscribers').get();
        const subscriberIds = subscribers.docs.map((doc) => '/' + doc.ref.path);
        logger.info(
          `Sending message to ${subscriberIds.length} subscribers for ${accountData.id}.`,
        );
        subscribers.forEach(async (subscriber) => {
          //const subscriberData = subscriber.data();
          //const phoneNumber = subscriberData.phoneNumber;
          const twilioMessage = await twilioClient.messages.create({
            body: message,
            from: accountData.twilio_phone_number,
            to: '+16822564413', //phoneNumber,
          });
          logger.info(twilioMessage);
        });
        await account.ref.update({ scheduled: null });
        const historyRef = account.ref.collection('history').doc();
        await historyRef.set({
          id: '/' + historyRef.path,
          uid: historyRef.id,
          message,
          method,
          scheduled_at,
          sent_at: new Date().valueOf(),
          recipients: subscriberIds,
        });
      });
    } catch (error) {
      logger.error(error);
    }
  });
