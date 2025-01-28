import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_Cb7nSxkg.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/create-payment-intent.astro.mjs');
const _page3 = () => import('./pages/api/get-coupon.astro.mjs');
const _page4 = () => import('./pages/api/init-stripe.astro.mjs');
const _page5 = () => import('./pages/api/old-create-checkout-session.astro.mjs');
const _page6 = () => import('./pages/api/session-status.astro.mjs');
const _page7 = () => import('./pages/api/webinar-tickets/_eventid_ticketid_.astro.mjs');
const _page8 = () => import('./pages/api/webinars/_eventid_.astro.mjs');
const _page9 = () => import('./pages/basket.astro.mjs');
const _page10 = () => import('./pages/blog/_title_.astro.mjs');
const _page11 = () => import('./pages/blog.astro.mjs');
const _page12 = () => import('./pages/books.astro.mjs');
const _page13 = () => import('./pages/books/_---slug_.astro.mjs');
const _page14 = () => import('./pages/checkout.astro.mjs');
const _page15 = () => import('./pages/checkout-complete.astro.mjs');
const _page16 = () => import('./pages/consultation.astro.mjs');
const _page17 = () => import('./pages/contact.astro.mjs');
const _page18 = () => import('./pages/cookie-policy.astro.mjs');
const _page19 = () => import('./pages/courses/categories/_---category_.astro.mjs');
const _page20 = () => import('./pages/courses.astro.mjs');
const _page21 = () => import('./pages/courses/_---title_.astro.mjs');
const _page22 = () => import('./pages/educationalpsychology.astro.mjs');
const _page23 = () => import('./pages/is-it-all-my-fault.astro.mjs');
const _page24 = () => import('./pages/media.astro.mjs');
const _page25 = () => import('./pages/privacy-policy.astro.mjs');
const _page26 = () => import('./pages/random.astro.mjs');
const _page27 = () => import('./pages/subscribed.astro.mjs');
const _page28 = () => import('./pages/tags/_tag_.astro.mjs');
const _page29 = () => import('./pages/terms-and-conditions.astro.mjs');
const _page30 = () => import('./pages/training.astro.mjs');
const _page31 = () => import('./pages/webinars/_eventid_.astro.mjs');
const _page32 = () => import('./pages/webinars.astro.mjs');
const _page33 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/create-payment-intent.ts", _page2],
    ["src/pages/api/get-coupon.ts", _page3],
    ["src/pages/api/init-stripe.ts", _page4],
    ["src/pages/api/old-create-checkout-session.ts", _page5],
    ["src/pages/api/session-status.ts", _page6],
    ["src/pages/api/webinar-tickets/[eventId_ticketId].ts", _page7],
    ["src/pages/api/webinars/[eventId].ts", _page8],
    ["src/pages/basket.astro", _page9],
    ["src/pages/blog/[title].astro", _page10],
    ["src/pages/blog.astro", _page11],
    ["src/pages/books.astro", _page12],
    ["src/pages/books/[...slug].astro", _page13],
    ["src/pages/checkout.astro", _page14],
    ["src/pages/checkout-complete.astro", _page15],
    ["src/pages/consultation.astro", _page16],
    ["src/pages/contact.astro", _page17],
    ["src/pages/cookie-policy.astro", _page18],
    ["src/pages/courses/categories/[...category].astro", _page19],
    ["src/pages/courses.astro", _page20],
    ["src/pages/courses/[...title].astro", _page21],
    ["src/pages/educationalpsychology.astro", _page22],
    ["src/pages/is-it-all-my-fault.astro", _page23],
    ["src/pages/media.astro", _page24],
    ["src/pages/privacy-policy.astro", _page25],
    ["src/pages/random.js", _page26],
    ["src/pages/subscribed.astro", _page27],
    ["src/pages/tags/[tag].astro", _page28],
    ["src/pages/terms-and-conditions.astro", _page29],
    ["src/pages/training.astro", _page30],
    ["src/pages/webinars/[eventId].astro", _page31],
    ["src/pages/webinars.astro", _page32],
    ["src/pages/index.astro", _page33]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "8fc7f27f-eaec-41b2-ba6d-abd8022720c2"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
