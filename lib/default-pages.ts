import type { Block, NavItem, Page, PageHero } from "./types";

const json = (v: unknown) => JSON.stringify(v, null, 2);
let n = 0;
const id = (p: string) => `${p}-${++n}`;
const block = (type: string, data: Record<string, unknown>): Block => ({ id: id("b"), type, visible: true, ...data });
const items = <T extends Record<string, unknown>>(xs: T[]) => xs.map((x) => ({ id: id("i"), ...x }));

const hero = (h: Partial<PageHero>): PageHero => ({
  eyebrow: "",
  title: "",
  highlight: "",
  subtitle: "",
  primaryLabel: "Request API Access",
  primaryHref: "/contact",
  secondaryLabel: "",
  secondaryHref: "",
  art: "orbit",
  codeTitle: "",
  code: "",
  orbitIcons: ["plane", "building", "train", "car", "globe", "ticket"],
  chips: [],
  ...h,
});

const cta = (title: string, text: string) =>
  block("cta", { title, text, primary: "Get sandbox keys", primaryHref: "/contact", secondary: "Talk to an engineer", secondaryHref: "/contact" });

export const DEFAULT_NAVIGATION: NavItem[] = [
  { id: "nav-products", label: "Products", type: "products", href: "/#products", highlight: false, badge: "", visible: true, children: [] },
  {
    id: "nav-coverage", label: "Coverage", type: "dropdown", href: "", highlight: true, badge: "", visible: true,
    children: [
      { id: "nc1", label: "Flight coverage", href: "/coverage/flights", icon: "plane", description: "Airlines, GDS, NDC and LCC content by region" },
      { id: "nc2", label: "Hotel coverage", href: "/coverage/hotels", icon: "building", description: "Properties and chains across 200+ countries" },
      { id: "nc3", label: "Airports", href: "/coverage/airports", icon: "luggage", description: "Search airports with services available" },
      { id: "nc4", label: "Regions & markets", href: "/coverage/regions", icon: "globe", description: "Point-of-sale markets and currencies" },
    ],
  },
  { id: "nav-hotels", label: "Hotels", type: "link", href: "/hotels", highlight: false, badge: "", visible: true, children: [] },
  { id: "nav-gds", label: "GDS", type: "link", href: "/gds", highlight: false, badge: "", visible: true, children: [] },
  { id: "nav-ndc", label: "NDC", type: "link", href: "/ndc", highlight: true, badge: "New", visible: true, children: [] },
  {
    id: "nav-dev", label: "Developers", type: "dropdown", href: "", highlight: false, badge: "", visible: true,
    children: [
      { id: "nd1", label: "Developer hub", href: "/developers", icon: "code", description: "Everything you need to build" },
      { id: "nd2", label: "Quickstart", href: "/developers/quickstart", icon: "rocket", description: "First booking in under an hour" },
      { id: "nd4", label: "Changelog", href: "/developers/changelog", icon: "trending", description: "What shipped and when" },
      { id: "nd5", label: "System status", href: "/developers/status", icon: "zap", description: "Live health of every service" },
    ],
  },
  { id: "nav-uc", label: "Use Cases", type: "link", href: "/#usecases", highlight: false, badge: "", visible: true, children: [] },
  { id: "nav-faq", label: "FAQ", type: "link", href: "/#faq", highlight: false, badge: "", visible: true, children: [] },
];

const REGIONS = ["South Asia", "Middle East", "Europe", "East Asia", "North America", "Africa"];

