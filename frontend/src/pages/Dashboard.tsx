import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/api";
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

type CatalogItem = {
  id: string;
  title: string;
  category: string;
  image: string;
};

const allCatalogs: CatalogItem[] = [
  { id: "residential", title: "Residential", category: "Category", image: categoryResidential },
  { id: "commercial", title: "Commercial", category: "Category", image: categoryCommercial },
  { id: "office", title: "Office", category: "Category", image: categoryOffice },
  { id: "outdoor", title: "Outdoor", category: "Category", image: categoryOutdoor },
  { id: "featured-1", title: "Featured One", category: "Featured", image: featured1 },
  { id: "featured-2", title: "Featured Two", category: "Featured", image: featured2 },
  { id: "gallery-1", title: "Modern Living Room", category: "Gallery", image: gallery1 },
  { id: "gallery-2", title: "Open Kitchen & Dining", category: "Gallery", image: gallery2 },
  { id: "gallery-3", title: "Accent Seating Space", category: "Gallery", image: gallery3 },
  { id: "gallery-4", title: "Scandinavian Bedroom", category: "Gallery", image: gallery4 },
  { id: "gallery-5", title: "Luxury Ambient Living", category: "Gallery", image: gallery5 },
  { id: "gallery-6", title: "Contemporary Dining", category: "Gallery", image: gallery6 },
];

