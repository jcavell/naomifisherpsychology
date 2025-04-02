## API endpoints 

### GET /api/kit-user?email={email}
https://localhost:4321/api/get-kit-user?email=jonny.cavell@gmail.com

```json{
"subscriber":{"id":2270329001,"first_name":"Jonny Cavell gmail","email_address":"jonny.cavell@gmail.com","state":"active","created_at":"2023-08-01T18:52:31Z","fields":{"last_name":"Cavell"}}}
```

### GET /api/webinar-tickets/{webinar_id}_{ticket_id}
https://localhost:4321/api/webinar-tickets/1203174349869_2131545083

```json{
"id": "1203174349869_2131545083",
"product_type": "webinar",
"product_id": "1203174349869",
"product_name": "Now What? Diagnosis: with Dr Naomi Fisher and Eliza Fricker",
"product_description": "Your child has been given an autism or ADHD diagnosis, but what happens next?",
"product_images": [
"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F936277653%2F137448283838%2F1%2Foriginal.20250115-124944?auto=format%2Ccompress&q=75&sharp=10&s=643bf26bc67b99c12ed34cd449da1ee0"
],
"variant_id": "2131545083",
"variant_name": "Live Webinar",
"currency": "GBP",
"price": 1150,
"added_at": "2025-02-13T14:42:52.713Z",
"expires_at": "2025-02-27T12:00:00Z",
"quantity": 1,
"vatable": false
}
```

## Purchase flow

1. **User Adds Items to Cart**
   The user browses through the website and adds items to their shopping cart using the `react-use-cart` library. The shopping cart details, including products and their quantities, are tracked in state.
2. **Navigating to the Checkout Page**
   When the user decides to proceed with the purchase, they click the "Checkout" button in the cart, which navigates them to the `/checkout` page component.
3. **Backend Creates a PaymentIntent**
   On the checkout page, the React app makes a `POST` request to the `/api/create-payment-intent` backend API. This API:
    - Sends the list of cart items to the server.
    - Calculates the total order amount (using the `calculateOrderAmount` function).
    - Calls Stripe's API to create a `PaymentIntent`.
    - Returns the `clientSecret` from Stripe, which is needed to process the payment.

4. **Client Receives the `clientSecret`**
   The `clientSecret` returned from the backend is stored in React state (`setClientSecret`) to initialize Stripe's payment processing.
5. **Stripe Elements Loads**
   The Stripe Elements component (`<Elements>`), initialized with the `clientSecret`, displays a secure payment form (`CheckoutForm` component) for the user to input their card information.
6. **Entering Payment Details**
   The user enters their payment details (e.g., card number, expiration date, CVC) into the Stripe Elements form.
7. **Submitting Payment**
   Once the user clicks the "Pay" button, the `CheckoutForm` component:
    - Calls the `stripe.confirmCardPayment` function with the `clientSecret` and the user's card details.
    - Stripe processes the payment securely.
    - If the payment is successful, Stripe returns a `PaymentIntent` object.

8. **Handling Success or Failure on the Frontend**
    - If the payment is successful (`paymentIntent.status === "succeeded"`), the confirmation is logged, and the user is redirected to the `/checkout-complete` page.
    - If the payment fails or additional verification is needed, the user is prompted to retry or complete the required action (e.g., 3D Secure authentication).

9. **Saving PaymentIntent in Backend (Webhook)**
    - Simultaneously, Stripe sends a `payment_intent.succeeded` event to your backend via a webhook.
    - The webhook:
        - Verifies the event using the Stripe webhook signing secret.
        - Extracts the `PaymentIntent` details and stores them in the database for record-keeping (e.g., transaction ID, total amount, customer email).

10. **Redirect to CheckoutComplete Page**
    After successful payment:
    - The frontend redirects the user to the `/checkout-complete` page.
    - This page optionally uses the `payment_intent_client_secret` from the URL query string to retrieve the `PaymentIntent` details.

11. **Load Payment Status on CheckoutComplete Page**
    - The `CheckoutCompleteComponent` calls `stripe.retrievePaymentIntent` to fetch the `PaymentIntent` details.
    - The component displays the payment status, including:
        - A success message (`Payment succeeded`).
        - The `paymentIntentId` for reference.

12. **Display Payment Summary**
    If `status === "succeeded"`, the `CheckoutCompleteComponent` shows:
    - `Payment ID` (e.g., `pi_xxxxx`).
    - Transaction `status` (e.g., `succeeded`).
    - A link to view the payment details in the Stripe Dashboard.

13. **Logging in the Backend**
    Based on the webhook information, the backend logs the transaction details, associates it with the user's account, and marks this order as "completed."
14. **User Views Confirmation Page**
    The user sees their payment confirmation details and order summary on the `CheckoutComplete` page.
15. **Optional Retry or New Purchase**
    If the payment failed or no payment was initiated, the `CheckoutCompleteComponent` offers the user a "Retry" button that redirects them back to the `/checkout` page.

### Key Points:
- **Stripe Elements** provides a secure and PCI-compliant way to collect card details.
- **Webhooks** on the backend ensure no payments go unlogged or tampered with.
- The frontend manages payment state using `clientSecret` and interacts with Stripe for confirmation and status retrieval.
- The `CheckoutComplete` page acts as the final summary for the user's transaction.

## Testing Stripe Integration Locally

### Development Sandbox Setup
1. **Use the Dev Environment**
    - Ensure you're using the "dev" sandbox in Stripe Dashboard
    - Look for "Test Mode" indicator in the dashboard
    - API keys should start with `pk_test_` and `sk_test_`

2. **Environment Variables**
   Add these to your `.env` file:
   ```plaintext
   STRIPE_SECRET_KEY=sk_test_...    # From dev sandbox
   STRIPE_PUBLISHABLE_KEY=pk_test_...  # From dev sandbox
   ```

3. **Test Cards**
   Use these cards for testing:
    - Success: `4242 4242 4242 4242`
    - Requires Authentication: `4000 0027 6000 3184`
    - Decline: `4000 0000 0000 0002`

   Use any future expiry date and any 3-digit CVC.

### Local webhook setup

1. **Login to Stripe CLI**
```bash
stripe login
```

2. **Start webhook forwarding**
```bash
stripe listen --forward-to https://localhost:4321/api/stripe-webhook-handler --skip-verify
```

This command will provide you with a webhook signing secret. Add it to your `.env` file:
```plaintext
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### Testing Webhook Events

To trigger test events:
```bash
stripe trigger payment_intent.succeeded
```

To see all available webhook events:
```bash
stripe trigger --list
```

### Troubleshooting
- Keep the Stripe CLI running while testing
- Monitor webhook delivery in:
    - Stripe CLI output
    - Astro server logs
    - Stripe Dashboard (Events section)
- If webhooks aren't being received despite "Listening" status in Dashboard:
    1. Log out of Stripe CLI: `stripe logout`
    2. Log back in: `stripe login`
    3. Start a new listener to get a fresh webhook signing secret:
       ```bash
       stripe listen --forward-to https://localhost:4321/api/stripe-webhook-handler --skip-verify
       ```
    4. Update your `.env` file with the new webhook signing secret

  Note: Sometimes the webhook connection can become stale on Stripe's end even though
  the Dashboard shows "Listening". A fresh login and new webhook key usually resolves this.