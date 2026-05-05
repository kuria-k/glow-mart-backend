// pages/Vlogs.jsx
import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Whatsapp from "../components/whatsapp";
import CartSidebar from "../components/cartsidebar";
import { useCart } from "../hooks/usecart";
import { useWishlist } from "../hooks/usewishlist";

// ── Educational Vlog Content ──────────────────────────────
// Hardcoded educational content about skincare, wellness, and nutrition

const VLOG_CATEGORIES = [
  { 
    id: "cleansers", 
    label: "Cleansers & Washes", 
    icon: "🧼",
    description: "Master the art of proper face washing"
  },
  { 
    id: "sunscreen", 
    label: "Sun Protection", 
    icon: "☀️",
    description: "Your daily defense against aging"
  },
  { 
    id: "oil-control", 
    label: "Oil Control", 
    icon: "💧",
    description: "Balance your skin's natural oils"
  },
  { 
    id: "protein", 
    label: "Protein & Nutrition", 
    icon: "💪",
    description: "Fuel your body from within"
  },
  { 
    id: "moisturizers", 
    label: "Moisturizers", 
    icon: "✨",
    description: "Hydration for every skin type"
  },
  { 
    id: "supplements", 
    label: "Wellness Supplements", 
    icon: "🌿",
    description: "Support your health journey"
  },
];

