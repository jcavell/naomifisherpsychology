export { renderers } from '../renderers.mjs';

const prerender = false;

async function GET() {
  let number = Math.random();
  return new Response(
    JSON.stringify({
      number,
      message: `Here's a changing random number: ${number}`,
    }),
  );
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
