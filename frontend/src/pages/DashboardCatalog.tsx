import { useState } from "react";
import { Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
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

type CategoryId = "residential" | "commercial" | "office" | "outdoor";

type CatalogImage = {
  id: string;
  title: string;
  src: string;
};

const imagesByCategory: Record<CategoryId, CatalogImage[]> = {
  residential: [
    { id: "residential-1", title: "Modern Living Room", src: gallery1 },
    { id: "residential-2", title: "Open Kitchen and Dining", src: gallery2 },
    { id: "residential-3", title: "Scandinavian Bedroom", src: gallery4 },
    { id: "residential-4", title: "Luxury Ambient Lounge", src: gallery5 },
    { id: "residential-5", title: "Featured Residence One", src: featured1 },
    { id: "residential-6", title: "Residential Collection Cover", src: categoryResidential },
  ],
  commercial: [
    { id: "commercial-1", title: "Client Lounge", src: gallery3 },
    { id: "commercial-2", title: "Contemporary Dining Space", src: gallery6 },
    { id: "commercial-3", title: "Signature Commercial Concept", src: featured2 },
    { id: "commercial-4", title: "Commercial Collection Cover", src: categoryCommercial },
  ],
  office: [
    { id: "office-1", title: "Focused Work Bay", src: gallery3 },
    { id: "office-2", title: "Collaborative Meeting Area", src: gallery2 },
    { id: "office-3", title: "Executive Office", src: featured1 },
    { id: "office-4", title: "Office Collection Cover", src: categoryOffice },
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

const DashboardCatalog = () => {
  const { category } = useParams<{ category: string }>();
  const normalized = (category ?? "").toLowerCase() as CategoryId;
  const selectedCategory: CategoryId = normalized in imagesByCategory ? normalized : "residential";
  const images = imagesByCategory[selectedCategory];

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const parsed = parseStoredJson<string[]>(localStorage.getItem("interio_wishlist_catalogs"));
    if (!parsed || !Array.isArray(parsed)) return [];
    return parsed;
  });

  const toggleWishlist = (imageId: string) => {
    const exists = wishlistIds.includes(imageId);
    const next = exists ? wishlistIds.filter((id) => id !== imageId) : [...wishlistIds, imageId];
    setWishlistIds(next);
    localStorage.setItem("interio_wishlist_catalogs", JSON.stringify(next));
    toast({
      title: exists ? "Removed from wishlist" : "Added to wishlist",
      description: exists ? "Image removed from your wishlist." : "Image saved to your wishlist.",
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="glass-form rounded-3xl p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-foreground/60">Category Catalog</p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {selectedCategory[0].toUpperCase() + selectedCategory.slice(1)} Images
              </h1>
            </div>
            <Button asChild className="rounded-3xl bg-foreground text-background hover:bg-foreground/90">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-foreground">All Catalog Images</h2>
            <p className="text-sm text-muted-foreground">{images.length} images</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => {
              const liked = wishlistIds.includes(image.id);
              return (
                <article key={image.id} className="overflow-hidden rounded-2xl border border-border bg-background">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={image.src} alt={image.title} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => toggleWishlist(image.id)}
                      className="absolute right-3 top-3 rounded-full bg-card/80 p-2 text-foreground backdrop-blur-sm"
                      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{image.title}</h3>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardCatalog;
