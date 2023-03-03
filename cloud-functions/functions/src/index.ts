import { logger, pubsub, https } from 'firebase-functions';
import * as admin from 'firebase-admin';
import moment from 'moment';
import { allowCors, sendTwilioMessage } from './helper';

admin.initializeApp();

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
    try {
      // Fetch the accounts that have a scheduled message that needs to be sent
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
      let count = 0;
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

        // Make the requests to send the messages for each subscriber
        const promiseRequests: Promise<any>[] = [];
        subscribers.forEach((subscriber) => {
          const req = async () => {
            const subscriberData = subscriber.data();
            const phoneNumber = subscriberData.phone_number;
            const success = await sendTwilioMessage(
              phoneNumber,
              message,
              accountData.twilio_phone_number,
            );
            if (success) {
              count++;
            }
          };
          promiseRequests.push(req());
        });
        const historyRef = account.ref.collection('history').doc();
        await Promise.allSettled(promiseRequests);

        // Clear the scheduled message and update the msg_count
        const currentValue = accountData.msg_count?.current || 0;
        await account.ref.update({
          scheduled: null,
          'msg_count.current': currentValue + count,
        });
        // Add a history entry
        await historyRef.set({
          id: '/' + historyRef.path,
          uid: historyRef.id,
          message,
          method,
          scheduled_at,
          sent_at: new Date().valueOf(),
          successful_delivery: count,
          recipients: subscriberIds,
        });
      });
    } catch (error) {
      logger.error(error);
    }
  });

export const resetUsageTracker = pubsub
  .schedule('0 0 1 * *')
  .timeZone('America/Chicago')
  .onRun(async (context) => {
    logger.info('This will be run at 12:00AM on the 1st of every month!');
    /*
      Update all the accounts to set the msg_count.current to 0
    */
    const accounts = await admin.firestore().collection('Accounts').get();
    logger.info(`Found ${accounts.size} accounts.`);
    accounts.forEach(async (account) => {
      await account.ref.update({
        'msg_count.current': 0,
      });
    });
  });
