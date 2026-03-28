import { FormEvent, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import InterioLogo from "@/components/ui/InterioLogo";
import { toast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/api";

const steps = ["BHK Type", "Rooms To Design", "Package", "Get Quote"];

const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK+"];
const bhkToStandardSqftMap: Record<string, number> = {
  "1 BHK": 400,
  "2 BHK": 800,
  "3 BHK": 1200,
  "4 BHK": 1800,
  "5 BHK+": 2500,
};

const roomsByEstimateType: Record<string, string[]> = {
  "Full Home Interior": ["Living Room", "Kitchen", "Master Bedroom", "Wardrobe"],
  Kitchen: ["Modular Kitchen", "Utility Area", "Pantry"],
  Wardrobe: ["Master Wardrobe", "Kids Wardrobe", "Guest Wardrobe"],
};

const packageOptions = ["Essential", "Premium", "Luxury"];
const packageTierMap: Record<string, "basic" | "standard" | "premium"> = {
  Essential: "basic",
  Premium: "standard",
  Luxury: "premium",
};
const addOnOptions = [
  { id: "false_ceiling", label: "False Ceiling" },
  { id: "lighting", label: "Lighting Upgrade" },
  { id: "smart_home", label: "Smart Home Features" },
];

type SurveyQuoteResult = {
  bhk_type: string;
  estimate_type: string;
  package_selected: string;
  package_applied: string;
  base_cost: number;
  rooms_cost: number;
  add_ons_cost: number;
  subtotal_before_package: number;
  package_multiplier: number;
  package_impact_amount: number;
  package_adjusted_total: number;
  discount_pct: number;
  discount_amount: number;
  estimated_total: number;
  room_line_items: { name: string; cost: number }[];
  add_on_line_items: { name: string; cost: number }[];
  applied_rules: string[];
  disclaimer: string;
};

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

const EstimateSurvey = () => {
  const [searchParams] = useSearchParams();
  const estimateType = searchParams.get("type") || "Full Home Interior";

  const [currentStep, setCurrentStep] = useState(0);
  const [bhkType, setBhkType] = useState("");
  const [sqftMode, setSqftMode] = useState<"standard" | "custom">("standard");
  const [customSqft, setCustomSqft] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteResult, setQuoteResult] = useState<SurveyQuoteResult | null>(null);

  const roomOptions = useMemo(() => {
    return roomsByEstimateType[estimateType] || roomsByEstimateType["Full Home Interior"];
  }, [estimateType]);

  const canProceed = useMemo(() => {
    if (currentStep === 0) {
      if (!bhkType) return false;
      if (sqftMode === "custom") {
        const value = Number(customSqft);
        return Number.isFinite(value) && value > 0;
      }
      return true;
    }
    if (currentStep === 1) return rooms.length > 0;
    if (currentStep === 2) return Boolean(selectedPackage);
    if (currentStep === 3) return Boolean(fullName.trim() && phone.trim() && city.trim());
    return false;
  }, [currentStep, bhkType, sqftMode, customSqft, rooms.length, selectedPackage, fullName, phone, city]);

  const toggleRoom = (room: string) => {
    setRooms((prev) => (prev.includes(room) ? prev.filter((item) => item !== room) : [...prev, room]));
  };

  const handleNext = () => {
    if (!canProceed) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const toggleAddOn = (addOnId: string) => {
    setAddOns((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]));
  };

  const resetForm = () => {
    setCurrentStep(0);
    setBhkType("");
    setSqftMode("standard");
    setCustomSqft("");
    setRooms([]);
    setSelectedPackage("");
    setAddOns([]);
    setFullName("");
    setPhone("");
    setCity("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canProceed) return;
    setIsSubmitting(true);
    try {
      const standardSqft = bhkToStandardSqftMap[bhkType] ?? 800;
      const areaSqft = sqftMode === "custom" ? Number(customSqft) || standardSqft : standardSqft;

      const payload = {
        name: fullName.trim(),
        email: "",
        property_type: "residential",
        project_type: "new",
        area_sqft: areaSqft,
        room_count: rooms.length,
        package_tier: packageTierMap[selectedPackage] ?? "basic",
        city: city.trim(),
        selected_furniture: [],
        selected_renovations: [],
        add_ons: addOns,
        request_source: "estimate-survey",
        estimate_type: estimateType,
        bhk_type: bhkType,
        sqft_mode: sqftMode,
        selected_rooms: rooms,
        phone: phone.trim(),
      };

      const response = await fetch(apiUrl("/estimate/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit estimate request");
      }

      setQuoteResult(data.result);
      toast({
        title: "Quote generated",
        description: "Your estimate is ready with a detailed cost breakdown.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit estimate request right now.";
      toast({
        title: "Submission failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-card/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link to="/">
            <InterioLogo />
          </Link>
          <p className="text-sm font-semibold text-muted-foreground">
            {currentStep + 1}/{steps.length}
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-4 gap-3 px-6 pb-4 md:px-10">
          {steps.map((step, index) => {
            const active = index <= currentStep;
            return (
              <div key={step} className="flex flex-col items-center gap-2 text-center">
                <span
                  className={`h-4 w-4 rounded-full border ${
                    active ? "border-primary bg-primary" : "border-border bg-background"
                  }`}
                />
                <p className={`text-[11px] uppercase tracking-wide ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      </header>

      <main className="px-4 py-8 md:px-8">
        {quoteResult ? (
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-6 md:px-10">
              <p className="text-sm font-medium text-primary">Quote Summary</p>
              <h1 className="mt-1 text-3xl font-bold text-foreground">{formatINR(quoteResult.estimated_total)}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {quoteResult.estimate_type} • {quoteResult.bhk_type} • {quoteResult.package_applied}
              </p>
            </div>

            <div className="space-y-6 px-6 py-6 md:px-10">
              <div className="space-y-2 rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Base Cost</span>
                  <span className="font-semibold">{formatINR(quoteResult.base_cost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Rooms Cost</span>
                  <span className="font-semibold">{formatINR(quoteResult.rooms_cost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Add-ons Cost</span>
                  <span className="font-semibold">{formatINR(quoteResult.add_ons_cost)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatINR(quoteResult.subtotal_before_package)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Package Impact ({quoteResult.package_multiplier}x)</span>
                  <span className="font-semibold">+{formatINR(quoteResult.package_impact_amount)}</span>
                </div>
                {quoteResult.discount_amount > 0 && (
                  <div className="flex items-center justify-between text-sm text-green-700">
                    <span>Discount ({Math.round(quoteResult.discount_pct * 100)}%)</span>
                    <span className="font-semibold">-{formatINR(quoteResult.discount_amount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>Estimated Total</span>
                  <span>{formatINR(quoteResult.estimated_total)}</span>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-lg font-semibold text-foreground">Rooms Breakdown</h2>
                <div className="space-y-2">
                  {quoteResult.room_line_items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2 text-sm">
                      <span>{item.name}</span>
                      <span className="font-semibold">{formatINR(item.cost)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {quoteResult.add_on_line_items.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-semibold text-foreground">Add-ons Breakdown</h2>
                  <div className="space-y-2">
                    {quoteResult.add_on_line_items.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2 text-sm">
                        <span>{item.name.replaceAll("_", " ")}</span>
                        <span className="font-semibold">{formatINR(item.cost)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {quoteResult.applied_rules.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-semibold text-foreground">Applied Rules</h2>
                  <div className="space-y-2">
                    {quoteResult.applied_rules.map((rule) => (
                      <p key={rule} className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
                        {rule}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">{quoteResult.disclaimer}</p>
            </div>

            <div className="flex justify-end border-t border-border px-6 py-5 md:px-10">
              <button
                type="button"
                onClick={() => {
                  setQuoteResult(null);
                  resetForm();
                }}
                className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
              >
                NEW ESTIMATE
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex min-h-[65vh] w-full max-w-2xl flex-col rounded-3xl border border-border bg-card shadow-sm"
          >
            <div className="flex-1 px-6 py-8 md:px-10 md:py-10">
              <p className="mb-2 text-sm font-medium text-primary">Estimate: {estimateType}</p>

              {currentStep === 0 && (
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-foreground">Select your BHK type</h1>
                  <p className="mb-6 text-muted-foreground">Choose the home size to continue your estimate.</p>
                  <div className="space-y-3">
                    {bhkOptions.map((option) => (
                      <label
                        key={option}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-4"
                      >
                        <input
                          type="radio"
                          name="bhk"
                          value={option}
                          checked={bhkType === option}
                          onChange={() => {
                            setBhkType(option);
                            setSqftMode("standard");
                            setCustomSqft("");
                          }}
                          className="h-4 w-4"
                        />
                        <span className="text-base font-medium text-foreground">{option}</span>
                      </label>
                    ))}
                  </div>

                  {bhkType && (
                    <div className="mt-6 rounded-xl border border-border bg-background p-4">
                      <p className="mb-3 text-sm font-semibold text-foreground">Select sqft option</p>
                      <div className="space-y-3">
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-3">
                          <input
                            type="radio"
                            name="sqftMode"
                            checked={sqftMode === "standard"}
                            onChange={() => setSqftMode("standard")}
                            className="h-4 w-4"
                          />
                          <span className="text-sm text-foreground">
                            Standard ({bhkType} = {bhkToStandardSqftMap[bhkType]} sq.ft)
                          </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-3">
                          <input
                            type="radio"
                            name="sqftMode"
                            checked={sqftMode === "custom"}
                            onChange={() => setSqftMode("custom")}
                            className="h-4 w-4"
                          />
                          <span className="text-sm text-foreground">Custom</span>
                        </label>

                        {sqftMode === "custom" && (
                          <input
                            type="number"
                            min={1}
                            value={customSqft}
                            onChange={(e) => setCustomSqft(e.target.value)}
                            placeholder="Enter custom sqft"
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-foreground">Rooms to design</h1>
                  <p className="mb-6 text-muted-foreground">Pick all rooms you want us to include in the estimate.</p>
                  <div className="space-y-3">
                    {roomOptions.map((room) => (
                      <label
                        key={room}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-4"
                      >
                        <input
                          type="checkbox"
                          checked={rooms.includes(room)}
                          onChange={() => toggleRoom(room)}
                          className="h-4 w-4"
                        />
                        <span className="text-base font-medium text-foreground">{room}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-foreground">Choose package</h1>
                  <p className="mb-6 text-muted-foreground">Select a package that fits your style and budget.</p>
                  <div className="space-y-3">
                    {packageOptions.map((option) => (
                      <label
                        key={option}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-4"
                      >
                        <input
                          type="radio"
                          name="package"
                          value={option}
                          checked={selectedPackage === option}
                          onChange={() => setSelectedPackage(option)}
                          className="h-4 w-4"
                        />
                        <span className="text-base font-medium text-foreground">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-foreground">Get quote</h1>
                  <p className="mb-6 text-muted-foreground">Share your details and we will contact you with estimate options.</p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                    />
                  </div>

                  <div className="mt-6">
                    <h2 className="mb-3 text-base font-semibold text-foreground">Optional Add-ons</h2>
                    <div className="space-y-3">
                      {addOnOptions.map((addOn) => (
                        <label
                          key={addOn.id}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"
                        >
                          <input
                            type="checkbox"
                            checked={addOns.includes(addOn.id)}
                            onChange={() => toggleAddOn(addOn.id)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-medium text-foreground">{addOn.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border px-6 py-5 md:px-10">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="text-sm font-semibold text-primary disabled:opacity-40"
              >
                BACK
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  NEXT
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed || isSubmitting}
                  className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                </button>
              )}
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default EstimateSurvey;
