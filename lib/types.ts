export type Tone =
  | "brand"
  | "accent"
  | "rose"
  | "violet"
  | "sky"
  | "emerald"
  | "amber"
  | "indigo";

export type Theme = {
  preset: string;
  dark: string;
  brand: string;
  accent: string;
  accentInk: string;
};

export type Settings = {
  brandName: string;
  logoText: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  company: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  footerNote: string;
  ctaLabel: string;
  whatsappEnabled: boolean;
  whatsappAgent: string;
  whatsappGreeting: string;
  whatsappMessage: string;
};

export type Announcement = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  text: string;
  links: string[];
};

export type Hero = {
  badge: string;
  titleLines: string[];
  highlight: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  videoLabel: string;
  trustPoints: string[];
};

export type Stat = { id: string; value: number; suffix: string; prefix: string; label: string; visible: boolean };

export type PlaygroundItem = {
  id: string;
  label: string;
  icon: string;
  method: string;
  endpoint: string;
  request: string;
  response: string;
  latency: number;
  visible: boolean;
};

export type About = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type Benefit = { id: string; icon: string; title: string; text: string; visible: boolean };

export type Product = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  tone: Tone;
  short: string;
  description: string;
  features: string[];
  endpoints: string[];
  visible: boolean;
};

export type UseCase = { id: string; icon: string; tone: Tone; title: string; text: string; visible: boolean };

export type Reason = { id: string; icon: string; title: string; text: string; visible: boolean };

export type CompareRow = { id: string; label: string; us: string; them: string; visible: boolean };

export type Step = { id: string; title: string; text: string; visible: boolean };

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  visible: boolean;
};

export type Faq = { id: string; question: string; answer: string; visible: boolean };

export type Resource = { id: string; title: string; text: string; tag: string; visible: boolean };

export type Partner = { id: string; name: string; visible: boolean };

export type SectionHeading = { eyebrow: string; title: string; subtitle: string };

export type SectionId =
  | "hero"
  | "stats"
  | "announcement"
  | "partners"
  | "about"
  | "benefits"
  | "products"
  | "usecases"
  | "why"
  | "steps"
  | "testimonials"
  | "faq"
  | "resources"
  | "cta";

export type SectionConfig = { id: SectionId; label: string; visible: boolean };

export type Cta = {
  title: string;
  text: string;
  primary: string;
  secondary: string;
};

export type NavChild = { id: string; label: string; href: string; icon: string; description: string };

export type NavItem = {
  id: string;
  label: string;
  type: "link" | "dropdown" | "products";
  href: string;
  highlight: boolean;
  /** Dropdowns only: also list this menu as a footer column. Missing means true. */
  showInFooter?: boolean;
  badge: string;
  visible: boolean;
  children: NavChild[];
};

/** A page block: `type` picks the renderer, the remaining keys are its fields (see lib/blocks.ts). */
export type Block = { id: string; type: string; visible: boolean } & Record<string, unknown>;

export type PageHero = {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  art: "code" | "orbit" | "none";
  codeTitle: string;
  code: string;
  orbitIcons: string[];
  chips: string[];
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  seoDescription: string;
  visible: boolean;
  hero: PageHero;
  blocks: Block[];
};

export type Content = {
  theme: Theme;
  settings: Settings;
  announcement: Announcement;
  hero: Hero;
  stats: Stat[];
  playground: PlaygroundItem[];
  partners: Partner[];
  about: About;
  benefits: Benefit[];
  products: Product[];
  useCases: UseCase[];
  reasons: Reason[];
  compare: CompareRow[];
  steps: Step[];
  testimonials: Testimonial[];
  faqs: Faq[];
  resources: Resource[];
  headings: Record<
    "benefits" | "products" | "usecases" | "why" | "steps" | "testimonials" | "faq" | "resources" | "partners",
    SectionHeading
  >;
  cta: Cta;
  sections: SectionConfig[];
  navigation: NavItem[];
  pages: Page[];
};

export type ContentKey = keyof Content;

export type Role = {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  createdAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  passwordHash: string;
  active: boolean;
  // Bumped on password reset / deactivation to sign out existing sessions.
  sessionVersion: number;
  createdAt: string;
  lastLoginAt: string | null;
};

/** What the UI may see about a user: never the password hash. */
export type PublicUser = Omit<AdminUser, "passwordHash" | "sessionVersion">;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  roleColor: string;
  permissions: string[];
  isOwner: boolean;
};

export type Activity = {
  id: string;
  at: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  businessType: string;
  products: string[];
  message: string;
  createdAt: string;
  read: boolean;
};
