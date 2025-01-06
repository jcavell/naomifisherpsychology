import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_BxnxwZNZ.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/create-checkout-session.astro.mjs');
const _page3 = () => import('./pages/api/session-status.astro.mjs');
const _page4 = () => import('./pages/blog/_title_.astro.mjs');
const _page5 = () => import('./pages/blog.astro.mjs');
const _page6 = () => import('./pages/books.astro.mjs');
const _page7 = () => import('./pages/books/_---slug_.astro.mjs');
const _page8 = () => import('./pages/checkout.astro.mjs');
const _page9 = () => import('./pages/consultation.astro.mjs');
const _page10 = () => import('./pages/contact.astro.mjs');
const _page11 = () => import('./pages/cookie-policy.astro.mjs');
const _page12 = () => import('./pages/courses/categories/_---category_.astro.mjs');
const _page13 = () => import('./pages/courses.astro.mjs');
const _page14 = () => import('./pages/courses/_---title_.astro.mjs');
const _page15 = () => import('./pages/educationalpsychology.astro.mjs');
const _page16 = () => import('./pages/is-it-all-my-fault.astro.mjs');
const _page17 = () => import('./pages/media.astro.mjs');
const _page18 = () => import('./pages/privacy-policy.astro.mjs');
const _page19 = () => import('./pages/random.astro.mjs');
const _page20 = () => import('./pages/return.astro.mjs');
const _page21 = () => import('./pages/subscribed.astro.mjs');
const _page22 = () => import('./pages/tags/_tag_.astro.mjs');
const _page23 = () => import('./pages/terms-and-conditions.astro.mjs');
const _page24 = () => import('./pages/training.astro.mjs');
const _page25 = () => import('./pages/webinars/_eventid_.astro.mjs');
const _page26 = () => import('./pages/webinars.astro.mjs');
const _page27 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/create-checkout-session.ts", _page2],
    ["src/pages/api/session-status.ts", _page3],
    ["src/pages/blog/[title].astro", _page4],
    ["src/pages/blog.astro", _page5],
    ["src/pages/books.astro", _page6],
    ["src/pages/books/[...slug].astro", _page7],
    ["src/pages/checkout.astro", _page8],
    ["src/pages/consultation.astro", _page9],
    ["src/pages/contact.astro", _page10],
    ["src/pages/cookie-policy.astro", _page11],
    ["src/pages/courses/categories/[...category].astro", _page12],
    ["src/pages/courses.astro", _page13],
    ["src/pages/courses/[...title].astro", _page14],
    ["src/pages/educationalpsychology.astro", _page15],
    ["src/pages/is-it-all-my-fault.astro", _page16],
    ["src/pages/media.astro", _page17],
    ["src/pages/privacy-policy.astro", _page18],
    ["src/pages/random.js", _page19],
    ["src/pages/return.astro", _page20],
    ["src/pages/subscribed.astro", _page21],
    ["src/pages/tags/[tag].astro", _page22],
    ["src/pages/terms-and-conditions.astro", _page23],
    ["src/pages/training.astro", _page24],
    ["src/pages/webinars/[eventId].astro", _page25],
    ["src/pages/webinars.astro", _page26],
    ["src/pages/index.astro", _page27]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "be5911ff-d051-4292-ab73-7670b0816949"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
