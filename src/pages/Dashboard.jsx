
import { useState } from "react";
import {
  Sparkles,
  Shirt,
  ArrowRight,
  Sun,
  Briefcase,
  PartyPopper,
  Coffee,
  Plus,
  Heart
} from "lucide-react";

function Dashboard() {
  const [occasion, setOccasion] = useState("Casual");

  const occasions = [
    { name: "Casual", icon: Coffee },
    { name: "College", icon: Shirt },
    { name: "Office", icon: Briefcase },
    { name: "Party", icon: PartyPopper }
  ];

  const looks = {
    Casual: {
      title: "Relaxed Everyday Look",
      description: "A comfortable outfit for your everyday activities.",
      top: "White Cotton T-Shirt",
      bottom: "Blue Denim Jeans",
      shoes: "White Sneakers"
    },
    College: {
      title: "Smart College Look",
      description: "A stylish and comfortable look for college.",
      top: "Pastel Shirt",
      bottom: "Black Straight Pants",
      shoes: "Casual Sneakers"
    },
    Office: {
      title: "Professional Office Look",
      description: "A clean and confident professional outfit.",
      top: "Formal Light Blue Shirt",
      bottom: "Black Formal Trousers",
      shoes: "Formal Shoes"
    },
    Party: {
      title: "Party Ready Look",
      description: "A fashionable look for your special occasions.",
      top: "Black Stylish Top",
      bottom: "Beige Trousers",
      shoes: "Fashion Sneakers"
    }
  };

  const currentLook = looks[occasion];

  return (
    <div className="dashboard">

      <header className="top-header">
        <div>
          <p className="welcome-label">WELCOME TO JUSTGO</p>
          <h1>Find Your Perfect Style ✨</h1>
          <p className="header-description">
            Discover outfits that match your personality.
          </p>
        </div>

        <div className="header-profile">
          <div className="profile-avatar">G</div>
          <div>
            <h4>Welcome Back!</h4>
            <span>Style Explorer</span>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">
            <Sparkles size={15} /> YOUR PERSONAL STYLIST
          </span>

          <h2>
            Dress Better.
            <br />
            Feel Confident.
          </h2>

          <p>
            Organize your wardrobe and discover your next
            favourite outfit with JustGo.
          </p>

          <button
            className="hero-button"
            onClick={() => {
              window.location.href = "/recommendations";
            }}
          >
            Explore Styles <ArrowRight size={18} />
          </button>
        </div>

        <div className="hero-decoration">
          <div className="fashion-circle">
            <Shirt size={100} strokeWidth={1} />
          </div>
          <Sparkles className="hero-sparkle" size={30} />
          <Heart className="hero-heart" size={27} />
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <Shirt size={22} />
          </div>
          <div>
            <h3>0</h3>
            <p>Wardrobe Items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pink">
            <Sparkles size={22} />
          </div>
          <div>
            <h3>0</h3>
            <p>Outfits Created</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Heart size={22} />
          </div>
          <div>
            <h3>0</h3>
            <p>Saved Looks</p>
          </div>
        </div>
      </section>

      <section className="occasion-section">
        <div className="section-heading">
          <div>
            <h2>Choose Your Occasion</h2>
            <p>What are you dressing up for today?</p>
          </div>
          <Sun size={25} />
        </div>

        <div className="occasion-grid">
          {occasions.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={
                  occasion === item.name
                    ? "occasion-card selected"
                    : "occasion-card"
                }
                onClick={() => setOccasion(item.name)}
              >
                <Icon size={24} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="recommendation-section">
        <div className="section-heading">
          <div>
            <h2>Today's Style Suggestion</h2>
            <p>Our sample outfit suggestion for you.</p>
          </div>
          <Sparkles size={25} />
        </div>

        <div className="look-card">
          <div className="look-visual">
            <Shirt size={85} strokeWidth={1} />
            <span>{occasion} Look</span>
          </div>

          <div className="look-details">
            <span className="look-badge">STYLE PREVIEW</span>
            <h3>{currentLook.title}</h3>
            <p>{currentLook.description}</p>

            <ul>
              <li><strong>Top:</strong> {currentLook.top}</li>
              <li><strong>Bottom:</strong> {currentLook.bottom}</li>
              <li><strong>Shoes:</strong> {currentLook.shoes}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="wardrobe-empty">
        <div className="empty-icon">
          <Plus size={30} />
        </div>

        <div>
          <h3>Start Building Your Wardrobe</h3>
          <p>Add your clothing items to explore personalized outfit ideas.</p>
        </div>
      </section>

    </div>
  );
}

export default Dashboard;
