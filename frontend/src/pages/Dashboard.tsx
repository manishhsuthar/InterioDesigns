import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type StoredUser = {
  name?: string;
  email?: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const userRaw = localStorage.getItem("interio_user");
  let user: StoredUser | null = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as StoredUser;
    } catch {
      localStorage.removeItem("interio_user");
    }
  }

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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="glass-form rounded-3xl p-8 md:p-10 max-w-xl w-full text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Dashboard</h1>
        <p className="text-foreground/80 mb-2">
          Welcome{user.name ? `, ${user.name}` : ""}.
        </p>
        {user.email ? <p className="text-foreground/60 mb-8">{user.email}</p> : null}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-3xl bg-foreground text-background hover:bg-foreground/90">
            <Link to="/">Go to Home</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="rounded-3xl"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
