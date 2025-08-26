import paypalSdk from "@paypal/checkout-server-sdk";

const clientId = import.meta.env.PAYPAL_CLIENT_ID;
const clientSecret = import.meta.env.PAYPAL_CLIENT_SECRET;
const environment = import.meta.env.DEV
  ? new paypalSdk.core.SandboxEnvironment(clientId, clientSecret)
  : new paypalSdk.core.LiveEnvironment(clientId, clientSecret);

export const paypal = new paypalSdk.core.PayPalHttpClient(environment);