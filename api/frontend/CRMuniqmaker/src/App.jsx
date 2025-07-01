import { useState, useEffect, useRef } from "react";
import { 
  FiLogIn, FiLogOut, FiLoader, FiAlertCircle, FiEye, FiEyeOff, 
  FiSearch, FiX, FiChevronLeft, FiChevronRight, FiUser, FiUsers,
  FiHeart, FiFileText, FiPlus, FiEdit, FiTrash, FiStar, FiShoppingCart
} from "react-icons/fi";

const API_BASE = "http://localhost:5000";

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

function ProductCatalog({ token, userRole }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const searchInputRef = useRef(null);
  const modalRef = useRef(null);

  // Récupération des produits avec images
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE}/products/images/full`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        console.log(data)

        if (response.ok) {
          setProducts(data.products_with_images || []);
        } else {
          setError(data.message || "Erreur lors du chargement des images");
        }
      } catch {
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [token]);

  // Filtrer les produits selon la recherche
  const filteredProducts = products.filter((product) =>
    [product.product_name, product.master_code, product.brand]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Navigation dans la modal (clavier)
  const handleKeyDown = (e) => {
    if (!selectedImage) return;

    if (e.key === "Escape") setSelectedImage(null);
    else if (e.key === "ArrowRight") navigateImage(1);
    else if (e.key === "ArrowLeft") navigateImage(-1);
  };

  // Naviguer entre les images dans la modal
  const navigateImage = (direction) => {
    const newIndex =
      (currentIndex + direction + filteredProducts.length) % filteredProducts.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredProducts[newIndex].images[0]?.url || null);
  };

  // Gérer la modal : mise à jour index image et overflow body + écoute clavier
  useEffect(() => {
    if (selectedImage) {
      const index = filteredProducts.findIndex(
        (p) => p.images[0]?.url === selectedImage
      );
      setCurrentIndex(index);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, filteredProducts]);

  // Fermer la modal en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setSelectedImage(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ajouter un produit aux favoris
  const addToFavorites = async (product) => {
    try {
      const productId = product.master_code || product.id || null;
      if (!productId) {
        alert("Produit invalide");
        return;
      }

      const response = await fetch(`${API_BASE}/favorites`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          product_name: product.product_name || `Produit ${productId}`,
        }),
      });

      if (response.ok) {
        alert("Produit ajouté aux favoris !");
      } else {
        const data = await response.json();
        alert(data.message || "Erreur lors de l'ajout aux favoris");
      }
    } catch {
      alert("Erreur de connexion au serveur");
    }
  };

  const addToCatalog = async (product) => {
  if (!window.confirm("Voulez-vous vraiment ajouter ce produit au catalogue ?"))
    return;

  try {
    const productId = product.master_code || product.id || null;
    if (!productId) {
      alert("Produit invalide");
      return;
    }

const formData = new FormData();
formData.append("name", product.product_name || `Produit ${productId}`);
formData.append("price", 0);
formData.append("category_level1", product.category_level1 || "Catégorie par défaut");
formData.append("category_level2", product.category_level2 || "Sous-catégorie par défaut");
formData.append("category_level3", product.category_level3 || "Sous-sous-catégorie par défaut");
formData.append("description", product.long_description || "Pas de description disponible");
formData.append("stock", 0);
formData.append("image_url", product.images[0]?.url || "");


    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Pas de Content-Type, FormData s'en charge
      },
      body: formData,
    });

    if (response.ok) {
      alert("Produit ajouté au catalogue avec succès !");
    } else {
      const data = await response.json();
      alert(data.message || "Erreur lors de l'ajout au catalogue");
    }
  } catch (error) {
    console.error(error);
    alert("Erreur de connexion au serveur ou lors du traitement");
  }
};



  // Changement de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Composant pagination
  const Pagination = () => {
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <div className="mt-8 flex justify-center animate-fade">
        <nav className="inline-flex items-center space-x-1" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-50 bg-white"
            }`}
          >
            &lt; Précédent
          </button>

          {pages.map((page, idx) =>
            page === "..." ? (
              <span key={`dots-${idx}`} className="px-3 py-1 text-gray-700">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md border text-sm font-medium ${
                  page === currentPage
                    ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-50 bg-white"
            }`}
          >
            Suivant &gt;
          </button>
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* En-tête et barre de recherche */}
      <div className="mb-8 flex justify-between items-center animate-fade" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-lg font-medium text-gray-900">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""}
        </h2>

        <div className="flex items-center space-x-4">
          {/* Sélecteur nombre d’items par page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Produits par page :</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-md px-2 py-1 text-sm"
            >
              {[10, 20, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Barre de recherche */}
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-300 transition-smooth w-full"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  searchInputRef.current.focus();
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-smooth"
                aria-label="Effacer la recherche"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Affichage du contenu */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center animate-fade">
            <FiLoader className="animate-spin text-indigo-600 text-4xl mb-4" />
            <p className="text-gray-600">Chargement du catalogue...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm animate-fade">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 animate-fade">
          <div className="inline-block p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Aucun produit ne correspond à votre recherche</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium transition-smooth hover:underline"
            >
              Réinitialiser la recherche
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Grille des produits */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentItems.map((product, i) => {
    const imageUrl = product.images[0]?.url;
    const reference = product.master_code;
    const name = product.product_name || `Produit ${indexOfFirstItem + i + 1}`;

       // Get category levels dynamically
    const category_level1 = product.category_level1;
    const category_level2 = product.category_level2;
    const category_level3 = product.category_level3;


    console.log("Product:", name);
    console.log("Category Level 1:", category_level1);  // Utilise category_level1 ici
    console.log("Category Level 2:", category_level2);  // Utilise category_level2 ici
    console.log("Category Level 3:", category_level3); 

    return (
      <div
        key={product.master_code || i}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-smooth cursor-pointer group relative animate-fade will-change-transform"
        style={{ animationDelay: `${i * 0.05}s` }}
        onClick={() => imageUrl && setSelectedImage(imageUrl)}
        aria-label={`Voir les détails du produit ${name}`}
      >
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-smooth duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth"></div>
        </div>

        <div className="p-4 text-sm text-gray-700 space-y-1">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          <p><strong>Référence :</strong> {reference || "N/A"}</p>
          {product.brand && <p><strong>Marque :</strong> {product.brand}</p>}
          {product.material && <p><strong>Matériau :</strong> {product.material}</p>}
          {/* Conditionally render category levels */}
           {/* Conditionally render category levels */}
          {category_level1 && (
            <p><strong>Catégorie Niveau 1 :</strong> {category_level1}</p>
          )}
          {category_level2 && (
            <p><strong>Catégorie Niveau 2 :</strong> {category_level2}</p>
          )}
          {category_level3 && (
            <p><strong>Catégorie Niveau 3 :</strong> {category_level3}</p>
          )}

          {product.short_description && (
            <p className="italic text-gray-600 truncate" title={product.short_description}>
              {product.short_description}
            </p>
          )}

          {product.long_description && (
            <p className="text-gray-500 max-h-20 overflow-auto mt-1 whitespace-pre-wrap" title={product.long_description}>
              {product.long_description}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToFavorites(product);
            }}
            className="p-2 bg-white/80 rounded-full hover:bg-white transition-smooth"
            title="Ajouter aux favoris"
            aria-label={`Ajouter ${name} aux favoris`}
          >
            <FiStar className="text-indigo-600" />
          </button>

          {userRole === "admin" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCatalog(product);
              }}
              className="p-2 bg-white/80 rounded-full hover:bg-white transition-smooth"
              title="Ajouter au catalogue"
              aria-label={`Ajouter ${name} au catalogue`}
            >
              <FiPlus className="text-green-600" />
            </button>
          )}
        </div>
      </div>
    );
  })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && <Pagination />}

          {/* Modal d’affichage de l’image */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade"
              aria-modal="true"
              role="dialog"
              aria-labelledby="modal-title"
            >
              <div
                ref={modalRef}
                className="relative max-w-5xl max-h-full mx-4 rounded-xl overflow-hidden shadow-lg bg-gray-900"
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Fermer la fenêtre d’image"
                >
                  <FiX size={24} />
                </button>

                <img
                  src={selectedImage}
                  alt={`Produit agrandi ${currentIndex + 1}`}
                  className="max-h-[80vh] w-auto max-w-full rounded-lg mx-auto block"
                />

                <button
                  onClick={() => navigateImage(-1)}
                  className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Image précédente"
                >
                  <FiChevronLeft size={30} />
                </button>

                <button
                  onClick={() => navigateImage(1)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Image suivante"
                >
                  <FiChevronRight size={30} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
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