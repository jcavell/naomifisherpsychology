(() => {
  "use strict";
  const e = "checkout",
    t = [e],
    n = { [e]: "echckt" },
    i = { [e]: { idKey: "eventId", idDisplayName: "Event Id" } },
    o = {
      widgetType: { type: "string", required: !0 },
      iframeContainerId: { type: "string" },
      iframeContainerHeight: { type: "number" },
      iframeAutoAdapt: { type: "number" },
      modal: { type: "boolean" },
      modalTriggerElementId: { type: "string" },
      googleAnalyticsClientId: { type: "string" },
      extraParams: { type: "object" },
    },
    r = {   
      [e]: {
        eventId: { type: ["string", "number"], required: !0 },
        affiliateCode: { type: "string" },
        promoCode: { type: "string" },
        waitlistToken: { type: "string" },
        onOrderComplete: { type: "function" },
        onTicketQuantityChange: { type: "function" },
        onWidgetModalClose: { type: "function" },
        themeSettings: { type: "object" },
        rsvpToken: { type: "string" },
        ticketsPageSize: { type: "string" },
        preventResizing: { type: "boolean" },
      },
    },
    a = 425,
    d = Object.freeze({ minValue: 75, maxValue: 100, disabled: -1 }),
    s = (e) => {
      console.error(e);
    },
    l = (e, t) => {
      const n = [
        `js_error=${encodeURIComponent(e)}`,
        `parent_url=${encodeURIComponent(window.location.href)}`,
      ];
      e.stack && n.push(`js_error_stack=${encodeURIComponent(e.stack)}`);
      const i = document.createElement("img");
      (i.src = `${t}/widget-error-logging-pixel.gif?${n.join("&")}`),
        document.body.appendChild(i);
    },
    c = new RegExp(
      `^(www\\.)?(${[
        "eventbrite",
        "evbstage",
        "evbdev",
        "evbdev\\.[a-zA-Z0-9-]+\\.[a-zA-Z0-9-]+\\.evbtibet",
        "evbqa\\d{0,2}",
        ".*internal.evbdomains",
      ].join("|")})\\.(${[
        "at",
        "be",
        "ca",
        "ch",
        "cl",
        "co",
        "co\\.nz",
        "co\\.uk",
        "com",
        "com\\.ar",
        "com\\.au",
        "com\\.br",
        "com\\.mx",
        "com\\.pe",
        "de",
        "dk",
        "es",
        "fr",
        "fi",
        "hk",
        "ie",
        "in",
        "it",
        "my",
        "no",
        "nl",
        "pt",
        "se",
        "sg",
      ].join("|")})$`
    ),
    m = /^http(s)?:\/\//,
    g = (e) => c.test(e.replace(m, "")),
    u = () => {
      const e = document.createElement("a"),
        t =
          document.currentScript ||
          (function () {
            const e = document.getElementsByTagName("script");
            return e[e.length - 1];
          })();
      e.href = t.src;
      let n = e.hostname;
      return g(n) || (n = "www.eventbrite.com"), `https://${n}`;
    },
    y = (e, t = !0) => {
      let n = null;
      t && (n = window.open(e, "_blank")),
        n ? n.focus() : (window.location.href = e);
    },
    p = "small",
    f = {
      large: (e) => e >= 800,
      medium: (e) => e >= 480,
      [p]: (e) => e,
      na: (e) => !e,
    },
    w = () => {
      let e = 0;
      const t = Object.keys(f),
        n = t.length;
      for (; e < n; ) {
        if (
          f[t[e]](
            window.innerWidth ||
              document.documentElement.clientWidth ||
              document.body.clientWidth
          )
        )
          return t[e];
        e += 1;
      }
      return f.na;
    },
    h = t.reduce((e, t) => ({ ...e, [t]: {} }), {});
  let b = 0;
  const v = (t) => {
      const { widgetType: n = e } = t,
        { idKey: o, idDisplayName: r } = i[n] || {},
        { [o]: a } = t;
      return { id: a, type: n, idKey: o, idDisplayName: r };
    },
    C = (e) => {
      const { type: t, id: n } = v(e),
        { [t]: { [n]: i } = {} } = h;
      return i;
    },
    $ = (e, n = {}, i) => {
      const { widgetIdentifier: { type: o, id: r } = {} } = e;
      if (t.indexOf(o) < 0 || !r) return;
      let a = h[o][r];
      return !0 === i && (a = {}), (h[o][r] = { ...a, ...n }), h[o][r];
    },
    k = u(),
    E = "https:" === window.location.protocol,
    I = (e) => !!e.userConfig.preventResizing,
    T = (e) => {
      let t;
      const n =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight,
        i = e.userConfig.iframeContainerHeight,
        o = e.userConfig.iframeAutoAdapt;
      (t = ((e, t, n) => {
        const i = e > n,
          o = w() === p,
          r = t !== d.disabled;
        return i && o && r;
      })(i, o, n)
        ? ((e, t) => {
            let n = Math.floor(
              (e *
                ((e = d.minValue) => {
                  const t = e > d.maxValue,
                    n = e < d.minValue;
                  return t ? d.maxValue : n ? d.minValue : e;
                })(t)) /
                100
            );
            return n < a && (n = a), n;
          })(n, o)
        : i > a
        ? i
        : a),
        (e.iframeContainer.style.height = `${t}px`);
    },
    x = (e) => {
      const t = document.getElementsByTagName("body")[0],
        n = document.getElementById("eventbrite-widget-modal-overlay"),
        { widgetIdentifier: { id: i } = {} } = e,
        o = document.getElementById(`eventbrite-widget-modal-${i}`);
      (n.style.opacity = 0),
        (n.style.background = "rgba(0, 0, 0, 0)"),
        (n.style.width = 0),
        (n.style.height = 0),
        (t.style.overflow = e.originalBodyOverflow),
        (t.style.position = e.originalBodyPosition),
        o && o.parentNode.removeChild(o),
        e.userConfig &&
          e.userConfig.onWidgetModalClose &&
          e.userConfig.onWidgetModalClose();
    },
    A = {
      widgetRenderComplete: (e, t) => {
        e.iframeContainer &&
          (I(e) || (T(e), (e.computedHeight = `${t.widgetHeight}px`)),
          t.canonicalEventUrl &&
            t.translatedLinkText &&
            ((e, t, i, o) => {
              const r = e.userConfig.widgetType,
                a = `${r}-widget-link-${t}`;
              if (
                ((e, t) =>
                  e.iframeContainer.parentNode.innerHTML.indexOf(t) > -1)(e, a)
              )
                return;
              const d = document.createElement("a");
              (d.href = `${i}?ref=${n[r]}`),
                (d.innerHTML = o),
                (d.target = "_blank"),
                (d.style.display = "block"),
                (d.style.margin = "10px 0"),
                (d.style.textDecoration = "none"),
                (d.style.color = "#00ACAF"),
                (d.style.fontFamily =
                  "Benton Sans, Helvetica, Arial, sans-serif"),
                (d.style.textAlign = "center"),
                d.setAttribute("data-automation", a),
                e.iframeContainer.parentNode.insertBefore(
                  d,
                  e.iframeContainer.nextSibling
                );
            })(e, t.eventId, t.canonicalEventUrl, t.translatedLinkText));
        const i = document.getElementById("eventbrite-widget-modal-overlay"),
          o = document.getElementById("eventbrite-widget-modal-loader");
        i && o && i.removeChild(o);
      },
      widgetNotEligible: (e, t) => {
        var n;
        t.canonicalEventUrl
          ? y(t.canonicalEventUrl)
          : y(((n = t.eventId), `${u()}/e/${n}`)),
          x(e);
      },
      widgetMisconfigured: (e, t) => {
        const {
          userConfig: n,
          widgetIdentifier: {
            id: i = "unknown",
            idKey: o = "id",
            idDisplayName: r = "Id",
          } = {},
        } = e;
        let a = "unknown";
        var d;
        n && (a = n.modalTriggerElementId || n.iframeContainerId || "unknown"),
          l(`Widget ${o} ${i} with domElementId ${a} misconfigured`, k),
          s(
            `Widget for ${o} ${i} with domElementId ${a} is misconfigured. Check that ${o} is valid.`
          ),
          (d = `${r} ${i} cannot be found. Please contact the site owner to resolve this issue.`),
          window.alert(d),
          x(e);
      },
      widgetModalClose: x,
      orderStart: (e) => {
        e.iframeContainer && !I(e) && T(e);
      },
      backToTicketSelection: (e) => {
        e.iframeContainer &&
          !I(e) &&
          (e.iframeContainer.style.height = e.computedHeight);
      },
      orderComplete: (e, t) => {
        if (e.userConfig.onOrderComplete) {
          const { orderId: n } = t;
          e.userConfig.onOrderComplete({ orderId: n });
        }
      },
      protectCheckout: (e, t) => {
        let n;
        (n = t.disable ? "remove" : "set"),
          ((e) => {
            "set" === e ? (b += 1) : (b -= 1);
          })(n);
      },
      ticketQuantityChange: (e, t) => {
        if (e.userConfig.onTicketQuantityChange) {
          const { id: n, quantity: i } = t;
          e.userConfig.onTicketQuantityChange({ ticketId: n, quantity: i });
        }
      },
    },
    B = (e) => {
      const t = e.origin || e.originalEvent.origin,
        n = e.data;
      if (((e) => g(e))(t) && ((e) => e && C(e) && e.messageName in A)(n)) {
        const e = C(n);
        e && A[n.messageName](e, n);
      }
    },
    N = "height 0.5s ease-in-out",
    L = (e) => {
      "height" === e.propertyName &&
        window.dispatchEvent &&
        window.dispatchEvent(new Event("resize"));
    },
    M = (e, t, n) => {
      (t.style.height = t.clientHeight),
        (t.style.webkitTransition = N),
        (t.style.mozTransition = N),
        (t.style.transition = N),
        t.addEventListener(
          "transitionend webkitTransitionEnd oTransitionEnd",
          L
        );
      const i = ((e, t) => {
        const {
            widgetIdentifier: { type: n, id: i } = {},
            iframeTitle: o = "",
          } = e,
          r = document.createElement("iframe");
        return (
          (r.src = t),
          r.setAttribute("data-automation", `${n}-widget-iframe-${i}`),
          r.setAttribute("allowtransparency", !0),
          r.setAttribute("frameborder", 0),
          r.setAttribute("scrolling", "auto"),
          r.setAttribute("width", "100%"),
          r.setAttribute("height", "100%"),
          o && r.setAttribute("title", o),
          r
        );
      })(e, n);
      t.appendChild(i), $(e, { iframe: i, iframeContainer: t });
    },
    O = 2147483647,
    H = (e, t, n = 0) =>
      !(n > 20 || e === document.body || !e) &&
      (e.id === t || H(e.parentElement, t, n++)),
    S = (e, t, n) => {
      const i = document.getElementById(t);
      document.addEventListener("click", (i) => {
        H(i.target, t) &&
          !((e) => !!document.querySelector(`iframe[src*="${e}"]`))(n) &&
          ((e, t) => {
            const n = ((e = {}, t) => {
                const n = document.createElement("iframe"),
                  {
                    widgetIdentifier: { id: i, type: o } = {},
                    iframeTitle: r = "",
                  } = e;
                return (
                  (n.src = t),
                  (n.id = `eventbrite-widget-modal-${i}`),
                  n.setAttribute("data-automation", `${o}-widget-iframe-${i}`),
                  n.setAttribute("allowtransparency", !0),
                  n.setAttribute("allowfullscreen", !0),
                  n.setAttribute("frameborder", 0),
                  r && n.setAttribute("title", r),
                  (n.style.zIndex = O),
                  (n.style.position = "fixed"),
                  (n.style.top = 0),
                  (n.style.left = 0),
                  (n.style.right = 0),
                  (n.style.bottom = 0),
                  (n.style.margin = 0),
                  (n.style.border = 0),
                  (n.style.width = "100%"),
                  (n.style.height = "100%"),
                  n
                );
              })(e, t),
              i = document.getElementsByTagName("body")[0],
              o = w();
            $(e, {
              originalBodyOverflow: window
                .getComputedStyle(i)
                .getPropertyValue("overflow"),
              originalBodyPosition: window
                .getComputedStyle(i)
                .getPropertyValue("position"),
            }),
              (() => {
                const e = document.getElementById(
                  "eventbrite-widget-modal-overlay"
                );
                (e.innerHTML =
                  '<svg id="eventbrite-widget-modal-loader" viewBox="0 0 100 100" style="position: absolute; top: 50%; left: 50%; margin-left: -48px; margin-top: -48px; width: 96px; height: 96px; -webkit-animation-iteration-count: infinite; animation-iteration-count: infinite; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards; -webkit-animation: rotate 800ms linear infinite; animation: eventbrite-widget-modal-loader-rotate 800ms linear infinite;" aria-valuetext="In progress" data-reactid="6"><defs data-reactid="7"><linearGradient id="stroke-large-chunky-gradient-indeterminate" data-reactid="8"><stop offset="0%" stop-color="#1de1e1" data-reactid="9"></stop><stop offset="50%" stop-color="#1de1e1" data-reactid="10"></stop><stop offset="100%" stop-color="#6aedc7" stop-opacity="0" data-reactid="11"></stop></linearGradient></defs><path d="M93.5,50C93.5,74,74,93.5,50,93.5S6.5,74,6.5,50S26,6.5,50,6.5" stroke="url(#stroke-large-chunky-gradient-indeterminate)" stroke-width="4" stroke-linecap="round" shape-rendering="geometricPrecision" fill="none" data-reactid="12"></path></svg>'),
                  (e.style.opacity = 1),
                  (e.style.background = "rgba(0, 0, 0, 0.8)"),
                  (e.style.width = "100%"),
                  (e.style.height = "100%");
              })(),
              i.appendChild(n),
              (i.style.overflow = "hidden"),
              o === p && (i.style.position = "fixed");
          })(e, n);
      }),
        (() => {
          const e = document.createElement("style"),
            t = document.createElement("div"),
            n = document.getElementsByTagName("body")[0];
          (e.innerHTML =
            "\n    @-webkit-keyframes eventbrite-widget-modal-loader-rotate {\n        to {\n            -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n        }\n    }\n\n    @keyframes eventbrite-widget-modal-loader-rotate {\n        to {\n            -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n        }\n    }\n"),
            n.appendChild(e),
            (t.id = "eventbrite-widget-modal-overlay"),
            (t.style.opacity = 0),
            (t.style.background = "rgba(0, 0, 0, 0)"),
            (t.style.transition =
              "opacity 1s ease-in-out, background 1s ease-in-out"),
            (t.style.zIndex = O),
            (t.style.position = "fixed"),
            (t.style.top = 0),
            (t.style.left = 0),
            (t.style.width = "0"),
            (t.style.height = "0"),
            n.appendChild(t);
        })(),
        $(e, { modalTriggerElement: i });
    },
    z = {
      [e]: ({
        eventId: e,
        modal: t,
        googleAnalyticsClientId: n,
        affiliateCode: i,
        extraParams: o,
        promoCode: r,
        waitlistToken: a,
        themeSettings: d,
        rsvpToken: l,
      }) => {
        const c = window.encodeURIComponent(window.location.href);
        let m = `${k}/checkout-external?eid=${e}&parent=${c}`;
        if (
          (E ||
            s(
              "For security reasons, the embedded checkout widget can only be used on pages served over https."
            ),
          t && (m = `${m}&modal=1`),
          i && (m = `${m}&aff=${i}`),
          o &&
            o.forEach((e) => {
              m = `${m}&${encodeURI(e.name)}=${encodeURI(e.value)}`;
            }),
          r && (m = `${m}&promo_code=${r}`),
          a && (m = `${m}&w=${a}`),
          n && (m = `${m}&_eboga=${n}`),
          d)
        ) {
          const e = JSON.stringify(d);
          m = `${m}&theme=${encodeURIComponent(e)}`;
        }
        return l && (m = `${m}&rsvpToken=${l}`), m;
      },
    },
    R = (e, t) => {
      let n = [],
        i = !1;
      return (
        "string" == typeof t ? n.push(t) : (n = t),
        n.forEach((t) => {
          typeof e === t && (i = !0);
        }),
        i
      );
    },
    U = (e, t) => {
      for (const n in e)
        if (Object.prototype.hasOwnProperty.call(e, n)) {
          const i = e[n];
          if (i.required && void 0 === t[n])
            return s(`'${n}' is a required property`), !1;
          if (t[n] && !R(t[n], i.type))
            return s(`'${n}' should be: ${i.type}`), !1;
        }
      return !0;
    };
  let j = 0;
  globalThis.window &&
    (globalThis.window.EBWidgets = {
      createWidget: (e) => {
        try {
          if (
            ((e) => {
              if (!e) return !1;
              if (!U(o, e)) return !1;
              if (t.indexOf(e.widgetType) < 0)
                return s(`'${e.widgetType}' is not a valid widgetType`), !1;
              const n = r[e.widgetType];
              return U(n, e);
            })(e)
          ) {
            const t = v(e);
            ((e) => {
              const { widgetType: t, modal: n } = e,
                i = z[t](e);
              n
                ? ((e = {}, t) => {
                    const {
                      modalTriggerElementId: n,
                      widgetIdentifier: { id: i, idDisplayName: o } = {},
                    } = e;
                    if (!n)
                      return void s(
                        "Modal widgets require a modalTriggerElementId"
                      );
                    let r = document.getElementById(n);
                    r
                      ? S(e, n, t)
                      : document.addEventListener("DOMContentLoaded", () => {
                          (r = document.getElementById(n)),
                            r
                              ? S(e, n, t)
                              : s(
                                  `Modal trigger element '${n}'\n                    for ${o} '${i}' not found`
                                );
                        });
                  })(e, i)
                : ((e = {}, t) => {
                    const {
                      iframeContainerId: n,
                      widgetIdentifier: { id: i, idDisplayName: o } = {},
                    } = e;
                    if (!n)
                      return void s(
                        "Inline widgets require an iframeContainerId"
                      );
                    let r = document.getElementById(n);
                    r
                      ? M(e, r, t)
                      : document.addEventListener("DOMContentLoaded", () => {
                          (r = document.getElementById(n)),
                            r
                              ? M(e, r, t)
                              : s(
                                  `Iframe container '${n}'\n                    for ${o} '${i}' not found`
                                );
                        });
                  })(e, i);
            })(
              $(
                { widgetIdentifier: t },
                { ...e, userConfig: e, widgetIdentifier: t },
                !0
              )
            );
          }
        } catch (e) {
          try {
            j < 5 && (l(e, k), j++);
          } catch (e) {}
        }
      },
    }),
    (() => {
      let e = "onmessage",
        t = window.attachEvent;
      window.addEventListener &&
        ((t = window.addEventListener), (e = "message")),
        t(e, B);
    })(),
    window.addEventListener("beforeunload", (e) => {
      const t =
        "You are in the middle of completing checkout. Are you sure you want to abandon checkout?";
      if (b > 0) return (e.returnValue = t), t;
    });
})();
