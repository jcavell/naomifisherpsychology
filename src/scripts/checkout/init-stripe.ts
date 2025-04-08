import Stripe from "stripe";
export const prerender = false;

export const stripe: Stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
