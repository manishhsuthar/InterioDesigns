import { FormEvent, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import InterioLogo from "@/components/ui/InterioLogo";

const steps = ["BHK Type", "Rooms To Design", "Package", "Get Quote"];

const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK+"];

const roomsByEstimateType: Record<string, string[]> = {
  "Full Home Interior": ["Living Room", "Kitchen", "Master Bedroom", "Wardrobe"],
  Kitchen: ["Modular Kitchen", "Utility Area", "Pantry"],
  Wardrobe: ["Master Wardrobe", "Kids Wardrobe", "Guest Wardrobe"],
};

const packageOptions = ["Essential", "Premium", "Luxury"];

const EstimateSurvey = () => {
  const [searchParams] = useSearchParams();
  const estimateType = searchParams.get("type") || "Full Home Interior";

  const [currentStep, setCurrentStep] = useState(0);
  const [bhkType, setBhkType] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const roomOptions = useMemo(() => {
    return roomsByEstimateType[estimateType] || roomsByEstimateType["Full Home Interior"];
  }, [estimateType]);

  const canProceed = useMemo(() => {
    if (currentStep === 0) return Boolean(bhkType);
    if (currentStep === 1) return rooms.length > 0;
    if (currentStep === 2) return Boolean(selectedPackage);
    if (currentStep === 3) return Boolean(fullName.trim() && phone.trim() && city.trim());
    return false;
  }, [currentStep, bhkType, rooms.length, selectedPackage, fullName, phone, city]);

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canProceed) return;

    alert(
      `Quote request submitted for ${estimateType}.\\nBHK: ${bhkType}\\nRooms: ${rooms.join(", ")}\\nPackage: ${selectedPackage}`,
    );
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
                        onChange={() => setBhkType(option)}
                        className="h-4 w-4"
                      />
                      <span className="text-base font-medium text-foreground">{option}</span>
                    </label>
                  ))}
                </div>
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
                disabled={!canProceed}
                className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                SUBMIT
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default EstimateSurvey;
