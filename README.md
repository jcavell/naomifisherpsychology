
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
git checkout basket
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add the required variables. You can copy from .env.example:
```bash
cp .env.example .env
```

If you are not using the checkout, the only env variable you need is `DEV_USES_CACHED_WEBINARS=true` which will have been copied by the command above.

### Local HTTPS Setup
This project uses HTTPS in development. Run:
   ```bash
   mkcert localhost
   # or
   mkcert -install
   mkcert localhost
   ```

### Running the app locally 

Run the development server:
```bash
npm run dev
```
This will start the development server at `https://localhost:4321`

Any changes you make in the code will be reflected immediately. Page are not pre-built - which is different to how it operates when deployed.

If you have set `DEV_USES_CACHED_WEBINARS=true` then this will use the webinar data in `src/test-data/eventbrite` 

### Deployment Build

1. **Create or test deployment build**
```bash
npm run build
```
This will:
- Type-check the project
- Build the deployment assets
- Generate static pages where applicable
- Output to the `dist` directory

2. **Preview deployment build**
```bash
npm run preview
```
This will serve the deployment build locally at `https://localhost:4321`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run check` - Run type checking
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier

## Pages

These are the public pages or API endpoints.

Any that are dynamic, e.g. APIs, must have prerender set to false at the top of the file:

`export const prerender = false;`

Otherwise, they are pre-built by Astro during the build phase and are not dynamic when deployed.


## Components

Both astro and React components are here.

## Content
This directory contains Markdown and JSON data.

Data for courses and the blog is obtained via web scraping in a different app.

```aiignore
 ├── content
    │   ├── blog
    │   ├── book-excerpts
    │   ├── book-quotes
    │   ├── book-reviews
    │   ├── books
    │   ├── books-more-info
    │   ├── config.ts
    │   ├── course-quotes
    │   ├── courseCards
    │   ├── courseCheckouts
    │   ├── static-pages-quotes
    │   ├── tag-quotes
    │   ├── tags
    │   ├── webinar-quotes
```

## Styles

Currently moving to modular CSS (work in progress)

```aiignore
  ├── styles
    │   ├── base
    │   │   ├── reset.css
    │   ├── components
    │   │   ├── cart
    │   │   │   ├── cart.module.css
    │   │   │   ├── overlay.module.css
    │   │   ├── checkout
    │   │   │   └── form.module.css
    │   │   │   └── payment.module.css
    │   │   │   └── summary.module.css
    │   ├── layouts
    │   │   ├── header.css
    │   ├── main.css
    │   ├── naomiStyle.astro
