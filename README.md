
## Installation and Development

### Prerequisites
- Node.js (v18 or higher)
- npm (included with Node.js)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jcavell/naomifisherpsychology.git
cd naomifisherpsychology
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add required variables. Look in .env.example which contains:
```plaintext
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_....
STRIPE_SECRET_KEY=sk_test_....
KIT_API_KEY=kit_....
SUPABASE_API_URL=https://....
SUPABASE_API_KEY=KEY
POSTMARK_SERVER_TOKEN=TOKEN
EB_BEARER=BEARER_TOKEN
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
```

### Development

Run the development server:
```bash
npm run dev
```
This will start the development server at `https://localhost:4321`

### Production Build

1. **Create production build**
```bash
npm run build
```
This will:
- Type-check the project
- Build the production assets
- Generate static pages where applicable
- Output to the `dist` directory

2. **Preview production build**
```bash
npm run preview
```
This will serve the production build locally at `https://localhost:4321`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run check` - Run type checking
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier

## Basket (Cart)
Items stored in the cart are of type BasketItem

```typescript
export type BasketItem = {
id: string; //
price: number; // in pence e.g. 1699
currency: string;
formatted_price: string; // e.g. £16.99, required by postmark template
quantity: number;
product_type: product_type;
is_course: boolean; // required by postmark template
is_webinar: boolean; // required by postmark template
product_id: string;
product_name: string;
product_images: string[];
product_description?: string;
variant_id: string;
variant_name: string;
variant_description?: string;
added_at: string; // format "2025-02-13T14:42:52.713Z"
expires_at: string; // format "2024-09-23T12:30:00Z"
vatable: boolean;
};
```

## API endpoints 

### Get Kit subscriber
#### GET /api/kit-user?email={email}
Example: https://localhost:4321/api/get-kit-user?email=jonny.cavell@gmail.com

```json{
"subscriber":{"id":2270329001,"first_name":"Jonny Cavell gmail","email_address":"jonny.cavell@gmail.com","state":"active","created_at":"2023-08-01T18:52:31Z","fields":{"last_name":"Cavell"}}}
```

### Get webinar ticket
#### GET /api/webinar-tickets/{webinar_id}_{ticket_id}
Example: https://localhost:4321/api/webinar-tickets/1203174349869_2131545083

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
   When the user decides to proceed with the purchase, they click the "Checkout" button in the cart, which navigates them to the `/checkout` page.
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

9. **Stripe Webhook**
    - Stripe asynchronously sends a `payment_intent.succeeded` event to stripe-webhook-handler.ts. This is typoically called after the user is redirected to the /checkout-complete page (see below).
    - The handler:
        - Verifies the event using the Stripe webhook signing secret.
        - Extracts the `PaymentIntent` details 
        - Retrieves purchase details from database (supabase)
        - Checks if payment was already confirmed to prevent double-processing
        - Retrieves full payment intent from Stripe
        - Updates purchase record with payment confirmation
    - Post-purchase actions
      - Inserts webinar tickets into supabase if applicable
      - Retrieves user details from supabase
      - Sends purchase confirmation email using Postmark
      - Subscribes user to Kit (if applicable) via its API
      - Posts user and course data to Zapier (if applicable) via a Zapier webhook with a secret URL. This Zap connects with Kajabi to grant the relevant offers.

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

    
13. **User Views Confirmation Page**
    The user sees their payment confirmation details and order summary on the `CheckoutComplete` page.


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
   Ensure you're using the Stripe test keys. In your `.env` file:
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