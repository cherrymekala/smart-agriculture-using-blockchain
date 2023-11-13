// Import the necessary modules
const admin = require('firebase-admin');
const serviceAccount = require('/home/cherry/serviceAccountKey.json'); // Replace with the actual path to your service account key JSON file

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send a push notification to the service worker using FCM
async function sendPushNotificationToServiceWorker(subscription, payload) {
  try {
    // Create a message payload
    const message = {
      notification: {
        title: payload.title,
        body: payload.message,
      },
      data: payload.data || {}, // Additional data to be sent with the notification
    };

    // Send the message to the specified subscription
    await admin.messaging().sendToDevice(subscription, message);
    console.log('Push notification sent successfully.');
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

// Example usage:
const subscription = '<Your Subscription Endpoint>'; // Replace with the subscription endpoint received from the frontend
const payload = {
  title: 'New Notification',
  message: 'You have a new notification!',
  data: { url: 'https://example.com/notification' }, // Include any additional data you want to send
};

sendPushNotificationToServiceWorker(subscription, payload);
