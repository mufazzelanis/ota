import { getContent } from "@/lib/content";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsAppWidget } from "@/components/site/whatsapp-widget";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const c = await getContent();
  const products = c.products
    .filter((p) => p.visible)
    .map(({ slug, name, icon, tone, short }) => ({ slug, name, icon, tone, short }));

  return (
    <>
      <Navbar brandName={c.settings.brandName} logoText={c.settings.logoText} ctaLabel={c.settings.ctaLabel} products={products} nav={c.navigation} />
      <main className="flex-1">{children}</main>
      <Footer c={c} />
      {c.settings.whatsappEnabled && c.settings.whatsapp && (
        <WhatsAppWidget
          number={c.settings.whatsapp}
          agent={c.settings.whatsappAgent}
          greeting={c.settings.whatsappGreeting}
          message={c.settings.whatsappMessage}
          logoText={c.settings.logoText}
        />
      )}
    </>
  );
}
