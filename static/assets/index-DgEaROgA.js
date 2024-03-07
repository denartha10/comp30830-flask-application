(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) s(i);
  new MutationObserver((i) => {
    for (const n of i)
      if (n.type === "childList")
        for (const o of n.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && s(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function r(i) {
    const n = {};
    return (
      i.integrity && (n.integrity = i.integrity),
      i.referrerPolicy && (n.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === "use-credentials"
        ? (n.credentials = "include")
        : i.crossOrigin === "anonymous"
          ? (n.credentials = "omit")
          : (n.credentials = "same-origin"),
      n
    );
  }
  function s(i) {
    if (i.ep) return;
    i.ep = !0;
    const n = r(i);
    fetch(i.href, n);
  }
})();
const P = async () => {
  try {
    const t = await fetch("/data");
    if (!t.ok) throw new Error("Failed to fetch bike data from server");
    const e = await t.json();
  } catch (t) {
    console.error(t);
  }
};
document.getElementById("mainContent");
document.getElementById("sidebar");
document.getElementById("liveTimer");
document.getElementById("weatherMenu");
document.getElementById("searchBar");
document.getElementById("sidebarToggle");
document.getElementById("weatherToggle");
document.getElementById("closeWeather");
document.getElementById("searchTrip");
const O = document.getElementById("map");
function C(t, e, r, s) {
  function i(n) {
    return n instanceof r
      ? n
      : new r(function (o) {
          o(n);
        });
  }
  return new (r || (r = Promise))(function (n, o) {
    function l(a) {
      try {
        d(s.next(a));
      } catch (c) {
        o(c);
      }
    }
    function h(a) {
      try {
        d(s.throw(a));
      } catch (c) {
        o(c);
      }
    }
    function d(a) {
      a.done ? n(a.value) : i(a.value).then(l, h);
    }
    d((s = s.apply(t, e || [])).next());
  });
}
function A(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default")
    ? t.default
    : t;
}
var L = function t(e, r) {
    if (e === r) return !0;
    if (e && r && typeof e == "object" && typeof r == "object") {
      if (e.constructor !== r.constructor) return !1;
      var s, i, n;
      if (Array.isArray(e)) {
        if (((s = e.length), s != r.length)) return !1;
        for (i = s; i-- !== 0; ) if (!t(e[i], r[i])) return !1;
        return !0;
      }
      if (e.constructor === RegExp)
        return e.source === r.source && e.flags === r.flags;
      if (e.valueOf !== Object.prototype.valueOf)
        return e.valueOf() === r.valueOf();
      if (e.toString !== Object.prototype.toString)
        return e.toString() === r.toString();
      if (((n = Object.keys(e)), (s = n.length), s !== Object.keys(r).length))
        return !1;
      for (i = s; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(r, n[i])) return !1;
      for (i = s; i-- !== 0; ) {
        var o = n[i];
        if (!t(e[o], r[o])) return !1;
      }
      return !0;
    }
    return e !== e && r !== r;
  },
  M = A(L);
const k = "__googleMapsScriptId";
var p;
(function (t) {
  (t[(t.INITIALIZED = 0)] = "INITIALIZED"),
    (t[(t.LOADING = 1)] = "LOADING"),
    (t[(t.SUCCESS = 2)] = "SUCCESS"),
    (t[(t.FAILURE = 3)] = "FAILURE");
})(p || (p = {}));
class u {
  constructor({
    apiKey: e,
    authReferrerPolicy: r,
    channel: s,
    client: i,
    id: n = k,
    language: o,
    libraries: l = [],
    mapIds: h,
    nonce: d,
    region: a,
    retries: c = 3,
    url: m = "https://maps.googleapis.com/maps/api/js",
    version: f,
  }) {
    if (
      ((this.callbacks = []),
      (this.done = !1),
      (this.loading = !1),
      (this.errors = []),
      (this.apiKey = e),
      (this.authReferrerPolicy = r),
      (this.channel = s),
      (this.client = i),
      (this.id = n || k),
      (this.language = o),
      (this.libraries = l),
      (this.mapIds = h),
      (this.nonce = d),
      (this.region = a),
      (this.retries = c),
      (this.url = m),
      (this.version = f),
      u.instance)
    ) {
      if (!M(this.options, u.instance.options))
        throw new Error(
          `Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(u.instance.options)}`,
        );
      return u.instance;
    }
    u.instance = this;
  }
  get options() {
    return {
      version: this.version,
      apiKey: this.apiKey,
      channel: this.channel,
      client: this.client,
      id: this.id,
      libraries: this.libraries,
      language: this.language,
      region: this.region,
      mapIds: this.mapIds,
      nonce: this.nonce,
      url: this.url,
      authReferrerPolicy: this.authReferrerPolicy,
    };
  }
  get status() {
    return this.errors.length
      ? p.FAILURE
      : this.done
        ? p.SUCCESS
        : this.loading
          ? p.LOADING
          : p.INITIALIZED;
  }
  get failed() {
    return this.done && !this.loading && this.errors.length >= this.retries + 1;
  }
  createUrl() {
    let e = this.url;
    return (
      (e += "?callback=__googleMapsCallback&loading=async"),
      this.apiKey && (e += `&key=${this.apiKey}`),
      this.channel && (e += `&channel=${this.channel}`),
      this.client && (e += `&client=${this.client}`),
      this.libraries.length > 0 &&
        (e += `&libraries=${this.libraries.join(",")}`),
      this.language && (e += `&language=${this.language}`),
      this.region && (e += `&region=${this.region}`),
      this.version && (e += `&v=${this.version}`),
      this.mapIds && (e += `&map_ids=${this.mapIds.join(",")}`),
      this.authReferrerPolicy &&
        (e += `&auth_referrer_policy=${this.authReferrerPolicy}`),
      e
    );
  }
  deleteScript() {
    const e = document.getElementById(this.id);
    e && e.remove();
  }
  load() {
    return this.loadPromise();
  }
  loadPromise() {
    return new Promise((e, r) => {
      this.loadCallback((s) => {
        s ? r(s.error) : e(window.google);
      });
    });
  }
  importLibrary(e) {
    return this.execute(), google.maps.importLibrary(e);
  }
  loadCallback(e) {
    this.callbacks.push(e), this.execute();
  }
  setScript() {
    var e, r;
    if (document.getElementById(this.id)) {
      this.callback();
      return;
    }
    const s = {
      key: this.apiKey,
      channel: this.channel,
      client: this.client,
      libraries: this.libraries.length && this.libraries,
      v: this.version,
      mapIds: this.mapIds,
      language: this.language,
      region: this.region,
      authReferrerPolicy: this.authReferrerPolicy,
    };
    Object.keys(s).forEach((n) => !s[n] && delete s[n]),
      (!(
        (r =
          (e = window?.google) === null || e === void 0 ? void 0 : e.maps) ===
          null || r === void 0
      ) &&
        r.importLibrary) ||
        ((n) => {
          let o,
            l,
            h,
            d = "The Google Maps JavaScript API",
            a = "google",
            c = "importLibrary",
            m = "__ib__",
            f = document,
            g = window;
          g = g[a] || (g[a] = {});
          const b = g.maps || (g.maps = {}),
            I = new Set(),
            y = new URLSearchParams(),
            _ = () =>
              o ||
              (o = new Promise((v, w) =>
                C(this, void 0, void 0, function* () {
                  var E;
                  yield (l = f.createElement("script")),
                    (l.id = this.id),
                    y.set("libraries", [...I] + "");
                  for (h in n)
                    y.set(
                      h.replace(/[A-Z]/g, (S) => "_" + S[0].toLowerCase()),
                      n[h],
                    );
                  y.set("callback", a + ".maps." + m),
                    (l.src = this.url + "?" + y),
                    (b[m] = v),
                    (l.onerror = () => (o = w(Error(d + " could not load.")))),
                    (l.nonce =
                      this.nonce ||
                      ((E = f.querySelector("script[nonce]")) === null ||
                      E === void 0
                        ? void 0
                        : E.nonce) ||
                      ""),
                    f.head.append(l);
                }),
              ));
          b[c]
            ? console.warn(d + " only loads once. Ignoring:", n)
            : (b[c] = (v, ...w) => I.add(v) && _().then(() => b[c](v, ...w)));
        })(s);
    const i = this.libraries.map((n) => this.importLibrary(n));
    i.length || i.push(this.importLibrary("core")),
      Promise.all(i).then(
        () => this.callback(),
        (n) => {
          const o = new ErrorEvent("error", { error: n });
          this.loadErrorCallback(o);
        },
      );
  }
  reset() {
    this.deleteScript(),
      (this.done = !1),
      (this.loading = !1),
      (this.errors = []),
      (this.onerrorEvent = null);
  }
  resetIfRetryingFailed() {
    this.failed && this.reset();
  }
  loadErrorCallback(e) {
    if ((this.errors.push(e), this.errors.length <= this.retries)) {
      const r = this.errors.length * Math.pow(2, this.errors.length);
      console.error(`Failed to load Google Maps script, retrying in ${r} ms.`),
        setTimeout(() => {
          this.deleteScript(), this.setScript();
        }, r);
    } else (this.onerrorEvent = e), this.callback();
  }
  callback() {
    (this.done = !0),
      (this.loading = !1),
      this.callbacks.forEach((e) => {
        e(this.onerrorEvent);
      }),
      (this.callbacks = []);
  }
  execute() {
    if ((this.resetIfRetryingFailed(), this.done)) this.callback();
    else {
      if (window.google && window.google.maps && window.google.maps.version) {
        console.warn(
          "Google Maps already loaded outside @googlemaps/js-api-loader.This may result in undesirable behavior as options and script parameters may not match.",
        ),
          this.callback();
        return;
      }
      this.loading || ((this.loading = !0), this.setScript());
    }
  }
}
const $ = async () => {
    await new u({ apiKey: "YOUR_API_KEY", version: "weekly" }).load();
  },
  j = async () => {
    const { Map: t } = await google.maps.importLibrary("maps"),
      { AdvancedMarkerElement: e, PinElement: r } =
        await google.maps.importLibrary("marker");
    return { Map: t, AdvancedMarkerElement: e, PinElement: r };
  };
await $();
const { Map: B, AdvancedMarkerElement: R, PinElement: x } = await j(),
  N = (t) =>
    t.status != "OPEN"
      ? { background: "rgba(077, 077, 077)", border: "rgba(041, 041, 041)" }
      : t.available_bikes > 5
        ? { background: "rgba(046, 209, 138)", border: "rgba(019, 115, 051)" }
        : t.available_bikes > 2
          ? { background: "rgba(255, 255, 000)", border: "rgba(179, 179, 000)" }
          : t.available_bikes > 0
            ? {
                background: "rgba(255, 153, 000)",
                border: "rgba(153, 092, 000)",
              }
            : {
                background: "rgba(217, 098, 099)",
                border: "rgba(110, 023, 024)",
              },
  T = (t, { background: e, border: r }) => {
    const s = document.createElement("div");
    return (
      (s.className = "font-bold"),
      (s.style.fontSize = "14px"),
      (s.textContent = t.available_bikes.toString()),
      new x({ background: e, borderColor: r, glyphColor: r, glyph: s })
    );
  },
  D = (t) => `
        <div class="max-w-xs">
            <div class="bg-white p-2 rounded-lg shadow-lg">
                <h2 class="text-lg font-semibold mb-2">${t.name}</h2>
                <div class="flex flex-col space-y-1">
                    <div><span class="font-semibold">Bikes Available:</span> <span class="${t.available_bikes === 0 ? "text-red-600" : "text-gray-600"}">${t.available_bikes}</span></div>
                    <div><span class="font-semibold">Stands Available:</span> <span class="text-gray-600">${t.available_stands}</span></div>
                </div>
            </div>
        </div>`,
  F = (t, e) =>
    new google.maps.InfoWindow({
      content: e,
      ariaLabel: `Bike Stand ${t.id.toString()}`,
    }),
  U = (t, e, r) =>
    new R({
      map: t,
      position: { lat: r.lat, lng: r.lng },
      title: "not selected",
      content: e.element,
      gmpClickable: !0,
    }),
  K = {
    zoom: 14,
    center: { lat: 53.347, lng: -6.27 },
    mapTypeControl: !1,
    streetViewControl: !1,
    ClickableIcons: !1,
    mapId: "dublin_bike_map_id",
  },
  G = new B(O, K),
  q = await P(),
  W = q.map((t) => [t, N(t)]),
  Z = W.map(([t, { background: e, border: r }]) => [
    t,
    T(t, { background: e, border: r }),
  ]),
  z = Z.map(([t, e]) => [t, e, D(t)]),
  J = z.map(([t, e, r]) => [t, e, U(G, e, t), F(t, r)]);
J.reduce(
  (t, [e, r, s, i]) => ((t[e.id] = { marker: s, info: e, pin: r }), t),
  {},
);