// Comprehensive educational content
const EDUCATIONAL_CONTENT = {
  cleansers: {
    title: "The Science of Clean: Choosing Your Perfect Cleanser",
    hero: {
      title: "Why Your Cleanser Matters More Than You Think",
      description: "The first step in any skincare routine, cleansers remove dirt, oil, and impurities while preparing your skin for subsequent products. But not all cleansers are created equal.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    },
    products: [
      {
        id: "cerave-hydrating",
        name: "CeraVe Hydrating Facial Cleanser",
        brand: "CeraVe",
        description: "A gentle, non-foaming cleanser that removes dirt and makeup without stripping the skin. Formulated with three essential ceramides and hyaluronic acid to hydrate and restore the skin's natural barrier.",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
        benefits: ["Restores skin barrier", "Non-comedogenic", "Fragrance-free", "PH balanced"],
        skinTypes: ["Dry", "Sensitive", "Normal"],
        keyIngredients: ["Ceramides", "Hyaluronic Acid", "Niacinamide"],
      },
      {
        id: "la-roche-posay-toleriane",
        name: "La Roche-Posay Toleriane Hydrating Gentle Cleanser",
        brand: "La Roche-Posay",
        description: "A creamy, sulfate-free cleanser that respects sensitive skin while effectively removing impurities and makeup. Formulated with prebiotic thermal water and niacinamide.",
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800&q=80",
        benefits: ["Calms sensitive skin", "Maintains moisture", "Soothes irritation", "Gentle cleansing"],
        skinTypes: ["Sensitive", "Dry", "Combination"],
        keyIngredients: ["Prebiotic Thermal Water", "Niacinamide", "Ceramide-3"],
      },
      {
        id: "cerave-foaming",
        name: "CeraVe Foaming Facial Cleanser",
        brand: "CeraVe",
        description: "A gel-like, foaming cleanser that removes excess oil and shine without disrupting the protective skin barrier. Ideal for normal to oily skin types.",
        image: "https://images.unsplash.com/photo-1556228454-efd3c1e7ad6d?w=800&q=80",
        benefits: ["Removes excess oil", "Unclogs pores", "Maintains barrier", "Refreshing feel"],
        skinTypes: ["Oily", "Combination", "Normal"],
        keyIngredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
      },
    ],
    tips: [
      "Wash your face twice daily — morning and night",
      "Use lukewarm water, not hot, to avoid stripping natural oils",
      "Massage cleanser for 60 seconds for deeper cleaning",
      "Pat dry with a clean towel, don't rub",
      "Follow with toner or serum within 60 seconds",
    ],
  },
  sunscreen: {
    title: "Sun Protection: Your Ultimate Anti-Aging Strategy",
    hero: {
      title: "Why Sunscreen is Non-Negotiable",
      description: "UV radiation is responsible for up to 90% of visible skin aging. Daily sunscreen use protects against skin cancer, prevents hyperpigmentation, and maintains collagen production.",
      image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
    },
    products: [
      {
        id: "la-roche-posay-anthelios",
        name: "La Roche-Posay Anthelios Melt-in Milk SPF 100",
        brand: "La Roche-Posay",
        description: "High-protection sunscreen with Cell-Ox Shield technology. Provides broad-spectrum UVA/UVB protection in a lightweight, non-greasy formula that absorbs quickly.",
        image: "https://images.unsplash.com/photo-1556229010-5a3a9d7b8e9f?w=800&q=80",
        benefits: ["SPF 100 protection", "Water-resistant (80 min)", "Non-greasy finish", "Antioxidant enriched"],
        skinTypes: ["All skin types", "Sensitive"],
        keyIngredients: ["Cell-Ox Shield", "Antioxidants", "Glycerin"],
      },
      {
        id: "cerave-hydrating-sunscreen",
        name: "CeraVe Hydrating Mineral Sunscreen SPF 50",
        brand: "CeraVe",
        description: "100% mineral sunscreen with zinc oxide and titanium dioxide. Provides broad-spectrum protection while hydrating with ceramides and niacinamide.",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        benefits: ["Mineral protection", "Hydrating formula", "Sheer finish", "Fragrance-free"],
        skinTypes: ["Sensitive", "Dry", "Normal"],
        keyIngredients: ["Zinc Oxide", "Ceramides", "Niacinamide"],
      },
      {
        id: "la-roche-posay-anthelios-clear-skin",
        name: "La Roche-Posay Anthelios Clear Skin SPF 60",
        brand: "La Roche-Posay",
        description: "Oil-free sunscreen specifically designed for oily and acne-prone skin. Contains perlite to absorb excess oil and prevent shine.",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
        benefits: ["Matte finish", "Oil-absorbing", "Non-comedogenic", "Acne-safe"],
        skinTypes: ["Oily", "Acne-prone", "Combination"],
        keyIngredients: ["Perlite", "Silica", "Cell-Ox Shield"],
      },
    ],
    tips: [
      "Apply 15 minutes before sun exposure",
      "Use 1/2 teaspoon for face and neck",
      "Reapply every 2 hours, or immediately after swimming",
      "Don't forget ears, back of neck, and hands",
      "Use SPF 30 or higher daily, even on cloudy days",
    ],
  },
  "oil-control": {
    title: "Mastering Oil Control: Balance Without Stripping",
    hero: {
      title: "The Truth About Oily Skin",
      description: "Excess sebum production can lead to clogged pores and breakouts, but harsh products only make things worse. Learn to balance oil production while maintaining a healthy skin barrier.",
      image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800&q=80",
    },
    products: [
      {
        id: "cerave-renewing-sa",
        name: "CeraVe Renewing SA Cleanser",
        brand: "CeraVe",
        description: "Salicylic acid cleanser that gently exfoliates and smooths rough, bumpy skin while unclogging pores. Maintains the skin barrier with essential ceramides.",
        image: "https://images.unsplash.com/photo-1556228454-efd3c1e7ad6d?w=800&q=80",
        benefits: ["Exfoliates dead skin", "Unclogs pores", "Smooths texture", "Non-drying"],
        skinTypes: ["Oily", "Acne-prone", "Rough texture"],
        keyIngredients: ["Salicylic Acid", "Ceramides", "Niacinamide"],
      },
      {
        id: "la-roche-posay-effaclar",
        name: "La Roche-Posay Effaclar Purifying Foaming Gel",
        brand: "La Roche-Posay",
        description: "A purifying gel cleanser for oily skin that removes excess sebum and unclogs pores without over-drying. Soap-free and alcohol-free formula.",
        image: "https://images.unsplash.com/photo-1556229010-5a3a9d7b8e9f?w=800&q=80",
        benefits: ["Controls shine", "Purifies pores", "Soap-free", "Matte finish"],
        skinTypes: ["Oily", "Combination", "Acne-prone"],
        keyIngredients: ["Zinc PCA", "Thermal Water", "Glycerin"],
      },
    ],
    tips: [
      "Avoid over-cleansing which triggers more oil production",
      "Use oil-free, non-comedogenic products",
      "Consider niacinamide to regulate sebum",
      "Blotting papers > powder throughout the day",
      "Hydration is key — dehydrated skin produces more oil",
    ],
  },
  protein: {
    title: "Protein Power: Building Better Skin, Hair & Body",
    hero: {
      title: "Why Protein is Your Beauty Secret Weapon",
      description: "Protein isn't just for muscles — it's essential for collagen production, hair growth, and skin repair. Learn how proper protein intake transforms your appearance from within.",
      image: "https://images.unsplash.com/photo-1579722821273-0f6c7f44362f?w=800&q=80",
    },
    products: [
      {
        id: "jamieson-whey-protein",
        name: "Jamieson 100% Whey Protein - Chocolate",
        brand: "Jamieson",
        description: "Premium whey protein isolate for clean, fast-absorbing protein. Supports muscle recovery, hair strength, and collagen production. No artificial sweeteners.",
        image: "https://images.unsplash.com/photo-1579722820304-7a6b4c2c8e7d?w=800&q=80",
        benefits: ["Muscle recovery", "Hair strength", "Skin repair", "Clean formula"],
        proteinPerServing: "24g",
        keyFeatures: ["No artificial flavors", "Gluten-free", "Low sugar"],
      },
      {
        id: "diesel-plant-protein",
        name: "Diesel Plant Protein - Vanilla",
        brand: "Diesel",
        description: "Vegan protein blend from pea, rice, and hemp. Complete amino acid profile for plant-based beauty from within. Contains collagen-supporting vitamin C.",
        image: "https://images.unsplash.com/photo-1579722820304-7a6b4c2c8e7d?w=800&q=80",
        benefits: ["Vegan-friendly", "Complete amino acids", "Collagen support", "Easy digestion"],
        proteinPerServing: "20g",
        keyFeatures: ["Plant-based", "Dairy-free", "Non-GMO"],
      },
      {
        id: "jamieson-collagen-protein",
        name: "Jamieson Collagen Protein - Unflavored",
        brand: "Jamieson",
        description: "Hydrolyzed bovine collagen peptides that support skin elasticity, joint health, and hair thickness. Dissolves easily in hot or cold liquids.",
        image: "https://images.unsplash.com/photo-1579722821273-0f6c7f44362f?w=800&q=80",
        benefits: ["Skin elasticity", "Joint support", "Hair thickness", "Nail strength"],
        proteinPerServing: "10g collagen",
        keyFeatures: ["Type I & III collagen", "Unflavored", "Keto-friendly"],
      },
    ],
    tips: [
      "Aim for 1.6-2.2g protein per kg of body weight daily",
      "Distribute protein across 3-4 meals for better absorption",
      "Post-workout protein supports skin repair and recovery",
      "Collagen needs vitamin C for synthesis",
      "Plant-based eaters should combine complementary proteins",
    ],
  },
  moisturizers: {
    title: "Hydration Science: Finding Your Perfect Moisturizer",
    hero: {
      title: "Why Every Skin Type Needs Moisture",
      description: "Even oily skin needs hydration. Discover how the right moisturizer strengthens your skin barrier, prevents water loss, and creates a healthy, resilient complexion.",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
    },
    products: [
      {
        id: "cerave-moisturizing-cream",
        name: "CeraVe Moisturizing Cream",
        brand: "CeraVe",
        description: "Rich, non-greasy cream with MVE technology for 24-hour hydration. Restores the skin barrier with three essential ceramides.",
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800&q=80",
        benefits: ["24hr hydration", "Barrier restoration", "Non-comedogenic", "Fragrance-free"],
        texture: "Rich cream",
        keyIngredients: ["Ceramides", "Hyaluronic Acid", "MVE Technology"],
      },
      {
        id: "la-roche-posay-double-repair",
        name: "La Roche-Posay Double Repair Moisturizer",
        brand: "La Roche-Posay",
        description: "Ceramide- and niacinamide-rich moisturizer that repairs the skin barrier and provides 48-hour hydration. Prebiotic thermal water soothes sensitive skin.",
        image: "https://images.unsplash.com/photo-1556229010-5a3a9d7b8e9f?w=800&q=80",
        benefits: ["48hr hydration", "Barrier repair", "Soothes sensitivity", "Oil-free"],
        texture: "Lightweight cream",
        keyIngredients: ["Ceramide-3", "Niacinamide", "Prebiotic Water"],
      },
      {
        id: "cerave-pm-lotion",
        name: "CeraVe PM Facial Moisturizing Lotion",
        brand: "CeraVe",
        description: "Ultra-light, oil-free nighttime moisturizer with niacinamide to calm and hydrate. Restores the skin barrier while you sleep.",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
        benefits: ["Oil-free hydration", "Calms skin", "Barrier support", "Non-comedogenic"],
        texture: "Ultra-light lotion",
        keyIngredients: ["Niacinamide", "Ceramides", "Hyaluronic Acid"],
      },
    ],
    tips: [
      "Apply moisturizer to damp skin for better absorption",
      "Use lighter formulas in summer, richer in winter",
      "Wait 60 seconds after serums before moisturizing",
      "Don't skip moisturizer if you have oily skin",
      "Eye cream should be applied before moisturizer",
    ],
  },
  supplements: {
    title: "Wellness Supplements: Beauty From Within",
    hero: {
      title: "How Supplements Transform Your Skin & Health",
      description: "Nutritional gaps affect your appearance. Targeted supplements support everything from collagen production to stress management, creating visible improvements in skin, hair, and energy.",
      image: "https://images.unsplash.com/photo-1579722820304-7a6b4c2c8e7d?w=800&q=80",
    },
    products: [
      {
        id: "jamieson-vitamin-c",
        name: "Jamieson Vitamin C 1000mg Timed Release",
        brand: "Jamieson",
        description: "Timed-release vitamin C that provides all-day immune support and collagen synthesis. Essential for skin repair and antioxidant protection.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
        benefits: ["Collagen synthesis", "Immune support", "Antioxidant", "Skin repair"],
        dosage: "1000mg timed release",
        keyFeatures: ["Vegetarian", "No artificial colors", "Timed release"],
      },
      {
        id: "jamieson-biotin",
        name: "Jamieson Biotin 10,000mcg",
        brand: "Jamieson",
        description: "High-potency biotin for stronger hair, nails, and skin. Supports keratin production and cellular energy metabolism.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
        benefits: ["Hair growth", "Nail strength", "Skin health", "Energy metabolism"],
        dosage: "10,000mcg",
        keyFeatures: ["Ultra strength", "Vegetarian", "Gluten-free"],
      },
      {
        id: "jamieson-omega-3",
        name: "Jamieson Omega-3 Fish Oil",
        brand: "Jamieson",
        description: "Molecularly distilled fish oil rich in EPA and DHA. Reduces inflammation, supports skin hydration, and promotes heart and brain health.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
        benefits: ["Skin hydration", "Anti-inflammatory", "Heart health", "Brain function"],
        dosage: "900mg Omega-3",
        keyFeatures: ["Molecularly distilled", "Enteric coated", "No fishy aftertaste"],
      },
    ],
    tips: [
      "Take fat-soluble vitamins (A,D,E,K) with meals containing fat",
      "Consistency is more important than quantity",
      "Start one supplement at a time to assess tolerance",
      "Consult healthcare provider before starting new supplements",
      "Quality matters — look for third-party testing",
    ],
  },
};

export default function Vlogs() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("cleansers");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { wishlist } = useWishlist();

  const currentContent = EDUCATIONAL_CONTENT[activeCategory];
  const products = currentContent?.products || [];

  const filteredProducts = search.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300;1,400&family=Jost:wght@200;300;400;500;600&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; }
        
        .vlog-root { 
          background: linear-gradient(135deg, #faf8f4 0%, #f5f0ea 100%); 
          font-family: 'Jost', sans-serif; 
          color: #2c2c2c; 
          min-height: 100vh; 
        }
        
        /* Header */
        .vlog-header { 
          padding: 100px 0 60px; 
          position: relative;
          overflow: hidden;
        }
        
        .vlog-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 60%;
          height: 200%;
          background: radial-gradient(circle, rgba(184,155,123,0.03) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .vlog-eyebrow {
          font-size: 10px; 
          letter-spacing: .35em; 
          color: #b89b7b; 
          font-weight: 300;
          margin-bottom: 20px; 
          display: flex; 
          align-items: center; 
          gap: 14px;
        }
        
        .vlog-eyebrow::before, .vlog-eyebrow::after {
          content: ''; 
          display: block; 
          width: 40px; 
          height: 1px;
          background: #b89b7b; 
          opacity: .4;
        }
        
        .vlog-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(44px, 6vw, 85px);
          font-weight: 200; 
          line-height: 1.05; 
          letter-spacing: -.02em; 
          color: #2c2c2c;
          margin-bottom: 20px;
          max-width: 800px;
        }
        
        .vlog-h1 em { 
          font-style: italic; 
          color: #b89b7b; 
          font-weight: 300;
        }
        
        .vlog-header-sub { 
          font-size: 14px; 
          font-weight: 300; 
          color: #9a8c7e; 
          line-height: 1.8; 
          max-width: 480px; 
        }
        
        /* Search */
        .vlog-search-wrap { 
          position: relative; 
          max-width: 360px; 
        }
        
        .vlog-search {
          width: 100%; 
          padding: 12px 44px 12px 18px;
          border: 1px solid #e8d9c8; 
          background: white;
          font-family: 'Jost', sans-serif; 
          font-size: 13px; 
          font-weight: 300;
          color: #2c2c2c; 
          outline: none;
          transition: all .25s;
          border-radius: 0;
        }
        
        .vlog-search:focus { 
          border-color: #b89b7b; 
          box-shadow: 0 2px 8px rgba(184,155,123,0.1);
        }
        
        /* Category Tabs */
        .vlog-categories {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 48px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e8d9c8;
        }
        
        .vlog-category-btn {
          padding: 12px 28px;
          font-size: 11px;
          letter-spacing: .18em;
          font-weight: 400;
          background: transparent;
          border: 1px solid #e0d5c8;
          cursor: pointer;
          transition: all .25s;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Jost', sans-serif;
          color: #8a7a6a;
        }
        
        .vlog-category-btn:hover {
          border-color: #b89b7b;
          color: #b89b7b;
        }
        
        .vlog-category-btn.active {
          background: #b89b7b;
          border-color: #b89b7b;
          color: white;
        }
        
        /* Hero Section */
        .vlog-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 72px;
          background: white;
          border: 1px solid #e8d9c8;
          overflow: hidden;
        }
        
        .vlog-hero-image {
          height: 480px;
          overflow: hidden;
        }
        
        .vlog-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .vlog-hero-content {
          padding: 60px 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .vlog-hero-category {
          font-size: 9px;
          letter-spacing: .28em;
          color: #b89b7b;
          margin-bottom: 16px;
          text-transform: uppercase;
        }
        
        .vlog-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 300;
          color: #2c2c2c;
          line-height: 1.2;
          margin-bottom: 20px;
        }
        
        .vlog-hero-description {
          font-size: 14px;
          font-weight: 300;
          color: #777;
          line-height: 1.8;
          margin-bottom: 28px;
        }
        
        /* Products Grid */
        .vlog-grid-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          margin-bottom: 32px;
          letter-spacing: -.01em;
        }
        
        .vlog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 32px;
          margin-bottom: 64px;
        }
        
        .vlog-product-card {
          background: white;
          border: 1px solid #e8d9c8;
          overflow: hidden;
          transition: all .3s ease;
          cursor: pointer;
        }
        
        .vlog-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(44,44,44,0.08);
        }
        
        .vlog-product-image {
          height: 260px;
          overflow: hidden;
          position: relative;
        }
        
        .vlog-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .5s ease;
        }
        
        .vlog-product-card:hover .vlog-product-image img {
          transform: scale(1.05);
        }
        
        .vlog-product-brand {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(250,247,242,.95);
          padding: 4px 12px;
          font-size: 9px;
          letter-spacing: .2em;
          color: #b89b7b;
        }
        
        .vlog-product-body {
          padding: 24px;
        }
        
        .vlog-product-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 400;
          margin-bottom: 12px;
          color: #2c2c2c;
        }
        
        .vlog-product-description {
          font-size: 12px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        
        .vlog-product-benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .vlog-benefit-tag {
          font-size: 9px;
          padding: 3px 8px;
          background: #f5f0ea;
          color: #b89b7b;
          letter-spacing: .05em;
        }
        
        .vlog-read-more {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: .2em;
          color: #2c2c2c;
          border-bottom: 1px solid #e0d5c8;
          padding-bottom: 3px;
          transition: all .2s;
        }
        
        .vlog-product-card:hover .vlog-read-more {
          color: #b89b7b;
          border-color: #b89b7b;
        }
        
        /* Tips Section */
        .vlog-tips {
          background: #f5f0ea;
          padding: 48px;
          margin-top: 48px;
        }
        
        .vlog-tips-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 300;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .vlog-tips-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .vlog-tip-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 13px;
          color: #555;
          line-height: 1.6;
        }
        
        .vlog-tip-bullet {
          color: #b89b7b;
          font-size: 18px;
          line-height: 1;
        }
        
        /* Modal */
        .vlog-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .vlog-modal {
          background: white;
          max-width: 900px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          position: relative;
        }
        
        .vlog-modal-close {
          position: absolute;
          top: 20px;
          right: 24px;
          font-size: 28px;
          cursor: pointer;
          color: #999;
          transition: color .2s;
          z-index: 10;
        }
        
        .vlog-modal-close:hover { color: #2c2c2c; }
        
        .vlog-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        
        .vlog-modal-image {
          height: 100%;
          min-height: 400px;
        }
        
        .vlog-modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .vlog-modal-content {
          padding: 40px 40px 40px 0;
        }
        
        .vlog-modal-brand {
          font-size: 9px;
          letter-spacing: .28em;
          color: #b89b7b;
          margin-bottom: 12px;
        }
        
        .vlog-modal-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          margin-bottom: 20px;
        }
        
        .vlog-modal-desc {
          font-size: 13px;
          color: #666;
          line-height: 1.8;
          margin-bottom: 24px;
        }
        
        .vlog-modal-section {
          margin-bottom: 24px;
        }
        
        .vlog-modal-section-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .1em;
          margin-bottom: 12px;
          color: #b89b7b;
        }
        
        .vlog-modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .vlog-modal-tag {
          font-size: 11px;
          padding: 4px 12px;
          background: #f5f0ea;
          color: #5a4a3a;
        }
        
        @media (max-width: 900px) {
          .vlog-hero { grid-template-columns: 1fr; gap: 0; }
          .vlog-hero-image { height: 320px; }
          .vlog-hero-content { padding: 36px 28px; }
          .vlog-header { padding: 70px 0 40px; }
          .vlog-modal-grid { grid-template-columns: 1fr; }
          .vlog-modal-content { padding: 0 32px 32px 32px; }
        }
        
        @media (max-width: 640px) {
          .vlog-grid { grid-template-columns: 1fr; }
          .vlog-categories { gap: 6px; }
          .vlog-category-btn { padding: 8px 18px; font-size: 9px; }
        }
      `}</style>

      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onMenuToggle={() => {}}
      />

      <div className="vlog-root">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          
          {/* Header */}
          <header className="vlog-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
              <div>
                <div className="vlog-eyebrow">THE WELLNESS & SKINCARE VLOG</div>
                <h1 className="vlog-h1">
                  Educate. <em>Elevate.</em><br />
                  Transform.
                </h1>
                <p className="vlog-header-sub">
                  Expert insights on skincare, nutrition, and wellness — 
                  because true beauty starts with knowledge.
                </p>
              </div>
              
              <div className="vlog-search-wrap">
                <input
                  className="vlog-search"
                  type="text"
                  placeholder="Search products, brands..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </header>

          {/* Category Tabs */}
          <div className="vlog-categories">
            {VLOG_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`vlog-category-btn${activeCategory === cat.id ? " active" : ""}`}
                onClick={() => { setActiveCategory(cat.id); setSearch(""); }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          {currentContent && (
            <>
              {/* Hero Section */}
              <div className="vlog-hero">
                <div className="vlog-hero-image">
                  <img src={currentContent.hero.image} alt={currentContent.hero.title} />
                </div>
                <div className="vlog-hero-content">
                  <div className="vlog-hero-category">
                    {VLOG_CATEGORIES.find(c => c.id === activeCategory)?.label}
                  </div>
                  <h2 className="vlog-hero-title">{currentContent.hero.title}</h2>
                  <p className="vlog-hero-description">{currentContent.hero.description}</p>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 && (
                <>
                  <h3 className="vlog-grid-title">
                    Featured Products
                    {search && <span style={{ fontSize: 14, marginLeft: 12, color: "#b89b7b" }}>({filteredProducts.length} results)</span>}
                  </h3>
                  <div className="vlog-grid">
                    {filteredProducts.map(product => (
                      <div key={product.id} className="vlog-product-card" onClick={() => handleProductClick(product)}>
                        <div className="vlog-product-image">
                          <img src={product.image} alt={product.name} />
                          <div className="vlog-product-brand">{product.brand}</div>
                        </div>
                        <div className="vlog-product-body">
                          <h4 className="vlog-product-name">{product.name}</h4>
                          <p className="vlog-product-description">{product.description.slice(0, 100)}...</p>
                          {product.benefits && (
                            <div className="vlog-product-benefits">
                              {product.benefits.slice(0, 3).map((benefit, i) => (
                                <span key={i} className="vlog-benefit-tag">{benefit}</span>
                              ))}
                            </div>
                          )}
                          <div className="vlog-read-more">
                            LEARN MORE 
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Tips Section */}
              {currentContent.tips && (
                <div className="vlog-tips">
                  <div className="vlog-tips-title">
                    <span>💡</span> Expert Tips & Best Practices
                  </div>
                  <div className="vlog-tips-list">
                    {currentContent.tips.map((tip, i) => (
                      <div key={i} className="vlog-tip-item">
                        <span className="vlog-tip-bullet">✦</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Whatsapp />
      <Footer />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        total={cartTotal}
      />

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div className="vlog-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="vlog-modal" onClick={e => e.stopPropagation()}>
            <div className="vlog-modal-close" onClick={() => setShowModal(false)}>✕</div>
            <div className="vlog-modal-grid">
              <div className="vlog-modal-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="vlog-modal-content">
                <div className="vlog-modal-brand">{selectedProduct.brand}</div>
                <h2 className="vlog-modal-name">{selectedProduct.name}</h2>
                <p className="vlog-modal-desc">{selectedProduct.description}</p>
                
                {selectedProduct.benefits && (
                  <div className="vlog-modal-section">
                    <div className="vlog-modal-section-title">KEY BENEFITS</div>
                    <div className="vlog-modal-tags">
                      {selectedProduct.benefits.map((benefit, i) => (
                        <span key={i} className="vlog-modal-tag">{benefit}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProduct.keyIngredients && (
                  <div className="vlog-modal-section">
                    <div className="vlog-modal-section-title">KEY INGREDIENTS</div>
                    <div className="vlog-modal-tags">
                      {selectedProduct.keyIngredients.map((ing, i) => (
                        <span key={i} className="vlog-modal-tag">{ing}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProduct.skinTypes && (
                  <div className="vlog-modal-section">
                    <div className="vlog-modal-section-title">BEST FOR</div>
                    <div className="vlog-modal-tags">
                      {selectedProduct.skinTypes.map((type, i) => (
                        <span key={i} className="vlog-modal-tag">{type}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.proteinPerServing && (
                  <div className="vlog-modal-section">
                    <div className="vlog-modal-section-title">NUTRITION</div>
                    <div className="vlog-modal-tags">
                      <span className="vlog-modal-tag">{selectedProduct.proteinPerServing} protein</span>
                      {selectedProduct.keyFeatures?.map((feature, i) => (
                        <span key={i} className="vlog-modal-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}