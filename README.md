# Shopify Remix Billing Demo

If you've found this helpful you can say thank you by [buying me a beer](http://buymeacoffee.com/marktiddy)

This is a demo of billing using Shopify Remix and has been created to show an idea of adding billing to your app. It has two plans in it that users can select, creates a theme app extension that only renders if a user has an active subscription and allows users to cancel subscriptions.

This package was created by running npm init @shopify/app@latest

You can start this app by installing NPM packages and running `npm run dev`

Also note: For billing to work your app must be set for public distribution in your partner account otherwise billing will not function even when testing.

## Files Overview

### app/models/Subscription.server.js

This file contains 2 functions.

1. getSubscriptionStatus get active subscriptions
2. createSubscriptionMetafield create an app metafield with a boolean value

### app/routes/app.\_index.jsx

This is the main entry point and shows a screen with current subscription and two subscription options you can subscribe to.

This file has a Remix loader which gets current subscriptions and passes these to the page. This loader also sets the app only metafield based on the subscription status.

This file has a Remix action which is used to process cancelling and subscribing using the Remix billing methods

### shopify.server.js

In this file I have:

1. Created 2 billing options which are exported to be available to other apps (MONTHLY_SUBSCRIPTION and ANNUAL_SUBSCRIPTION)
2. Added the APP_SUBSCRIPTIONS_UPDATE webhook to the webhooks object which will pass this webhook to /webhooks when it is actioned (e.g. a new subscription is started, subscription is cancelled etc)

### webhooks.jsx

In this file we grab the payload from the webhook request and add APP_SUBSCRIPTIONS_UPDATE into the switch statement, perform a check on the subscription status and use our createSubscriptionMetafield method to update the app metafield with the subscription status

### extensions/subscription-only-extension/blocks/star_rating.liquid

This is a very basic shopify app extension which contains the available_if property in the schema which checks the app metafield we created. If the app has an active subscription then the extension is available to the app.

### Support

For support please email hello@marktiddy.co.uk
