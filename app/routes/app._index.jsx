import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { Page, Layout, Text, Card, Button, BlockStack } from "@shopify/polaris";
import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";
import {
  getSubscriptionStatus,
  createSubscriptionMetafield,
} from "../models/Subscription.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  if (!admin) {
    return;
  }

  /*
  Note:  If you wanted to apply the subscription check to all routes 
  and not just index you could use this logic in app.jsx in the loader instead.
  I'm just returning the data but you could redirect a use to take out a plan
  if not subscribed using the billing.require method in the action function
  */
  const subscriptions = await getSubscriptionStatus(admin.graphql);
  const { activeSubscriptions } = subscriptions.data.app.installation;

  if (activeSubscriptions) {
    if (activeSubscriptions[0].status === "ACTIVE") {
      await createSubscriptionMetafield(admin.graphql, "true");
    } else {
      await createSubscriptionMetafield(admin.graphql, "false");
    }
  }

  return json({ activeSubscriptions });
};

export const action = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const { shop } = session;
  const data = {
    ...Object.fromEntries(await request.formData()),
  };
  const action = data.action;
  const isTest = true;

  if (!action) {
    return null;
  }

  const PLAN = action === "monthly" ? MONTHLY_PLAN : ANNUAL_PLAN;

  if (data.cancel) {
    const billingCheck = await billing.require({
      plans: [PLAN],
      onFailure: async () => billing.request({ plan: PLAN }),
    });
    const subscription = billingCheck.appSubscriptions[0];
    await billing.cancel({
      subscriptionId: subscription.id,
      isTest: isTest,
      prorate: true,
    });
  } else {
    await billing.require({
      plans: [PLAN],
      isTest: isTest,
      onFailure: async () => billing.request({ plan: PLAN, isTest: isTest }),
      returnUrl: `https://${shop}/admin/apps/remix-billing-demo/app`,
    });
  }

  return null;
};

export default function Index() {
  const { activeSubscriptions } = useLoaderData();
  const submit = useSubmit();
  const hasSubscription = activeSubscriptions.length == 0 ? false : true;

  const handlePurchaseAction = (subscription) => {
    // This sends a subscription request to our action function
    submit({ action: subscription }, { method: "post" });
  };

  const handleCancelAction = (subscription) => {
    submit({ action: subscription, cancel: true }, { method: "post" });
  };

  return (
    <Page>
      <ui-title-bar title="Shopify Remix Billing Demo"></ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Below we have two sample plans
                  </Text>

                  <Text>
                    {activeSubscriptions.length > 0
                      ? `Your current plan is: ${activeSubscriptions[0].name}`
                      : "You have no subscription"}
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
      <div style={{ marginTop: "15px" }} />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section variant="oneThird">
            <Card>
              <Text as="h2" variant="headingMd">
                Monthly Plan
              </Text>
              <Text>Cost: $5</Text>
              <Text>Billed Monthly</Text>
              <div style={{ height: "15px" }} />
              {!hasSubscription && (
                <Button
                  onClick={() => handlePurchaseAction("monthly")}
                  variant="primary"
                >
                  Purchase Plan
                </Button>
              )}
              {hasSubscription &&
                activeSubscriptions[0].name == "Monthly Subscription" && (
                  <Button
                    onClick={() => handleCancelAction("monthly")}
                    variant="primary"
                    tone="critical"
                  >
                    Cancel Plan
                  </Button>
                )}
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <Text as="h2" variant="headingMd">
                Yearly Plan
              </Text>
              <Text>Cost: $50</Text>
              <Text>Billed Annually</Text>
              <div style={{ height: "15px" }} />
              {!hasSubscription && (
                <Button
                  onClick={() => handlePurchaseAction("annual")}
                  variant="primary"
                >
                  Purchase Plan
                </Button>
              )}
              {hasSubscription &&
                activeSubscriptions[0].name == "Annual Subscription" && (
                  <Button
                    onClick={() => handleCancelAction("annual")}
                    variant="primary"
                    tone="critical"
                  >
                    Cancel Plan
                  </Button>
                )}
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