```
## Basket (Cart)

React components are used for the shopping basket and checkout.

The styles are modular. They are defined within src/styles/components/cart and src/styles/components/checkout.

Items stored in the cart are of type `BasketItem` for both webinars and courses.

## API endpoints 

APIs are under /pages/api

The React components call local APIs to get information about courses, webinars, webinar tickets and whether a user has already subscribed to Kit.

Upon checkout, React calls a local API to insert an unconfirmed purchase into Supabase. 

Finally, there is a stripe webhook which is a public endpoint called by Stripe upon successful purchase. This completes the purchase, updating it to confirmed in supabase, as well as sending out confirmation emails, inserting the webinar tickets into supabase, calling Kit to subscribe the user, calling Kajabi via Zapier to grant offers etc.

### KIT USER API
#### GET /api/kit-user?email={email}
Example: https://localhost:4321/api/get-kit-user?email=jonny.cavell@gmail.com

```json{
"subscriber":{"id":2270329001,"first_name":"Jonny Cavell gmail","email_address":"jonny.cavell@gmail.com","state":"active","created_at":"2023-08-01T18:52:31Z","fields":{"last_name":"Cavell"}}}
```

### EventbriteWebinar Tickets API

The `/api/webinar-tickets/[eventId_ticketId]` endpoint provides ticket details for webinar events that can be added to the shopping cart.

Example: https://localhost:4321/api/webinar-tickets/1203174349869_2131545083

#### Features
1. **EventbriteWebinar Lookup**
    - Fetches webinar details using the event ID
    - Finds specific ticket class within the webinar
    - Returns 404 if ticket not found

2. **Basket Item Creation**
   Creates a standardized `BasketItem` object containing:
    - EventbriteWebinar details (name, description, logo)
    - EventbriteTicket class information
    - Pricing details in GBP
    - Event timing and expiration details

### Courses API

The `/api/courses/offerId/[offerId]` endpoint provides course details for the shopping cart based on Kajabi offer IDs.

 It takes a Kajabi public offer ID and returns a `BasketItem` object that can be added to the shopping cart.

**Price Formatting**
    - Converts display prices (e.g., "£99.99") to cents/pence for Stripe
    - Maintains original formatted discountedPriceInPence for display purposes

### Free Checkout API

Processes free items in the shopping cart without Stripe payment processing.

 `/api/free-checkout`



#### Notes
- Only processes items with discountedPriceInPence = 0
- Creates/updates user record
- Creates webinar tickets if applicable
- Sends confirmation email
- Handles Kit subscription if needed

### Create Purchase API

Records initial purchase details in Supabase before payment processing.

 `/api/create-purchase`


#### Notes
- Creates/updates user record
- Records unconfirmed purchase in database
- Payment confirmation and post-purchase steps handled separately via webhook - see below

## Purchase flow

### Overview
- **Stripe Elements** provides a secure and PCI-compliant way to collect card details.
- **Webhooks** on the backend ensure no payments go unlogged or tampered with.
- The frontend manages payment state using `clientSecret` and interacts with Stripe for confirmation and status retrieval.
- The `CheckoutComplete` page acts as the final summary for the user's transaction.

### Full details
1. **User Adds Items to Cart**
   - The user browses through the website and adds items to their shopping cart. The shopping cart details, including products and their quantities, are stored in local storage.
2. **Navigating to the Checkout Page**
   - When the user decides to proceed with the purchase, they click the "Checkout" button in the cart, which navigates them to the `/checkout` page.
3. **Backend Creates a PaymentIntent**
   - On the checkout page, the React app makes a `POST` request to the `/api/create-payment-intent` backend API. This API:
     - Sends the list of cart items to the server.
     - Calculates the total order amount (using the `calculateOrderAmount` function).
     - Calls Stripe's API to create a `PaymentIntent`.
     - Returns the `clientSecret` from Stripe, which is needed to process the payment.

4. **Client Receives the `clientSecret`**
   - The `clientSecret` returned from the backend is stored in React state (`setClientSecret`) to initialize Stripe's payment processing.
5. **Stripe Elements Loads**
   - The Stripe Elements component (`<Elements>`), initialized with the `clientSecret`, displays a secure payment form (`CheckoutForm` component) for the user to input their card information.
6. **Entering Payment Details**
   - The user enters their payment details (e.g., card number, expiration date, CVC) into the Stripe Elements form.
7. **Submitting Payment**
   - Once the user clicks the "Pay" button, the `CheckoutForm` component:
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
    - The checkout complete page (`/checkout-complete`) handles both successful payments and free transactions, displaying purchase confirmation and order details.
    - It Shows a detailed breakdown of the purchased items including:
      - Product name and variant
      - Product image (if available)
      - Individual item discountedPriceInPence
      - Quantity
      - Total discountedPriceInPence per item
      - Order total


## Testing Stripe Integration Locally

### Development Sandbox Setup
1. **Use the Dev Environment**
    - Log into Stripe and choose the top naomifisher.co.uk account (Kajabi)
    - Click on the dropdown and choose Switch to Sandbox -> "Dev" 
    - Look for "Test Mode" indicator in the dashboard
    - Navigate to https://dashboard.stripe.com/test/apikeys to see the API keys
    - API keys should start with `pk_test_` and `sk_test_`

2. **Environment Variables**
   Ensure you're using the Stripe test keys. In your `.env` file:
   ```plaintext
   STRIPE_SECRET_KEY=sk_test_...    # From dev sandbox
   STRIPE_PUBLISHABLE_KEY=pk_test_... (or rk_test for a restricted key)  # From dev sandbox
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

**NOTE** If you get `Error while authenticating with Stripe: Authorization failed, status=401`, run `stripe login`

The output will provide you with a webhook signing secret. Add it to your `.env` file:
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