export const DEFAULT_PAGES: Page[] = [
  // ── Coverage ──────────────────────────────────────────────────────────
  {
    id: "pg-cov-flights", slug: "coverage/flights", title: "Flight coverage", visible: true,
    seoDescription: "Airline content across GDS, NDC and low-cost carriers, by region.",
    hero: hero({
      eyebrow: "Coverage · Flights", title: "700+ airlines.", highlight: "One search.",
      subtitle: "Full-service carriers through global distribution systems, airline-direct NDC offers and low-cost carriers, merged into one ranked response.",
      secondaryLabel: "See the Flight API", secondaryHref: "/products/flight-api",
      chips: ["GDS + NDC + LCC", "Branded fares", "Ancillaries & seats"], orbitIcons: ["plane", "globe", "ticket", "luggage", "zap", "star"],
    }),
    blocks: [
      block("stats", { items: items([
        { prefix: "", value: 700, suffix: "+", label: "Airlines connected" },
        { prefix: "", value: 67, suffix: "", label: "Low-cost carriers" },
        { prefix: "", value: 190, suffix: "+", label: "Countries served" },
        { prefix: "", value: 3, suffix: "", label: "Content sources merged" },
      ]) }),
      block("coverage", {
        eyebrow: "Explore", title: "Airline content by region", subtitle: "Filter by region or search by name, code or content type.",
        searchPlaceholder: "Search carriers, codes or content type…",
        regions: items(REGIONS.map((r, i) => ({ name: r, value: `${[86, 74, 168, 142, 96, 58][i]}`, label: "airlines" }))),
        items: items([
          { name: "Full-service carriers", code: "GDS", region: "South Asia", meta: "Published & private fares", tags: "GDS, Branded fares" },
          { name: "Regional low-cost carriers", code: "LCC", region: "South Asia", meta: "Direct API connections", tags: "LCC, Bundles" },
          { name: "Gulf network carriers", code: "NDC", region: "Middle East", meta: "Rich offers & continuous pricing", tags: "NDC, Ancillaries" },
          { name: "Middle East low-cost", code: "LCC", region: "Middle East", meta: "Seats & bags at booking", tags: "LCC" },
          { name: "European flag carriers", code: "NDC", region: "Europe", meta: "NDC-first content", tags: "NDC, GDS" },
          { name: "European low-cost", code: "LCC", region: "Europe", meta: "Point-to-point fares", tags: "LCC, Bundles" },
          { name: "East Asian carriers", code: "GDS", region: "East Asia", meta: "Full GDS inventory", tags: "GDS" },
          { name: "Asia-Pacific low-cost", code: "LCC", region: "East Asia", meta: "Direct connections", tags: "LCC" },
          { name: "North American majors", code: "NDC", region: "North America", meta: "NDC + GDS fallback", tags: "NDC, GDS" },
          { name: "African carriers", code: "GDS", region: "Africa", meta: "Regional networks", tags: "GDS" },
        ]),
      }),
      block("compare", {
        eyebrow: "Content sources", title: "Three sources, one schema", subtitle: "", usLabel: "Unified API", themLabel: "Single source",
        rows: items([
          { label: "GDS content", us: "yes", them: "yes" },
          { label: "Airline-direct NDC offers", us: "yes", them: "no" },
          { label: "Low-cost carriers", us: "yes", them: "no" },
          { label: "De-duplicated results", us: "yes", them: "no" },
          { label: "One booking flow", us: "yes", them: "Per source" },
        ]),
      }),
      cta("Need a carrier that isn't listed?", "Tell us your markets and we'll confirm content before you integrate."),
    ],
  },
  {
    id: "pg-cov-hotels", slug: "coverage/hotels", title: "Hotel coverage", visible: true,
    seoDescription: "Two million properties mapped to a single ID.",
    hero: hero({
      eyebrow: "Coverage · Hotels", title: "2M+ properties.", highlight: "Mapped once.",
      subtitle: "Chains, independents and apartments from multiple suppliers, de-duplicated to a single property ID with rich content.",
      secondaryLabel: "Hotel API", secondaryHref: "/hotels", orbitIcons: ["building", "hotel", "star", "map", "wallet", "globe"],
      chips: ["Rich content", "Live rates", "Free cancellation data"],
    }),
    blocks: [
      block("stats", { items: items([
        { prefix: "", value: 2, suffix: "M+", label: "Properties" },
        { prefix: "", value: 200, suffix: "+", label: "Countries" },
        { prefix: "", value: 98, suffix: "%", label: "Mapping accuracy" },
        { prefix: "", value: 30, suffix: "+", label: "Languages of content" },
      ]) }),
      block("coverage", {
        eyebrow: "Explore", title: "Properties by region", subtitle: "Top destinations and property mix in each region.",
        searchPlaceholder: "Search destinations…",
        regions: items(REGIONS.map((r, i) => ({ name: r, value: ["180k", "140k", "620k", "410k", "390k", "90k"][i], label: "properties" }))),
        items: items([
          { name: "Dhaka", code: "DAC", region: "South Asia", meta: "4,200 properties", tags: "City, Business" },
          { name: "Cox's Bazar", code: "CXB", region: "South Asia", meta: "1,100 properties", tags: "Beach, Resort" },
          { name: "Dubai", code: "DXB", region: "Middle East", meta: "11,800 properties", tags: "City, Luxury" },
          { name: "Makkah", code: "MKK", region: "Middle East", meta: "2,600 properties", tags: "Religious, City" },
          { name: "London", code: "LON", region: "Europe", meta: "24,000 properties", tags: "City" },
          { name: "Paris", code: "PAR", region: "Europe", meta: "21,500 properties", tags: "City, Romance" },
          { name: "Bangkok", code: "BKK", region: "East Asia", meta: "16,300 properties", tags: "City, Budget" },
          { name: "Bali", code: "DPS", region: "East Asia", meta: "13,900 properties", tags: "Beach, Villa" },
          { name: "New York", code: "NYC", region: "North America", meta: "9,700 properties", tags: "City" },
          { name: "Cape Town", code: "CPT", region: "Africa", meta: "5,400 properties", tags: "City, Nature" },
        ]),
      }),
      cta("Looking for a specific chain or market?", "We'll share a coverage report for your destinations."),
    ],
  },
  {
    id: "pg-cov-airports", slug: "coverage/airports", title: "Airports", visible: true,
    seoDescription: "Airports with flights, transfers, lounges and fast track available.",
    hero: hero({
      eyebrow: "Coverage · Airports", title: "Every journey starts", highlight: "at an airport.",
      subtitle: "Search airports to see which services you can sell there: flights, transfers, lounges, fast track and meet & greet.",
      orbitIcons: ["luggage", "plane", "sofa", "fast", "handshake", "car"], chips: ["4,000+ airports", "Lounges at 1,500+", "Fast track at 200+"],
    }),
    blocks: [
      block("coverage", {
        eyebrow: "Airport finder", title: "Services by airport", subtitle: "Type a city, airport name or IATA code.",
        searchPlaceholder: "Search by city, airport or IATA code…",
        regions: items(REGIONS.map((r, i) => ({ name: r, value: `${[310, 240, 980, 820, 1150, 420][i]}`, label: "airports" }))),
        items: items([
          { name: "Hazrat Shahjalal International", code: "DAC", region: "South Asia", meta: "Dhaka, Bangladesh", tags: "Flights, Transfers, Lounge, Fast track" },
          { name: "Chattogram Shah Amanat", code: "CGP", region: "South Asia", meta: "Chattogram, Bangladesh", tags: "Flights, Transfers" },
          { name: "Indira Gandhi International", code: "DEL", region: "South Asia", meta: "Delhi, India", tags: "Flights, Transfers, Lounge, Meet & greet" },
          { name: "Dubai International", code: "DXB", region: "Middle East", meta: "Dubai, UAE", tags: "Flights, Transfers, Lounge, Fast track, Meet & greet" },
          { name: "Hamad International", code: "DOH", region: "Middle East", meta: "Doha, Qatar", tags: "Flights, Transfers, Lounge" },
          { name: "London Heathrow", code: "LHR", region: "Europe", meta: "London, UK", tags: "Flights, Transfers, Lounge, Fast track" },
          { name: "Istanbul Airport", code: "IST", region: "Europe", meta: "Istanbul, Türkiye", tags: "Flights, Transfers, Lounge" },
          { name: "Singapore Changi", code: "SIN", region: "East Asia", meta: "Singapore", tags: "Flights, Transfers, Lounge, Fast track" },
          { name: "Suvarnabhumi", code: "BKK", region: "East Asia", meta: "Bangkok, Thailand", tags: "Flights, Transfers, Fast track" },
          { name: "John F. Kennedy International", code: "JFK", region: "North America", meta: "New York, USA", tags: "Flights, Transfers, Lounge" },
          { name: "O. R. Tambo International", code: "JNB", region: "Africa", meta: "Johannesburg, South Africa", tags: "Flights, Transfers, Lounge" },
        ]),
      }),
      block("cards", {
        eyebrow: "Airport services", title: "Sell more than the flight", subtitle: "",
        items: items([
          { title: "Business lounges", icon: "sofa", href: "/products/lounge-api", label: "Lounge API", text: "Checkout add-on with instant QR passes." },
          { title: "Fast track", icon: "fast", href: "/products/fast-track-api", label: "Fast Track API", text: "Priority lanes through security and immigration." },
          { title: "Meet & greet", icon: "handshake", href: "/products/meet-greet-api", label: "Meet & Greet API", text: "A personal assistant from gate to car." },
        ]),
      }),
    ],
  },
  {
    id: "pg-cov-regions", slug: "coverage/regions", title: "Regions & markets", visible: true,
    seoDescription: "Point-of-sale markets, currencies and settlement options.",
    hero: hero({
      eyebrow: "Coverage · Markets", title: "Sell from anywhere,", highlight: "to everywhere.",
      subtitle: "Point-of-sale support for 190+ markets with local currencies, local content and flexible settlement.",
      chips: ["150+ currencies", "Local POS pricing", "Multi-currency settlement"], orbitIcons: ["globe", "wallet", "map", "compass", "chart", "users"],
    }),
    blocks: [
      block("features", {
        eyebrow: "Built for global sellers", title: "Local where it matters", subtitle: "", columns: "3",
        items: items([
          { icon: "wallet", title: "Local currencies", text: "Display and settle in 150+ currencies with transparent FX." },
          { icon: "map", title: "Point-of-sale pricing", text: "Fares and rates priced for the market your customer books from." },
          { icon: "shield", title: "Compliance built in", text: "Market-specific fare rules, taxes and documentation handled for you." },
        ]),
      }),
      block("coverage", {
        eyebrow: "Markets", title: "Supported markets", subtitle: "", searchPlaceholder: "Search countries or currencies…",
        regions: items(REGIONS.map((r, i) => ({ name: r, value: `${[8, 14, 44, 18, 3, 54][i]}`, label: "markets" }))),
        items: items([
          { name: "Bangladesh", code: "BDT", region: "South Asia", meta: "Local POS, BDT settlement", tags: "Flights, Hotels, Transfers" },
          { name: "India", code: "INR", region: "South Asia", meta: "Local POS", tags: "Flights, Hotels, Activities" },
          { name: "United Arab Emirates", code: "AED", region: "Middle East", meta: "Local POS", tags: "Flights, Hotels, Transfers" },
          { name: "Saudi Arabia", code: "SAR", region: "Middle East", meta: "Local POS", tags: "Flights, Hotels, Transfers" },
          { name: "United Kingdom", code: "GBP", region: "Europe", meta: "Local POS", tags: "Flights, Hotels, Activities" },
          { name: "Germany", code: "EUR", region: "Europe", meta: "Local POS", tags: "Flights, Hotels, Activities" },
          { name: "Malaysia", code: "MYR", region: "East Asia", meta: "Local POS", tags: "Flights, Hotels" },
          { name: "United States", code: "USD", region: "North America", meta: "Local POS", tags: "Flights, Hotels, Cars" },
          { name: "Kenya", code: "KES", region: "Africa", meta: "Local POS", tags: "Flights, Hotels" },
        ]),
      }),
    ],
  },

  // ── Product verticals ─────────────────────────────────────────────────
  {
    id: "pg-hotels", slug: "hotels", title: "Hotels", visible: true,
    seoDescription: "Hotel booking API with 2M+ properties, rich content and live rates.",
    hero: hero({
      eyebrow: "Hotel API", title: "Every room,", highlight: "one property ID.",
      subtitle: "Search, price and book two million properties from multiple suppliers. We de-duplicate, map and enrich so your customers see one clean listing.",
      secondaryLabel: "Hotel coverage", secondaryHref: "/coverage/hotels", art: "code", codeTitle: "POST /v1/hotel/search",
      code: json({ destination: "Cox's Bazar, BD", check_in: "2026-12-20", nights: 3, rooms: [{ adults: 2, children: [6] }], filters: { stars: [4, 5], refundable: true } }),
      chips: ["2M+ properties", "Rich content", "Instant confirmation"],
    }),
    blocks: [
      block("features", {
        eyebrow: "Why our hotel API", title: "Content that converts", subtitle: "Better data means fewer support tickets and more bookings.", columns: "4",
        items: items([
          { icon: "layers", title: "One property, one ID", text: "Multi-supplier inventory mapped and de-duplicated." },
          { icon: "star", title: "Rich content", text: "HD photos, amenities, reviews and room-level details." },
          { icon: "wallet", title: "Best available rate", text: "Rates from every supplier compared on each search." },
          { icon: "shield", title: "Clear policies", text: "Normalized cancellation, taxes and fees." },
        ]),
      }),
      block("split", {
        eyebrow: "Developer experience", title: "Search to booking in three calls", text: "Search returns priced rooms in one response. Re-price before checkout, then book with a single request.",
        bullets: ["Room-level availability and pricing", "Package rates bundled with flights", "Webhooks for booking status changes"],
        codeTitle: "Response · 200 OK", reverse: false,
        code: json({ properties: 1204, top: { id: "H-88213", name: "Seaside Grand", stars: 5, from: { amount: 142, currency: "USD" }, refundable_until: "2026-12-17" } }),
      }),
      block("steps", {
        eyebrow: "Booking flow", title: "Search · Price · Book", subtitle: "",
        items: items([
          { title: "Search", text: "Destination, dates and guests return priced rooms." },
          { title: "Price", text: "Confirm the final rate and policies before payment." },
          { title: "Book", text: "Instant confirmation with supplier reference." },
        ]),
      }),
      block("faq", {
        eyebrow: "FAQ", title: "Hotel API questions", subtitle: "",
        items: items([
          { question: "How many suppliers are behind the API?", answer: "Multiple bed banks and direct chain connections, mapped to one property ID." },
          { question: "Do you support package rates?", answer: "Yes. Package rates can be sold when bundled with a flight in the same booking." },
          { question: "How are cancellations handled?", answer: "Policies are normalized to a single format and cancellations are one API call." },
        ]),
      }),
      cta("Start selling hotels this week", "Sandbox keys today, live bookings as soon as you're ready."),
    ],
  },
  {
    id: "pg-gds", slug: "gds", title: "GDS", visible: true,
    seoDescription: "GDS content without a GDS contract.",
    hero: hero({
      eyebrow: "GDS connectivity", title: "GDS content.", highlight: "No GDS contract.",
      subtitle: "Get global distribution system fares through one REST API, with a sandbox and without certification, PCCs or long-term commitments.",
      orbitIcons: ["globe", "plane", "layers", "shield", "zap", "merge"], chips: ["No certification", "No PCC setup", "REST + JSON"],
    }),
    blocks: [
      block("logos", { title: "Content from the world's major distribution systems", items: ["Global GDS", "Published fares", "Private fares", "Corporate fares", "Branded fares", "Ancillaries"] }),
      block("compare", {
        eyebrow: "The difference", title: "Direct GDS vs. our API", subtitle: "", usLabel: "Our API", themLabel: "Direct GDS",
        rows: items([
          { label: "Time to first booking", us: "Days", them: "6–12 months" },
          { label: "Certification required", us: "no", them: "yes" },
          { label: "Protocol", us: "REST/JSON", them: "SOAP/EDIFACT" },
          { label: "Sandbox", us: "yes", them: "Limited" },
          { label: "Pricing", us: "Flat per booking", them: "Segment fees + minimums" },
          { label: "NDC and LCC in the same call", us: "yes", them: "no" },
        ]),
      }),
      block("features", {
        eyebrow: "What you get", title: "All the GDS power, none of the plumbing", subtitle: "", columns: "3",
        items: items([
          { icon: "code", title: "Modern API", text: "Clean REST endpoints and JSON instead of legacy terminal commands." },
          { icon: "ticket", title: "Ticketing included", text: "Issue, void and refund tickets through the same API." },
          { icon: "support", title: "Expert support", text: "Travel-tech engineers who know fare rules inside out." },
        ]),
      }),
      cta("Moving off a legacy GDS integration?", "We'll map your current endpoints and plan the migration with you."),
    ],
  },
  {
    id: "pg-ndc", slug: "ndc", title: "NDC", visible: true,
    seoDescription: "Airline-direct NDC offers through one API.",
    hero: hero({
      eyebrow: "NDC", title: "Airline-direct offers,", highlight: "without the integrations.",
      subtitle: "Access NDC content from leading airlines (richer bundles, continuous pricing and exclusive fares) alongside GDS and LCC in the same response.",
      art: "code", codeTitle: "NDC offer · normalized",
      code: json({ source: "NDC", offer_id: "OF-29X1", brand: "Comfort Plus", price: { total: 418.2, currency: "USD" }, includes: ["23kg bag", "Seat selection", "Free changes"], expires_in: 1200 }),
      chips: ["Exclusive fares", "Rich bundles", "One schema"],
    }),
    blocks: [
      block("richtext", {
        eyebrow: "What is NDC?", title: "The new standard for airline retailing",
        paragraphs: [
          "New Distribution Capability (NDC) is an XML standard that lets airlines sell rich offers directly to agencies: branded bundles, ancillaries and dynamic prices that legacy channels can't carry.",
          "Each airline implements NDC differently. We connect to them once, normalize their offers and give you a single schema shared with GDS and low-cost content.",
        ],
      }),
      block("features", {
        eyebrow: "Benefits", title: "Why sell NDC content", subtitle: "", columns: "4",
        items: items([
          { icon: "wallet", title: "Lower prices", text: "Fares unavailable in legacy channels." },
          { icon: "star", title: "Richer offers", text: "Bundles with bags, seats and flexibility." },
          { icon: "sparkles", title: "Better merchandising", text: "Images and descriptions for each fare brand." },
          { icon: "merge", title: "One integration", text: "Every NDC airline through the same endpoints." },
        ]),
      }),
      block("split", {
        eyebrow: "Normalized", title: "Different airlines, identical JSON", text: "Our normalization layer turns every airline's NDC dialect into the same offer object, so your UI code never branches per carrier.",
        bullets: ["Offer and order management", "Servicing: changes, cancellations, refunds", "Automatic fallback to GDS when NDC is unavailable"],
        codeTitle: "Order created", reverse: true,
        code: json({ order_id: "ORD-7713", status: "ticketed", passengers: 2, services: ["bag", "seat-14A", "seat-14B"] }),
      }),
      block("faq", {
        eyebrow: "FAQ", title: "NDC questions", subtitle: "",
        items: items([
          { question: "Do I need agreements with each airline?", answer: "No. We hold the connections; you integrate once with our API." },
          { question: "What happens if an NDC offer is unavailable?", answer: "We automatically fall back to GDS or LCC content for that route." },
        ]),
      }),
      cta("Add NDC content in days", "Get sandbox access with live NDC test offers."),
    ],
  },

  // ── Developers ────────────────────────────────────────────────────────
  {
    id: "pg-dev", slug: "developers", title: "Developer hub", visible: true,
    seoDescription: "Docs, quickstart, changelog and status.",
    hero: hero({
      eyebrow: "Developers", title: "Built by engineers,", highlight: "for engineers.",
      subtitle: "One REST API, one JSON schema, predictable errors and a sandbox that behaves like production.",
      primaryLabel: "Start the quickstart", primaryHref: "/developers/quickstart", secondaryLabel: "System status", secondaryHref: "/developers/status",
      art: "code", codeTitle: "curl",
      code: json({ request: "curl -X POST https://sandbox.api.example.com/v1/flight/search", headers: { Authorization: "Bearer sk_test_…" }, body: { from: "DAC", to: "KUL", date: "2026-11-02" } }),
      chips: ["OpenAPI 3.1", "SDK examples", "99.95% uptime"],
    }),
    blocks: [
      block("cards", {
        eyebrow: "Start here", title: "Everything you need to build", subtitle: "",
        items: items([
          { title: "Quickstart", icon: "rocket", href: "/developers/quickstart", label: "Start building", text: "Make your first search and booking in under an hour." },
          { title: "Changelog", icon: "trending", href: "/developers/changelog", label: "See releases", text: "New features, improvements and deprecations." },
          { title: "System status", icon: "zap", href: "/developers/status", label: "Check status", text: "Live health and uptime for every service." },
          { title: "Coverage", icon: "globe", href: "/coverage/flights", label: "Explore coverage", text: "Which content is available in which markets." },
          { title: "Talk to an engineer", icon: "support", href: "/contact", label: "Get in touch", text: "Real engineers, not a ticket queue." },
        ]),
      }),
      block("features", {
        eyebrow: "Developer experience", title: "Designed to be pleasant", subtitle: "", columns: "3",
        items: items([
          { icon: "code", title: "Consistent schema", text: "Same shapes, naming and pagination across all products." },
          { icon: "shield", title: "Idempotent bookings", text: "Safe retries with idempotency keys on every write." },
          { icon: "zap", title: "Webhooks", text: "Booking, ticketing and schedule-change events pushed to you." },
        ]),
      }),
    ],
  },
  {
    id: "pg-dev-quick", slug: "developers/quickstart", title: "Quickstart", visible: true,
    seoDescription: "From sandbox keys to your first booking.",
    hero: hero({
      eyebrow: "Quickstart", title: "Your first booking", highlight: "in under an hour.", art: "none",
      subtitle: "Four steps from sandbox keys to a confirmed test booking.", primaryLabel: "Get sandbox keys", secondaryLabel: "Developer hub", secondaryHref: "/developers",
    }),
    blocks: [
      block("steps", {
        eyebrow: "Overview", title: "Four steps", subtitle: "",
        items: items([
          { title: "Get keys", text: "Request access and receive sandbox credentials." },
          { title: "Search", text: "Call /v1/flight/search with a route and date." },
          { title: "Price", text: "Re-price the chosen offer to lock the fare." },
          { title: "Book", text: "Create the booking and receive a PNR." },
        ]),
      }),
      block("split", {
        eyebrow: "Step 1", title: "Authenticate", text: "Every request carries your secret key as a Bearer token. Sandbox keys start with sk_test_.",
        bullets: ["Keys are scoped per environment", "Rotate keys anytime from your dashboard"], codeTitle: "Headers", reverse: false,
        code: json({ Authorization: "Bearer sk_test_51Hx…", "Content-Type": "application/json", "Idempotency-Key": "a3f1-…" }),
      }),
      block("split", {
        eyebrow: "Step 2", title: "Search flights", text: "Send a route and date. Results include offers from GDS, NDC and low-cost carriers.",
        bullets: ["Results sorted by price by default", "Each offer has a short-lived offer_id"], codeTitle: "POST /v1/flight/search", reverse: true,
        code: json({ segments: [{ from: "DAC", to: "KUL", date: "2026-11-02" }], travelers: { adults: 1 }, cabin: "Economy" }),
      }),
      block("split", {
        eyebrow: "Step 3 & 4", title: "Price and book", text: "Re-price the offer, then book with traveler details. You'll get a PNR and booking ID back.",
        bullets: ["Price guarantees last 20 minutes", "Webhooks notify you when tickets are issued"], codeTitle: "POST /v1/flight/book", reverse: false,
        code: json({ offer_id: "OF-1192", travelers: [{ first_name: "Ayesha", last_name: "Rahman", dob: "1992-04-11" }], contact: { email: "ayesha@example.com" } }),
      }),
      cta("Ready for production?", "Switch your keys to live mode when your integration is approved."),
    ],
  },
  {
    id: "pg-dev-log", slug: "developers/changelog", title: "Changelog", visible: true,
    seoDescription: "New features, improvements and fixes.",
    hero: hero({ eyebrow: "Changelog", title: "What's new.", highlight: "", art: "none", subtitle: "Every release, newest first.", primaryLabel: "", secondaryLabel: "" }),
    blocks: [
      block("timeline", {
        eyebrow: "", title: "", subtitle: "",
        items: items([
          { date: "Oct 2026", version: "v1.18", tag: "New", title: "Unified NDC + LCC search", text: "Search airline-direct NDC offers and low-cost carriers in the same request as GDS content." },
          { date: "Sep 2026", version: "v1.17", tag: "New", title: "Travel eSIM API", text: "Sell data plans in 175+ countries with instant QR activation." },
          { date: "Aug 2026", version: "v1.16", tag: "Improved", title: "Faster hotel search", text: "Median hotel search latency reduced by 38%." },
          { date: "Jul 2026", version: "v1.15", tag: "Fixed", title: "Refund webhook retries", text: "Refund events now retry with exponential backoff for 24 hours." },
          { date: "Jun 2026", version: "v1.14", tag: "Deprecated", title: "Legacy /search/v0 endpoints", text: "v0 search endpoints will be removed on 31 Dec 2026. Migrate to /v1." },
        ]),
      }),
    ],
  },
  {
    id: "pg-dev-status", slug: "developers/status", title: "System status", visible: true,
    seoDescription: "Live health of every service.",
    hero: hero({ eyebrow: "Status", title: "System status.", highlight: "Live.", art: "none", subtitle: "Current health and uptime over the last 60 days for each service.", primaryLabel: "", secondaryLabel: "" }),
    blocks: [
      block("status", {
        eyebrow: "", title: "Services", subtitle: "",
        items: items([
          { name: "Flight search", status: "operational", uptime: 99.98 },
          { name: "Flight booking & ticketing", status: "operational", uptime: 99.96 },
          { name: "Hotel search", status: "operational", uptime: 99.97 },
          { name: "Hotel booking", status: "operational", uptime: 99.99 },
          { name: "Transfers & activities", status: "operational", uptime: 99.94 },
          { name: "Webhooks", status: "degraded", uptime: 99.71 },
          { name: "Sandbox", status: "operational", uptime: 99.9 },
        ]),
      }),
    ],
  },
];
