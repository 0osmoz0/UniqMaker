import { useState, useEffect, useRef } from "react";
import { 
  FiLogIn, FiLogOut, FiLoader, FiAlertCircle, FiEye, FiEyeOff, 
  FiSearch, FiX, FiChevronLeft, FiChevronRight, FiUser, FiUsers,
  FiHeart, FiFileText, FiPlus, FiEdit, FiTrash, FiStar, FiShoppingCart,
  FiImage
} from "react-icons/fi";

const API_BASE = "http://localhost:5001";

// Styles globaux CSS
const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
  .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97); }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-scale { animation: scaleIn 0.3s ease-out forwards; }
  .transition-smooth { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .will-change-transform { will-change: transform, opacity; }
`;

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        await new Promise(resolve => setTimeout(resolve, 800));
        onLogin(data.token);
      } else {
        setError(data.message || "Identifiants incorrects");
        containerRef.current.classList.add("animate-shake");
        setTimeout(() => {
          containerRef.current.classList.remove("animate-shake");
        }, 500);
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white bg-opacity-10 animate-float will-change-transform"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <div 
        ref={containerRef}
        className="w-full max-w-md relative z-10 animate-fade will-change-transform"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20 transition-smooth hover:shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"></div>
            <h1 className="text-3xl font-bold text-white relative animate-fade" style={{ animationDelay: "0.1s" }}>
              Bienvenue
            </h1>
            <p className="text-indigo-100 mt-2 relative animate-fade" style={{ animationDelay: "0.2s" }}>
              Connectez-vous à votre espace
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div 
                className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 animate-fade"
                style={{ animationDuration: "0.2s" }}
              >
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="animate-fade" style={{ animationDelay: "0.3s" }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="email@exemple.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-smooth shadow-sm hover:border-gray-300"
                  required
                  autoFocus
                />
              </div>
            </div>
            
            <div className="animate-fade" style={{ animationDelay: "0.4s" }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-smooth shadow-sm hover:border-gray-300 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-smooth"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff className="text-indigo-600" /> : <FiEye />}
                </button>
              </div>
            </div>
            
            <div className="pt-2 animate-fade" style={{ animationDelay: "0.5s" }}>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-smooth shadow-lg hover:shadow-indigo-500/30 ${
                  isLoading ? "opacity-90 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <FiLogIn className="mr-2" />
                    <span>Se connecter</span>
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="px-8 pb-8 text-center animate-fade" style={{ animationDelay: "0.6s" }}>
            <p className="text-sm text-gray-500">
              Pas encore de compte ?{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition-smooth hover:underline">
                Contactez l'administrateur
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center text-white/90 text-sm animate-fade" style={{ animationDelay: "0.7s" }}>
          <p>© {new Date().getFullYear()} MonApplication. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('products');
  const [userRole, setUserRole] = useState('client');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${API_BASE}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle", error);
      }
    };

    fetchUserRole();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-700">MidOcean CRM</h1>
        </div>
        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth ${
              activeTab === 'products' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiShoppingCart />
            <span>Produits</span>
          </button>
          
          <button
            onClick={() => setActiveTab('favorites')}
            className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth ${
              activeTab === 'favorites' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiHeart />
            <span>Favoris</span>
          </button>

          {(userRole === 'admin' || userRole === 'commercial') && (
            <>
              <button
                onClick={() => setActiveTab('clients')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth ${
                  activeTab === 'clients' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiUsers />
                <span>Clients</span>
              </button>

              <button
                onClick={() => setActiveTab('quotes')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth ${
                  activeTab === 'quotes' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiFileText />
                <span>Devis</span>
              </button>
            </>
          )}

          {userRole === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth ${
                activeTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiUser />
              <span>Utilisateurs</span>
            </button>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-gray-900 capitalize">
                {activeTab === 'products' && 'Catalogue Produits'}
                {activeTab === 'favorites' && 'Mes Favoris'}
                {activeTab === 'clients' && 'Gestion Clients'}
                {activeTab === 'quotes' && 'Devis & Simulations'}
                {activeTab === 'users' && 'Gestion Utilisateurs'}
              </h1>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 px-4 py-2 rounded-md hover:shadow-sm transition-smooth border border-red-100 hover:border-red-200"
                >
                  <FiLogOut className="flex-shrink-0" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'products' && <ProductCatalog token={token} userRole={userRole} />}
          {activeTab === 'favorites' && <FavoritesManager token={token} />}
          {activeTab === 'clients' && <ClientsManager token={token} />}
          {activeTab === 'quotes' && <QuotesManager token={token} />}
          {activeTab === 'users' && <UsersManager token={token} userRole={userRole} />}
        </main>
      </div>
    </div>
  );
}
const COLOR_MAP = {
  "Abricot": "#FBCEB1",
  "Anthracite": "#383E42",
  "Anthracite Chine": "#464646",
  "Aqua": "#00FFFF",
  "Argent": "#C0C0C0",
  "Argent Brillant": "#E6E8FA",
  "Argent Mat": "#B6B6B6",
  "Army": "#4B5320",
  "Astral Purple": "#5D4D7A",
  "Beige": "#F5F5DC",
  "Beige Chine": "#E1C699",
  "Beige Fonce": "#D2B48C",
  "Beige/Rouge": "#F5F5DC",
  "Blanc": "#FFFFFF",
  "Blanc 2": "#F8F8FF",
  "Blanc Absolu": "#FFFFFF",
  "Blanc Cassé": "#F5F5F5",
  "Blanc Chiné": "#F5F5F5",
  "Blanc Recyclé": "#F5F5F5",
  "Blanc Transparent": "#FFFFFF",
  "Blanc/Bleu": "#E6F1F7",
  "Blanc/Bleu Foncé": "#D6E0E7",
  "Blanc/Gris": "#E5E5E5",
  "Blanc/Jaune Néon": "#FFFFCC",
  "Blanc/Marine": "#E6E6FA",
  "Blanc/Noir": "#F2F2F2",
  "Blanc/Rouge": "#FFE6E6",
  "Blanc/Turquoise": "#E0FFFF",
  "Bleu": "#0000FF",
  "Bleu Abysse": "#00008B",
  "Bleu Arctique": "#B0E0E6",
  "Bleu Ardoise": "#6A5ACD",
  "Bleu Atoll": "#00B7EB",
  "Bleu Bébé": "#89CFF0",
  "Bleu Canard": "#007791",
  "Bleu Caraibes": "#1E90FF",
  "Bleu Ciel Chine": "#87CEEB",
  "Bleu Clair Transparent": "#ADD8E6",
  "Bleu Cremeux": "#B0C4DE",
  "Bleu Glacier": "#E1F5FE",
  "Bleu Marine": "#000080",
  "Bleu Petrole": "#005F6A",
  "Bleu Royal": "#4169E1",
  "Bleu Transparent": "#E6F1F7",
  "Bleu/Blanc": "#E6F1F7",
  "Bois": "#966F33",
  "Bordeaux": "#800020",
  "Champagne": "#F7E7CE",
  "Chili": "#E03C31",
  "Chocolat": "#7B3F00",
  "Chocolat Fonce": "#5A3A22",
  "Ciel": "#87CEEB",
  "Ciel Piqué": "#B0E2FF",
  "Citron": "#FFF44F",
  "Corail Fluo": "#FF7F50",
  "Corde": "#BA7C45",
  "Couleurs Assorties": "#FFD700",
  "Creme": "#FFFDD0",
  "Cuivré": "#B87333",
  "Denim": "#1560BD",
  "Denim Chine": "#1E4D6B",
  "Ecru": "#F5F3E5",
  "Emeraude": "#50C878",
  "Folk Pink Twin": "#FFB6C1",
  "Folk Red Twin": "#FF0000",
  "French Marine": "#3B5998",
  "French Marine 2": "#3B5998",
  "French Marine/Blanc": "#3B5998",
  "Fuchsia": "#FF00FF",
  "Fuchsia Transparent": "#FF00FF",
  "Fuschia Fluo": "#FF00FF",
  "Gris": "#808080",
  "Gris 2": "#A9A9A9",
  "Gris Anthracite": "#383E42",
  "Gris Carbone": "#625D5D",
  "Gris Chiné": "#A9A9A9",
  "Gris Chiné II": "#A9A9A9",
  "Gris Chiné Recyclé": "#A9A9A9",
  "Gris Clair": "#D3D3D3",
  "Gris Fonce": "#696969",
  "Gris Foncé/Gris": "#696969",
  "Gris Metal": "#A8A8A8",
  "Gris Pierre": "#8B8B8B",
  "Gris Pur": "#808080",
  "Gris Souris": "#9E9E9E",
  "Gris Transparent": "#D3D3D3",
  "Hibiscus": "#B43757",
  "Ivoire": "#FFFFF0",
  "Jaune": "#FFFF00",
  "Jaune Clair": "#FFFFE0",
  "Jaune Fluo": "#FFFF00",
  "Jaune Pâle": "#FFFF99",
  "Jaune Transparent": "#FFFFE0",
  "Kaki": "#C3B091",
  "Kaki Chiné": "#C3B091",
  "Kaki Foncé": "#8B864E",
  "Lilas": "#C8A2C8",
  "Lime": "#00FF00",
  "Lime Fluo": "#32CD32",
  "Linen Twin": "#FAF0E6",
  "Marine": "#000080",
  "Marine Recyclé": "#000080",
  "Marron": "#800000",
  "Multicolore": "#FFD700",
  "Naturel": "#F5DEB3",
  "Noir": "#000000",
  "Noir 2": "#0A0A0A",
  "Noir Profond": "#000000",
  "Noir Recyclé": "#000000",
  "Noir/Blanc": "#000000",
  "Noir/Bleu": "#000000",
  "Noir/Lime": "#000000",
  "Noir/Rouge": "#000000",
  "Or": "#FFD700",
  "Or Mat": "#D4AF37",
  "Orange": "#FFA500",
  "Orange 2": "#FF8C00",
  "Orange Brulee": "#CC5500",
  "Orange Fluo": "#FFA500",
  "Orange Transparent": "#FFA500",
  "Outremer": "#120A8F",
  "Oxblood Chine": "#800020",
  "Peche": "#FFDAB9",
  "Petrole": "#005F6A",
  "Pool Blue": "#7CB9E8",
  "Pop Orange": "#FF9F00",
  "Ribbon Pink": "#FFC0CB",
  "Rose": "#FF007F",
  "Rose Bonbon": "#F9429E",
  "Rose Bébé": "#F4C2C2",
  "Rose Chine": "#E75480",
  "Rose Cremeux": "#FFE4E1",
  "Rose Fluo 2": "#FF007F",
  "Rose Moyen": "#C21E56",
  "Rose Orchidée": "#DA70D6",
  "Rose Pâle": "#FFD1DC",
  "Rose Transparent": "#FFE4E1",
  "Rouge": "#FF0000",
  "Rouge 2": "#DC143C",
  "Rouge Piment": "#FF0000",
  "Rouge Recyclé": "#FF0000",
  "Rouge Tango": "#FF4D00",
  "Rouge Transparent": "#FF0000",
  "Rouge Vif": "#FF0000",
  "Royal": "#4169E1",
  "Royal 3": "#4169E1",
  "Royal Recyclé": "#4169E1",
  "Sable": "#F4A460",
  "Taupe": "#483C32",
  "Terracotta": "#E2725B",
  "Terre": "#E2725B",
  "Tilleul": "#BAB86C",
  "Titanium": "#878681",
  "Transparent": "#FFFFFF",
  "Turquoise": "#40E0D0",
  "Vert": "#008000",
  "Vert 2": "#00FF00",
  "Vert Armée Vert": "#4B5320",
  "Vert Bouteille": "#006A4E",
  "Vert Clair Chine": "#90EE90",
  "Vert Cremeux": "#8FBC8F",
  "Vert Empire": "#245336",
  "Vert Fluo": "#00FF00",
  "Vert Foncé": "#023020",
  "Vert Foncé 2": "#013220",
  "Vert Foret": "#228B22",
  "Vert Glace": "#C1E1C1",
  "Vert Golf": "#008000",
  "Vert Lime Transparent": "#00FF00",
  "Vert Menthe": "#3EB489",
  "Vert Pomme": "#8DB600",
  "Vert Prairie": "#7CFC00",
  "Vert Prairie /Blanc": "#7CFC00",
  "Vert Printemps": "#00FF7F",
  "Vert Sapin": "#0A5C36",
  "Vert Transparent": "#90EE90",
  "Vieux Rose": "#C08081",
  "Violet": "#8A2BE2",
  "Violet Clair": "#EE82EE",
  "Violet Fonce": "#9400D3",
  "Violet Transparent": "#EE82EE",
  "Zinc": "#7D7D7D"
};

// Fonction utilitaire améliorée pour obtenir le code hexadécimal
const getColorHex = (colorName) => {
  if (!colorName) return "#CCCCCC";
  
  // Normalisation du nom de couleur
  const normalize = (str) => str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ' ')
    .trim();

  const normalizedInput = normalize(colorName);
  
  // Recherche insensible à la casse et aux accents
  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (normalize(key) === normalizedInput) {
      return value;
    }
  }
  
  return "#CCCCCC"; // Couleur par défaut
};

function ProductCatalog({ token, userRole }) {
  // États
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [modalData, setModalData] = useState({
    open: false,
    product: null,
    imageIndex: 0
  });

  // Refs
  const searchInputRef = useRef(null);

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_BASE}/products/images/full`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error(response.statusText || "Erreur de chargement");
        }
        
        const data = await response.json();
        
        if (!data.products_with_images) {
          throw new Error("Format de données inattendu");
        }
        
        setProducts(data.products_with_images);
        
        // Initialiser les variantes sélectionnées
        const variants = {};
        data.products_with_images.forEach(product => {
          if (product.variants?.length > 0) {
            variants[product.master_code] = product.variants[0];
          }
        });
        setSelectedVariants(variants);
        
      } catch (err) {
        console.error("Erreur fetchProducts:", err);
        setError(err.message || "Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    [product.product_name, product.master_code, product.brand]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get display images for product
  const getDisplayImages = (product) => {
    if (!product) return [];
    
    const variant = selectedVariants[product.master_code];
    if (variant?.images?.length > 0) {
      return variant.images;
    }
    return product.images || [];
  };

  // Get available colors for product
  const getAvailableColors = (product) => {
    if (!product.variants) return [];
    
    const colors = [];
    const seenColors = new Set();
    
    product.variants.forEach(variant => {
      // Essayer plusieurs clés possibles pour la couleur
      const colorName = variant.color || variant.color_name || variant.colour;
      const colorCode = variant.color_code || variant.color_id || colorName;
      
      if (colorName && colorCode && !seenColors.has(colorCode)) {
        seenColors.add(colorCode);
        colors.push({
          name: colorName,
          code: colorCode,
          hex: getColorHex(colorName),
          variant: variant
        });
      }
    });
    
    return colors;
  };

  // Handle color selection
  const handleColorSelect = (product, color) => {
    setSelectedVariants(prev => ({
      ...prev,
      [product.master_code]: color.variant
    }));
  };

  // Open image modal
  const openImageModal = (product, imageIndex = 0) => {
    setModalData({
      open: true,
      product,
      imageIndex
    });
  };

  // Close modal
  const closeModal = () => {
    setModalData(prev => ({ ...prev, open: false }));
  };

  // Add to favorites
  const addToFavorites = async (product) => {
    try {
      const response = await fetch(`${API_BASE}/favorites`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product_id: product.master_code,
          product_name: product.product_name
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur d'ajout aux favoris");
      }
      
      alert("Produit ajouté aux favoris !");
    } catch (err) {
      console.error("Erreur addToFavorites:", err);
      alert(err.message || "Une erreur est survenue");
    }
  };

const addToCatalog = async (product) => {
  if (!window.confirm(`Ajouter "${product.product_name}" au catalogue ?`)) return;

  try {
    const variants = product.variants || [];

    // 1. Préparation des images groupées par couleur
    const imagesByColor = variants.reduce((acc, variant) => {
      // Ignorer les variants sans couleur ou sans images
      if (!variant.color || !variant.images) return acc;
      
      const color = variant.color.trim();
      if (!color) return acc;
      
      // Extraire les URLs valides
      const urls = variant.images
        .map(img => img.url)
        .filter(url => url && typeof url === 'string');
      
      if (urls.length === 0) return acc;
      
      // Ajouter au tableau
      acc.push({
        color: color,
        images: urls
      });
      
      return acc;
    }, []);

    // 2. Création de la liste plate de toutes les images
    const allImages = imagesByColor.flatMap(({images}) => 
      images.map(url => ({ url }))
      .concat(product.image ? [{ url: product.image }] : []));

    // 3. Extraction des couleurs uniques
    const colors = [...new Set(imagesByColor.map(({color}) => color))];

    // 4. Téléchargement de l'image principale
    let imageFile = null;
    const mainImageUrl = allImages[0]?.url;
    
    if (mainImageUrl) {
      try {
        const imageResponse = await fetch(mainImageUrl);
        const blob = await imageResponse.blob();
        imageFile = new File([blob], `${product.master_code}.jpg`, { type: blob.type });
      } catch (imgErr) {
        console.warn("Erreur de téléchargement de l'image:", imgErr);
      }
    }

    // 5. Préparation des données pour l'API
    const formData = new FormData();
    formData.append("name", product.product_name);
    formData.append("price", (product.price || 0) * 2);
    formData.append("description", product.long_description || product.short_description || "");
    formData.append("category_level1", product.category_level1 || "Non spécifié");
    formData.append("category_level2", product.category_level2 || "Non spécifié");
    formData.append("category_level3", product.category_level3 || "Non spécifié");
    formData.append("stock", product.stock || 0);
    formData.append("colors_json", JSON.stringify(colors));
    formData.append("images_json", JSON.stringify(allImages));
    formData.append("images_by_color_json", JSON.stringify(imagesByColor));

    // 6. Ajout de l'image (fichier ou URL)
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (mainImageUrl) {
      formData.append("image_url", mainImageUrl);
    }

    // 7. Envoi à l'API
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'ajout");
    }

    alert("Produit ajouté au catalogue avec succès !");
  } catch (err) {
    console.error("Erreur addToCatalog:", err);
    alert(err.message || "Une erreur est survenue");
  }
};




  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) pages.push(1);
    if (startPage > 2) pages.push("...");
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages - 1) pages.push("...");
    if (endPage < totalPages) pages.push(totalPages);

    return (
      <div className="flex justify-center mt-8">
        <nav className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Précédent
          </button>
          
          {pages.map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
              className={`px-3 py-1 border rounded ${
                page === currentPage ? 'bg-indigo-600 text-white border-indigo-600' : ''
              } ${typeof page !== 'number' ? 'pointer-events-none' : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </nav>
      </div>
    );
  };

  // Render color swatches
  const renderColorSwatches = (product) => {
    const colors = getAvailableColors(product);
    if (colors.length === 0) return null;

    return (
      <div className="mt-2">
        <div className="flex flex-wrap gap-1">
          {colors.map((color, i) => (
            <button
              key={`${product.master_code}-${color.code}-${i}`}
              className="w-5 h-5 rounded-full border-2 border-gray-200 hover:border-indigo-300 transition-all"
              style={{
                backgroundColor: color.hex,
                ...(selectedVariants[product.master_code]?.color_code === color.code ? {
                  borderColor: '#6366f1',
                  boxShadow: '0 0 0 1px #818cf8'
                } : {})
              }}
              title={color.name}
              onClick={(e) => {
                e.stopPropagation();
                handleColorSelect(product, color);
              }}
              aria-label={`Sélectionner la couleur ${color.name}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search and filter section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <FiLoader className="animate-spin text-indigo-600 text-4xl" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun produit ne correspond à votre recherche</p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-2 text-indigo-600 hover:underline"
          >
            Réinitialiser la recherche
          </button>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentItems.map(product => {
              const images = getDisplayImages(product);
              const mainImage = images[0]?.url;

              return (
                <div 
                  key={product.master_code} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Product image */}
                  <div 
                    className="relative h-48 bg-gray-50 cursor-pointer"
                    onClick={() => openImageModal(product)}
                  >
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.product_name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300?text=Image+Non+Disponible';
                          e.target.className = 'w-full h-full object-cover';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FiImage size={48} />
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 truncate">
                      {product.product_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {product.price ? `${product.price.toFixed(2)} €` : 'Prix sur demande'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Ref: {product.master_code}
                    </p>

                    {/* Color variants */}
                    {renderColorSwatches(product)}

                    {/* Action buttons */}
                    <div className="flex justify-between mt-3 pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToFavorites(product);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 p-1"
                        title="Ajouter aux favoris"
                      >
                        <FiStar />
                      </button>
                      
                      {userRole === "admin" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCatalog(product);
                          }}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Ajouter au catalogue"
                        >
                          <FiPlus />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {renderPagination()}
        </>
      )}

      {/* Image modal */}
      {modalData.open && modalData.product && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-gray-700 hover:text-gray-900 bg-white rounded-full p-1 shadow"
            >
              <FiX size={24} />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Main image */}
              <div className="md:w-2/3 p-4 flex items-center justify-center bg-gray-50">
                {getDisplayImages(modalData.product).length > 0 ? (
                  <img
                    src={getDisplayImages(modalData.product)[modalData.imageIndex]?.url}
                    alt={modalData.product.product_name}
                    className="max-h-[70vh] object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x600?text=Image+Non+Disponible';
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <FiImage size={64} className="mx-auto" />
                    <p>Aucune image disponible</p>
                  </div>
                )}
              </div>

              {/* Product details */}
              <div className="md:w-1/3 p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalData.product.product_name}
                </h2>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Référence</h3>
                    <p className="text-gray-600">{modalData.product.master_code}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">Prix</h3>
                    <p className="text-gray-600">
                      {modalData.product.price ? `${modalData.product.price.toFixed(2)} €` : 'Sur demande'}
                    </p>
                  </div>
                  
                  {modalData.product.brand && (
                    <div>
                      <h3 className="font-medium text-gray-900">Marque</h3>
                      <p className="text-gray-600">{modalData.product.brand}</p>
                    </div>
                  )}
                  
                  {modalData.product.material && (
                    <div>
                      <h3 className="font-medium text-gray-900">Matériau</h3>
                      <p className="text-gray-600">{modalData.product.material}</p>
                    </div>
                  )}
                  
                  {modalData.product.short_description && (
                    <div>
                      <h3 className="font-medium text-gray-900">Description</h3>
                      <p className="text-gray-600">{modalData.product.short_description}</p>
                    </div>
                  )}
                  
                  {/* Color variants in modal */}
                  {getAvailableColors(modalData.product).length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900">Couleurs disponibles</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getAvailableColors(modalData.product).map((color, i) => (
                          <button
                            key={`modal-${modalData.product.master_code}-${color.code}-${i}`}
                            className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-indigo-300 transition-all"
                            style={{
                              backgroundColor: color.hex,
                              ...(selectedVariants[modalData.product.master_code]?.color_code === color.code ? {
                                borderColor: '#6366f1',
                                boxShadow: '0 0 0 2px #818cf8'
                              } : {})
                            }}
                            title={color.name}
                            onClick={() => {
                              handleColorSelect(modalData.product, color);
                              setModalData(prev => ({
                                ...prev,
                                imageIndex: 0
                              }));
                            }}
                            aria-label={`Sélectionner la couleur ${color.name}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FavoritesManager({ token }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_BASE}/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setFavorites(data);
        } else {
          setError(data.message || "Erreur lors du chargement des favoris");
        }
      } catch (err) {
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  const removeFavorite = async (favId) => {
    try {
      const response = await fetch(`${API_BASE}/favorites/${favId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.id !== favId));
      } else {
        const data = await response.json();
        alert(data.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center animate-fade">
        <h2 className="text-lg font-medium text-gray-900">
          Mes produits favoris ({favorites.length})
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin text-indigo-600 text-4xl mb-4" />
            <p className="text-gray-600">Chargement des favoris...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Vous n'avez aucun produit en favoris</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-smooth">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{fav.product_name}</h3>
                    <p className="mt-1 text-xs text-gray-500">Réf: {fav.product_id}</p>
                  </div>
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="text-red-500 hover:text-red-700 transition-smooth p-1"
                    title="Supprimer des favoris"
                  >
                    <FiTrash />
                  </button>
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="bg-gray-100 w-full h-32 flex items-center justify-center text-gray-400">
                    <FiStar className="text-yellow-400 text-2xl" />
                    <span className="ml-2">Image non disponible</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClientsManager({ token }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    siret: "",
    main_contact: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE}/clients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setClients(data);
        } else {
          setError(data.message || "Erreur lors du chargement des clients");
        }
      } catch (err) {
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editClient 
        ? `${API_BASE}/clients/${editClient.id}`
        : `${API_BASE}/clients`;
      
      const method = editClient ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedClients = editClient
          ? clients.map(c => c.id === editClient.id ? { ...c, ...formData } : c)
          : [...clients, await response.json()];
        
        setClients(updatedClients);
        setShowModal(false);
        setEditClient(null);
        setFormData({
          company_name: "",
          siret: "",
          main_contact: "",
          email: "",
          phone: ""
        });
      } else {
        const data = await response.json();
        alert(data.message || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    }
  };

  const handleEdit = (client) => {
    setEditClient(client);
    setFormData({
      company_name: client.company_name,
      siret: client.siret || "",
      main_contact: client.main_contact || "",
      email: client.email || "",
      phone: client.phone || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (clientId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;
    
    try {
      const response = await fetch(`${API_BASE}/clients/${clientId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setClients(clients.filter(c => c.id !== clientId));
      } else {
        const data = await response.json();
        alert(data.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center animate-fade">
        <h2 className="text-lg font-medium text-gray-900">
          Gestion des clients ({clients.length})
        </h2>
        <button
          onClick={() => {
            setEditClient(null);
            setFormData({
              company_name: "",
              siret: "",
              main_contact: "",
              email: "",
              phone: ""
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-smooth"
        >
          <FiPlus />
          <span>Nouveau client</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin text-indigo-600 text-4xl mb-4" />
            <p className="text-gray-600">Chargement des clients...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Aucun client enregistré</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Société
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{client.company_name}</div>
                    {client.siret && (
                      <div className="text-sm text-gray-500">SIRET: {client.siret}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.main_contact || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.email || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.phone || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scale">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editClient ? "Modifier client" : "Nouveau client"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la société *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SIRET
                </label>
                <input
                  type="text"
                  name="siret"
                  value={formData.siret}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact principal
                </label>
                <input
                  type="text"
                  name="main_contact"
                  value={formData.main_contact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-smooth"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-smooth"
                >
                  {editClient ? "Modifier" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function QuotesManager({ token }) {
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    client_id: "",
    products: [{ product_id: "", qty: 1, price_estimate: "" }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quotesRes, clientsRes] = await Promise.all([
          fetch(`${API_BASE}/quotes`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE}/clients`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        const quotesData = await quotesRes.json();
        const clientsData = await clientsRes.json();
        
        if (quotesRes.ok && clientsRes.ok) {
          setQuotes(quotesData);
          setClients(clientsData);
        } else {
          setError("Erreur lors du chargement des données");
        }
      } catch (err) {
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;
    setFormData(prev => ({ ...prev, products: newProducts }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { product_id: "", qty: 1, price_estimate: "" }]
    }));
  };

  const removeProduct = (index) => {
    const newProducts = [...formData.products];
    newProducts.splice(index, 1);
    setFormData(prev => ({ ...prev, products: newProducts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/quotes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const newQuote = await response.json();
        setQuotes([newQuote, ...quotes]);
        setShowModal(false);
        setFormData({
          client_id: "",
          products: [{ product_id: "", qty: 1, price_estimate: "" }]
        });
      } else {
        const data = await response.json();
        alert(data.message || "Erreur lors de la création du devis");
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center animate-fade">
        <h2 className="text-lg font-medium text-gray-900">
          Devis et simulations ({quotes.length})
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-smooth"
        >
          <FiPlus />
          <span>Nouveau devis</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin text-indigo-600 text-4xl mb-4" />
            <p className="text-gray-600">Chargement des devis...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Aucun devis enregistré</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{quote.client}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {quote.products.length} produit{quote.products.length > 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total estimé: {quote.products.reduce((sum, p) => sum + (p.price_estimate || 0) * (p.qty || 1), 0).toFixed(2)} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(quote.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de création de devis */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full animate-scale max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nouveau devis
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client *
                </label>
                <select
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.company_name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Produits *
                  </label>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    + Ajouter un produit
                  </button>
                </div>
                
                {formData.products.map((product, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 mb-3">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Référence produit"
                        value={product.product_id}
                        onChange={(e) => handleProductChange(index, 'product_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Quantité"
                        min="1"
                        value={product.qty}
                        onChange={(e) => handleProductChange(index, 'qty', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Prix unitaire"
                        value={product.price_estimate}
                        onChange={(e) => handleProductChange(index, 'price_estimate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        required
                      />
                    </div>
                    <div className="col-span-2 flex items-center">
                      {formData.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-smooth"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-smooth"
                >
                  Créer le devis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersManager({ token, userRole }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "client",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.message || "Erreur lors du chargement des utilisateurs");
        }
      } catch (err) {
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password && formData.password !== formData.confirmPassword) {
    alert("Les mots de passe ne correspondent pas");
    return;
  }

  try {
    const url = editUser
      ? `${API_BASE}/users/${editUser.id}`
      : `${API_BASE}/users`;

    const method = editUser ? 'PUT' : 'POST';

    const payload = {
      name: formData.name,
      email: formData.email,
      role: formData.role
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const newUser = await response.json();

      const updatedUsers = editUser
        ? users.map(u => u.id === editUser.id ? newUser : u)
        : [...users, newUser];

      setUsers(updatedUsers);
      setShowModal(false);
      setEditUser(null);
      setFormData({
        name: "",
        email: "",
        role: "client",
        password: "",
        confirmPassword: ""
      });
    } else {
      const data = await response.json();
      alert(data.message || "Erreur lors de l'enregistrement");
    }
  } catch (err) {
    alert("Erreur de connexion au serveur");
  }
}; // ✅ ACCOLADE FERMANTE ajoutée ici pour clore handleSubmit correctement



  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
      confirmPassword: ""
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
      } else {
        const data = await response.json();
        alert(data.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center animate-fade">
        <h2 className="text-lg font-medium text-gray-900">
          Gestion des utilisateurs ({users.length})
        </h2>
        {userRole === 'admin' && (
          <button
            onClick={() => {
              setEditUser(null);
              setFormData({
                name: "",
                email: "",
                role: "client",
                password: "",
                confirmPassword: ""
              });
              setShowModal(true);
            }}
            className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-smooth"
          >
            <FiPlus />
            <span>Nouvel utilisateur</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin text-indigo-600 text-4xl mb-4" />
            <p className="text-gray-600">Chargement des utilisateurs...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Aucun utilisateur enregistré</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                {userRole === 'admin' && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'commercial' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' && 'Administrateur'}
                      {user.role === 'commercial' && 'Commercial'}
                      {user.role === 'client' && 'Client'}
                    </span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal d'ajout/modification */}
      {showModal && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scale">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editUser ? "Modifier utilisateur" : "Nouvel utilisateur"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="admin">Administrateur</option>
                  <option value="commercial">Commercial</option>
                  <option value="client">Client</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe {!editUser && '*'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required={!editUser}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe {!editUser && '*'}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required={!editUser}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-smooth"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-smooth"
                >
                  {editUser ? "Modifier" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


export default function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    try {
      if (storedToken) {
        const parsed = JSON.parse(storedToken);
        if (parsed?.value) return parsed;
        if (typeof parsed === "string" && parsed.startsWith("eyJ")) {
          const tokenData = { value: parsed, timestamp: Date.now() };
          localStorage.setItem("token", JSON.stringify(tokenData));
          return tokenData;
        }
      }
      return null;
    } catch {
      if (typeof storedToken === "string" && storedToken.startsWith("eyJ")) {
        const tokenData = { value: storedToken, timestamp: Date.now() };
        localStorage.setItem("token", JSON.stringify(tokenData));
        return tokenData;
      }
      return null;
    }
  });

  const handleLogin = (newToken) => {
    const tokenData = { value: newToken, timestamp: Date.now() };
    setToken(tokenData);
    localStorage.setItem("token", JSON.stringify(tokenData));
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token && Date.now() - token.timestamp > 24 * 60 * 60 * 1000) {
      handleLogout();
    }
  }, [token]);

  return token ? (
    <Dashboard token={token.value} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}