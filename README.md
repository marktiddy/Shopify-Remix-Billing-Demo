# Shopify Remix Billing Demo

If you've found this helpful you can say thank you by [buying me a beer](http://buymeacoffee.com/marktiddy)

This is a demo of billing using Shopify Remix and has been created to show an idea of adding billing to your app. It has two plans in it that users can select, creates a theme app extension that only renders if a user has an active subscription and allows users to cancel subscriptions.

This package was created by running npm init @shopify/app@latest

You can start this app by installing NPM packages and running `npm run shopify app dev`

Please see the bottom of this Readme for requirements from Shopify for getting this app up and running.

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

## Quick Start (from shopify remix documentation)

### Prerequisites

Before you begin, you'll need the following:

1. **Node.js**: [Download and install](https://nodejs.org/en/download/) it if you haven't already.
2. **Shopify Partner Account**: [Create an account](https://partners.shopify.com/signup) if you don't have one.
3. **Test Store**: Set up either a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store) for testing your app.

### Setup

If you used the CLI to create the template, you can skip this section.

Using yarn:

```shell
yarn install
```

Using npm:

```shell
npm install
```

Using pnpm:

```shell
pnpm install
```

### Local Development

Using yarn:

```shell
yarn dev
```

Using npm:

```shell
npm run dev
```

Using pnpm:

```shell
pnpm run dev
```

Press P to open the URL to your app. Once you click install, you can start development.

Local development is powered by [the Shopify CLI](https://shopify.dev/docs/apps/tools/cli). It logs into your partners account, connects to an app, provides environment variables, updates remote config, creates a tunnel and provides commands to generate extensions.
