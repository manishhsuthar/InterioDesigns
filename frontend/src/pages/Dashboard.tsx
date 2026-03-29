import { FormEvent, useMemo, useState } from "react";
import { Heart, LayoutGrid, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import categoryResidential from "@/assets/category-residential.jpg";
import categoryCommercial from "@/assets/category-commercial.jpg";
import categoryOffice from "@/assets/category-office.jpg";
import categoryOutdoor from "@/assets/category-outdoor.jpg";
import featured1 from "@/assets/featured-1.jpg";
import featured2 from "@/assets/featured-2.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

type StoredUser = {
  name?: string;
  email?: string;
};

type CategoryId = "residential" | "commercial" | "office" | "outdoor";
type DashboardTab = "explore" | "profile" | "wishlist";

type CategoryCard = {
  id: CategoryId;
  title: string;
  cover: string;
};

type CatalogImage = {
  id: string;
  title: string;
  src: string;
};

const categoryCards: CategoryCard[] = [
  { id: "residential", title: "Residential", cover: categoryResidential },
  { id: "commercial", title: "Commercial", cover: categoryCommercial },
  { id: "office", title: "Office", cover: categoryOffice },
  { id: "outdoor", title: "Outdoor", cover: categoryOutdoor },
];

const imagesByCategory: Record<CategoryId, CatalogImage[]> = {
  residential: [
    { id: "residential-1", title: "Modern Living Room", src: gallery1 },
    { id: "residential-2", title: "Open Kitchen and Dining", src: gallery2 },
    { id: "residential-3", title: "Scandinavian Bedroom", src: gallery4 },
    { id: "residential-4", title: "Luxury Ambient Lounge", src: gallery5 },
    { id: "residential-5", title: "Featured Residence One", src: featured1 },
  ],
  commercial: [
    { id: "commercial-1", title: "Client Lounge", src: gallery3 },
    { id: "commercial-2", title: "Contemporary Dining Space", src: gallery6 },
    { id: "commercial-3", title: "Signature Commercial Concept", src: featured2 },
  ],
  office: [
    { id: "office-1", title: "Focused Work Bay", src: gallery3 },
    { id: "office-2", title: "Collaborative Meeting Area", src: gallery2 },
    { id: "office-3", title: "Executive Office", src: featured1 },
  ],
  outdoor: [
    { id: "outdoor-1", title: "Open Patio Concept", src: categoryOutdoor },
    { id: "outdoor-2", title: "Outdoor Seating Retreat", src: gallery6 },
    { id: "outdoor-3", title: "Landscape Lighting Ambience", src: featured2 },
  ],
};

function parseStoredJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<StoredUser | null>(() => {
    const parsed = parseStoredJson<StoredUser>(localStorage.getItem("interio_user"));
    if (!parsed) localStorage.removeItem("interio_user");
    return parsed;
  });

  const [activeTab, setActiveTab] = useState<DashboardTab>("explore");
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const parsed = parseStoredJson<string[]>(localStorage.getItem("interio_wishlist_catalogs"));
    if (!parsed || !Array.isArray(parsed)) return [];
    return parsed;
  });

  const [profileName, setProfileName] = useState(user?.name ?? "");
  const [profileEmail, setProfileEmail] = useState(user?.email ?? "");

  const allImages = useMemo(
    () => Object.values(imagesByCategory).flat(),
    []
  );

  const wishlistImages = useMemo(
    () => allImages.filter((image) => wishlistIds.includes(image.id)),
    [allImages, wishlistIds]
  );

  const persistWishlist = (nextWishlist: string[]) => {
    setWishlistIds(nextWishlist);
    localStorage.setItem("interio_wishlist_catalogs", JSON.stringify(nextWishlist));
  };

  const toggleWishlist = (imageId: string) => {
    const exists = wishlistIds.includes(imageId);
    const next = exists ? wishlistIds.filter((id) => id !== imageId) : [...wishlistIds, imageId];
    persistWishlist(next);
    toast({
      title: exists ? "Removed from wishlist" : "Added to wishlist",
      description: exists ? "Image removed from your wishlist." : "Image saved to your wishlist.",
    });
  };

  const handleProfileSave = (event: FormEvent) => {
    event.preventDefault();
    const nextUser = { name: profileName.trim(), email: profileEmail.trim() };
    setUser(nextUser);
    localStorage.setItem("interio_user", JSON.stringify(nextUser));
    toast({
      title: "Profile updated",
      description: "Your profile details were saved.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("interio_user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-form rounded-3xl p-8 text-center max-w-md w-full">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Dashboard</h1>
          <p className="text-foreground/70 mb-6">Please sign in to access your dashboard.</p>
          <Button asChild className="rounded-3xl bg-terracotta hover:bg-terracotta/90 text-terracotta-foreground">
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="glass-form rounded-3xl p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-foreground/60">Dashboard</p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Welcome{user.name ? `, ${user.name}` : ""}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-3xl bg-foreground text-background hover:bg-foreground/90">
                <Link to="/">Go to Home</Link>
              </Button>
              <Button type="button" variant="outline" onClick={handleLogout} className="rounded-3xl">
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("explore")}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                activeTab === "explore"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Explore
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                activeTab === "profile"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground"
              }`}
            >
              <UserRound className="h-4 w-4" />
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                activeTab === "wishlist"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground"
              }`}
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </button>
          </div>
        </section>

        {activeTab === "explore" && (
          <section>
            <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="mb-5 font-serif text-2xl font-semibold text-foreground">Explore Catalogs</h2>
              <div className="grid grid-cols-2 justify-items-center gap-4 md:grid-cols-4">
                {categoryCards.map((category) => (
                  <Link
                    key={category.id}
                    to={`/dashboard/catalog/${category.id}`}
                    className="w-full max-w-[210px] overflow-hidden rounded-2xl border border-border text-left transition-all hover:border-primary/60"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={category.cover}
                        alt={category.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-sm font-semibold text-foreground">{category.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === "profile" && (
          <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">Profile</h2>
            <form onSubmit={handleProfileSave} className="max-w-xl space-y-4">
              <input
                type="text"
                value={profileName}
                onChange={(event) => setProfileName(event.target.value)}
                placeholder="Full name"
                className="input-cream w-full"
                required
              />
              <input
                type="email"
                value={profileEmail}
                onChange={(event) => setProfileEmail(event.target.value)}
                placeholder="Email address"
                className="input-cream w-full"
                required
              />
              <Button type="submit" className="rounded-3xl bg-terracotta hover:bg-terracotta/90 text-terracotta-foreground">
                Save Profile
              </Button>
            </form>
          </section>
        )}

        {activeTab === "wishlist" && (
          <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold text-foreground">Wishlist</h2>
              <p className="text-sm text-muted-foreground">{wishlistImages.length} saved</p>
            </div>

            {wishlistImages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">
                <p className="text-muted-foreground">
                  No images saved yet. Open Explore and tap the heart icon on any catalog image.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {wishlistImages.map((image) => (
                  <article key={image.id} className="overflow-hidden rounded-2xl border border-border bg-background">
                    <div className="relative aspect-square overflow-hidden">
                      <img src={image.src} alt={image.title} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => toggleWishlist(image.id)}
                        className="absolute right-3 top-3 rounded-full bg-card/80 p-2 text-rose-500 backdrop-blur-sm"
                        aria-label="Remove from wishlist"
                      >
                        <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{image.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
