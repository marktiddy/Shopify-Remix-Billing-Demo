export async function getSubscriptionStatus(graphql) {
  const result = await graphql(
    `
      #graphql
      query Shop {
        app {
          installation {
            launchUrl
            activeSubscriptions {
              id
              name
              createdAt
              returnUrl
              status
              currentPeriodEnd
              trialDays
            }
          }
        }
      }
    `,
    { variables: {} },
  );

  const res = await result.json();
  return res;
}

export async function createSubscriptionMetafield(graphql, value) {
  const appIdQuery = await graphql(`
    #graphql
    query {
      currentAppInstallation {
        id
      }
    }
  `);

  const appIdQueryData = await appIdQuery.json();
  const appInstallationID = appIdQueryData.data.currentAppInstallation.id;

  const appMetafield = await graphql(
    `
      #graphql
      mutation CreateAppDataMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        metafields: {
          namespace: "mtappsremixbillingdemo",
          key: "hasPlan",
          type: "boolean",
          value: value,
          ownerId: appInstallationID,
        },
      },
    },
  );

  const data = await appMetafield.json();
  return;
}
