import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="divider-gold text-[11px] tracking-luxe uppercase mb-6">Lost in the details</p>
        <h1 className="font-display text-7xl text-brand">404</h1>
        <h2 className="mt-4 font-display text-2xl">Page not found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has wandered off the guest list.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 text-xs tracking-[0.25em] uppercase border-2 border-brand rounded-full text-brand hover:bg-brand hover:text-primary-foreground transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Coco Cabana — Luxury Event Planning, Decor & Rentals" },
      { name: "description", content: "Coco Cabana designs unforgettable celebrations through bespoke event planning, luxe decor, and premium event rentals." },
      { name: "author", content: "Coco Cabana" },
      { property: "og:title", content: "Coco Cabana — Luxury Event Planning, Decor & Rentals" },
      { property: "og:description", content: "Coco Cabana designs unforgettable celebrations through bespoke event planning, luxe decor, and premium event rentals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Coco Cabana — Luxury Event Planning, Decor & Rentals" },
      { name: "twitter:description", content: "Coco Cabana designs unforgettable celebrations through bespoke event planning, luxe decor, and premium event rentals." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2d65031-e08b-4fd0-9427-34c116a4f410/id-preview-cfaf0904--c0cebeb6-62bc-4f86-8e13-003af30ffaf2.lovable.app-1777480669206.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2d65031-e08b-4fd0-9427-34c116a4f410/id-preview-cfaf0904--c0cebeb6-62bc-4f86-8e13-003af30ffaf2.lovable.app-1777480669206.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