const estimateOptions = [
  {
    title: "Full Home Interior",
    description: "Get a complete estimate for your entire home interior.",
  },
  {
    title: "Kitchen",
    description: "Estimate modular kitchen and utility area costs.",
  },
  {
    title: "Wardrobe",
    description: "Estimate custom wardrobe design and execution costs.",
  },
];

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
    if (!parsed) {
      localStorage.removeItem("interio_user");
    }
    return parsed;
  });

  const [profileName, setProfileName] = useState(user?.name ?? "");
  const [profileEmail, setProfileEmail] = useState(user?.email ?? "");
  const [consultName, setConsultName] = useState(user?.name ?? "");
  const [consultEmail, setConsultEmail] = useState(user?.email ?? "");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultDate, setConsultDate] = useState("");
  const [consultationMode, setConsultationMode] = useState("Virtual");
  const [consultNotes, setConsultNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const parsed = parseStoredJson<string[]>(localStorage.getItem("interio_wishlist_catalogs"));
    if (!parsed || !Array.isArray(parsed)) return [];
    return parsed;
  });

  const wishlistCatalogs = useMemo(
    () => allCatalogs.filter((item) => wishlistIds.includes(item.id)),
    [wishlistIds]
  );

  const persistWishlist = (nextWishlist: string[]) => {
    setWishlistIds(nextWishlist);
    localStorage.setItem("interio_wishlist_catalogs", JSON.stringify(nextWishlist));
  };

  const toggleWishlist = (catalogId: string) => {
    const exists = wishlistIds.includes(catalogId);
    const next = exists ? wishlistIds.filter((id) => id !== catalogId) : [...wishlistIds, catalogId];
    persistWishlist(next);
    toast({
      title: exists ? "Removed from wishlist" : "Added to wishlist",
      description: exists
        ? "Catalog image removed from your wishlist."
        : "Catalog image saved to your wishlist.",
    });
  };

  const handleProfileSave = (event: FormEvent) => {
    event.preventDefault();
    const nextUser = { name: profileName.trim(), email: profileEmail.trim() };
    setUser(nextUser);
    localStorage.setItem("interio_user", JSON.stringify(nextUser));
    toast({
      title: "Profile updated",
      description: "Your dashboard profile details have been saved.",
    });
  };

  const handleBookConsultation = async (event: FormEvent) => {
    event.preventDefault();
    if (!consultName.trim() || !consultEmail.trim() || !consultPhone.trim() || !consultDate) {
      toast({
        title: "Missing details",
        description: "Please fill all consultation details before booking.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const message = [
        "Consultation Booking Request",
        `Mode: ${consultationMode}`,
        `Phone: ${consultPhone.trim()}`,
        `Preferred Date: ${consultDate}`,
        `Notes: ${consultNotes.trim() || "N/A"}`,
      ].join(" | ");

      const response = await fetch(apiUrl("/contact/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: consultName.trim(),
          email: consultEmail.trim(),
          message,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to book consultation");
      }

      toast({
        title: "Consultation booked",
        description: "Your request has been sent. Our team will contact you soon.",
      });
      setConsultPhone("");
      setConsultDate("");
      setConsultNotes("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to book consultation right now.";
      toast({
        title: "Booking failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-foreground/60">Dashboard</p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Welcome{user.name ? `, ${user.name}` : ""}
              </h1>
              <p className="mt-2 text-foreground/70">
                Explore catalogs, calculate estimates, manage wishlist, and book consultations.
              </p>
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
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Explore Catalogs</h2>
            <p className="text-sm text-muted-foreground">{allCatalogs.length} items</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {allCatalogs.map((catalog) => {
              const wishlisted = wishlistIds.includes(catalog.id);
              return (
                <article key={catalog.id} className="overflow-hidden rounded-2xl border border-border bg-background">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={catalog.image}
                      alt={catalog.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{catalog.category}</p>
                    <h3 className="line-clamp-1 font-semibold text-foreground">{catalog.title}</h3>
                    <Button
                      type="button"
                      onClick={() => toggleWishlist(catalog.id)}
                      className={`w-full rounded-2xl ${
                        wishlisted
                          ? "bg-primary/15 text-primary hover:bg-primary/20"
                          : "bg-terracotta text-terracotta-foreground hover:bg-terracotta/90"
                      }`}
                    >
                      {wishlisted ? "Saved in Wishlist" : "Save to Wishlist"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="mb-5 font-serif text-2xl font-semibold text-foreground">Estimate Feature</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {estimateOptions.map((option) => (
              <article key={option.title} className="rounded-2xl border border-border bg-background p-5">
                <h3 className="font-serif text-xl font-semibold text-foreground">{option.title}</h3>
                <p className="mt-2 min-h-[48px] text-sm text-muted-foreground">{option.description}</p>
                <Button
                  asChild
                  className="mt-4 w-full rounded-2xl bg-foreground text-background hover:bg-foreground/90"
                >
                  <Link to={`/estimate-survey?type=${encodeURIComponent(option.title)}`}>
                    Calculate Estimate
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">Profile</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
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
              <Button type="submit" className="w-full rounded-3xl bg-terracotta hover:bg-terracotta/90 text-terracotta-foreground">
                Save Profile
              </Button>
            </form>
          </article>

          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">Book Consultation</h2>
            <form onSubmit={handleBookConsultation} className="space-y-4">
              <input
                type="text"
                value={consultName}
                onChange={(event) => setConsultName(event.target.value)}
                placeholder="Full name"
                className="input-cream w-full"
                required
              />
              <input
                type="email"
                value={consultEmail}
                onChange={(event) => setConsultEmail(event.target.value)}
                placeholder="Email address"
                className="input-cream w-full"
                required
              />
              <input
                type="tel"
                value={consultPhone}
                onChange={(event) => setConsultPhone(event.target.value)}
                placeholder="Phone number"
                className="input-cream w-full"
                required
              />
              <input
                type="date"
                value={consultDate}
                onChange={(event) => setConsultDate(event.target.value)}
                className="input-cream w-full"
                required
              />
              <select
                value={consultationMode}
                onChange={(event) => setConsultationMode(event.target.value)}
                className="input-cream w-full"
              >
                <option>Virtual</option>
                <option>In-Person</option>
                <option>Phone Call</option>
              </select>
              <textarea
                value={consultNotes}
                onChange={(event) => setConsultNotes(event.target.value)}
                placeholder="Share project details"
                className="input-cream min-h-[90px] w-full"
              />
              <Button
                type="submit"
                disabled={isBooking}
                className="w-full rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isBooking ? "Booking..." : "Book Consultation"}
              </Button>
            </form>
          </article>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Wishlist</h2>
            <p className="text-sm text-muted-foreground">{wishlistCatalogs.length} saved</p>
          </div>

          {wishlistCatalogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">
              <p className="text-muted-foreground">
                No catalog images saved yet. Add items from Explore Catalogs above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {wishlistCatalogs.map((catalog) => (
                <article key={catalog.id} className="overflow-hidden rounded-2xl border border-border bg-background">
                  <div className="aspect-square overflow-hidden">
                    <img src={catalog.image} alt={catalog.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-2 p-3">
                    <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{catalog.title}</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => toggleWishlist(catalog.id)}
                      className="w-full rounded-2xl"
                    >
                      Remove
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
