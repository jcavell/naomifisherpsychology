import Stripe from 'stripe';

const prerender = false;
const stripe = new Stripe("sk_test_51QYVqyReZarnNjSdyod4dc2MX3YyUMEdJli7HrjPC42x3tGU1XG3uJYKgYD3bUtnR3pBZoPtDXcpddDmCWstq7fB00UxqAL7hS");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	prerender,
	stripe
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _, stripe as s };
