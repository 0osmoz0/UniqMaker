import React, { useState, useEffect, useMemo, useRef } from "react";
import { FiShoppingCart, FiChevronDown, FiChevronUp, FiFilter, FiX, FiSearch, FiHeart, FiStar } from "react-icons/fi";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ReactLoading from 'react-loading';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";

// Composant StarRating amélioré avec animations
const StarRating = ({ rating }) => {
  const stars = Array(5).fill(0);
  
  return (
    <div className="flex items-center">
      {stars.map((_, i) => {
        const starValue = i + 1;
        let fillPercentage = 0;
        
        if (rating >= starValue) {
          fillPercentage = 100;
        } else if (rating > starValue - 1) {
          fillPercentage = (rating - (starValue - 1)) * 100;
        }
        
        return (
          <div key={i} className="relative w-5 h-5 mr-1">
            <div className="absolute inset-0 text-gray-300">
              <FiStar className="w-full h-full" />
            </div>
            <motion.div 
              className="absolute inset-0 text-yellow-400 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${fillPercentage}%` }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <FiStar className="w-5 h-5 fill-current" />
            </motion.div>
          </div>
        );
      })}
      <span className="ml-1 text-sm text-gray-500">({Math.floor(Math.random() * 100)})</span>
    </div>
  );
};

// Composant ProductCard séparé pour une meilleure gestion
const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-gray-100 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      {product.stock <= 10 && product.stock > 0 && (
        <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          Stock limité
        </div>
      )}
      {product.stock === 0 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          Rupture
        </div>
      )}
      {product.isNew && (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          Nouveau
        </div>
      )}

      {/* Image avec effet de zoom */}
      <div className="relative overflow-hidden h-64 w-full">
        <LazyLoadImage
          src={product.image}
          alt={product.name}
          effect="blur"
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          wrapperClassName="w-full h-full"
        />
        
        {/* Bouton favori */}
        <button 
          className={`absolute top-3 right-3 p-2 rounded-full ${isLiked ? 'bg-pink-100 text-pink-500' : 'bg-white text-gray-400'} shadow-sm transition-colors duration-300 z-10`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-2">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            {product.category_level1}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-indigo-600 font-bold text-xl">
                {product.price.toFixed(2)} €
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            <span className={`text-xs font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <StarRating rating={product.rating || 0} />
            
            <motion.button
              id={`add-to-cart-${product._id}`}
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className={`p-2 rounded-full ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'} transition-colors duration-300`}
              whileTap={product.stock > 0 ? { scale: 0.9 } : {}}
              title={product.stock === 0 ? "Produit en rupture" : "Ajouter au panier"}
            >
              <FiShoppingCart size={18} />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Overlay au survol */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

const Catalogue = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryLevel1, setSelectedCategoryLevel1] = useState(null);
  const [selectedCategoryLevel2, setSelectedCategoryLevel2] = useState(null);
  const [selectedCategoryLevel3, setSelectedCategoryLevel3] = useState(null);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const productsPerPage = 12;
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        
        let data = await response.json();
        data = Array.isArray(data) ? data.filter(p => p.image) : [];
        
        // Ajout de données simulées pour le design
        data = data.map(p => ({
          ...p,
          isNew: Math.random() > 0.7,
          originalPrice: Math.random() > 0.5 ? p.price * 1.2 : null,
          rating: p.rating || (Math.random() * 3 + 2).toFixed(1),
          stock: p.stock || Math.floor(Math.random() * 50)
        }));
        
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Construction des catégories
  const categories = useMemo(() => {
    const cats = [];

    products.forEach(p => {
      const level1 = p.category_level1;
      const level2 = p.category_level2;
      const level3 = p.category_level3;

      if (!level1) return;

      let cat1 = cats.find(c => c.name === level1);
      if (!cat1) {
        cat1 = { name: level1, subcategories: [], count: 0 };
        cats.push(cat1);
      }
      cat1.count++;

      if (level2) {
        let cat2 = cat1.subcategories.find(s => s.name === level2);
        if (!cat2) {
          cat2 = { name: level2, subsubcategories: [], count: 0 };
          cat1.subcategories.push(cat2);
        }
        cat2.count++;

        if (level3 && !cat2.subsubcategories.includes(level3)) {
          cat2.subsubcategories.push(level3);
        }
      }
    });

    return cats.sort((a, b) => b.count - a.count);
  }, [products]);

  // Filtrer et trier les produits
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category_level1?.toLowerCase().includes(query) ||
        p.category_level2?.toLowerCase().includes(query)
  )}
    
    // Filtre par catégorie
    result = result.filter(p => {
      return (
        (selectedCategoryLevel1 ? p.category_level1 === selectedCategoryLevel1 : true) &&
        (selectedCategoryLevel2 ? p.category_level2 === selectedCategoryLevel2 : true) &&
        (selectedCategoryLevel3 ? p.category_level3 === selectedCategoryLevel3 : true)
      );
    });
    
    // Tri
    switch (sortOption) {
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price);
      case 'rating':
        return result.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return result;
    }
  }, [products, searchQuery, selectedCategoryLevel1, selectedCategoryLevel2, selectedCategoryLevel3, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  // Handlers
  const handleCategoryChange = (level, value) => {
    if (level === 1) {
      setSelectedCategoryLevel1(value || null);
      setSelectedCategoryLevel2(null);
      setSelectedCategoryLevel3(null);
    } else if (level === 2) {
      setSelectedCategoryLevel2(value || null);
      setSelectedCategoryLevel3(null);
    } else {
      setSelectedCategoryLevel3(value || null);
    }
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    const button = document.getElementById(`add-to-cart-${product._id}`);
    if (button) {
      button.classList.add('animate-ping');
      setTimeout(() => button.classList.remove('animate-ping'), 500);
    }
    
    // Notification toast simulée
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center';
    toast.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      ${product.name} ajouté au panier
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const resetFilters = () => {
    setSelectedCategoryLevel1(null);
    setSelectedCategoryLevel2(null);
    setSelectedCategoryLevel3(null);
    setSearchQuery('');
    setSortOption('default');
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center">
          <ReactLoading type="spinningBubbles" color="#6366F1" height={80} width={80} />
          <p className="mt-6 text-lg font-medium text-gray-600">Chargement des produits...</p>
          <p className="text-sm text-gray-500 mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-3 text-xl font-bold text-gray-900">Erreur de chargement</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" ref={containerRef}>
      {/* Navigation fixe */}
      <motion.header 
        style={{ y }}
        className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">UniqMaker</h1>
            <nav className="hidden md:flex ml-10 space-x-8">
              <a href="#" className="text-gray-900 font-medium hover:text-indigo-600 transition-colors">Accueil</a>
              <a href="#" className="text-gray-900 font-medium hover:text-indigo-600 transition-colors">Catalogue</a>
              <a href="#" className="text-gray-900 font-medium hover:text-indigo-600 transition-colors">Nouveautés</a>
              <a href="#" className="text-gray-900 font-medium hover:text-indigo-600 transition-colors">Promotions</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <button className="p-2 text-gray-600 hover:text-indigo-600 relative">
              <FiShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            <button className="md:hidden p-2 text-gray-600 hover:text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section avec parallax */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-95"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Découvrez notre collection exclusive</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Des produits soigneusement sélectionnés pour leur qualité et leur design
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Barre de recherche mobile */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher des produits..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>

        {/* Filtres et tris */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiFilter />
              <span className="font-medium">{showFilters ? 'Masquer' : 'Filtres'}</span>
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {(selectedCategoryLevel1 || selectedCategoryLevel2 || selectedCategoryLevel3 || searchQuery) && (
              <button 
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <FiX size={16} />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">Trier par :</span>
            <select 
              className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
              <option value="newest">Nouveautés</option>
            </select>
          </div>
        </div>

        {/* Filtres détaillés */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Catégorie niveau 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie principale</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    <button
                      onClick={() => handleCategoryChange(1, null)}
                      className={`w-full text-left px-4 py-2 rounded-lg ${!selectedCategoryLevel1 ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-50'}`}
                    >
                      Toutes les catégories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={`cat1-${cat.name}`}
                        onClick={() => handleCategoryChange(1, cat.name)}
                        className={`w-full text-left px-4 py-2 rounded-lg flex justify-between items-center ${selectedCategoryLevel1 === cat.name ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-50'}`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catégorie niveau 2 */}
                {selectedCategoryLevel1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sous-catégorie</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      <button
                        onClick={() => handleCategoryChange(2, null)}
                        className={`w-full text-left px-4 py-2 rounded-lg ${!selectedCategoryLevel2 ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-50'}`}
                      >
                        Toutes les sous-catégories
                      </button>
                      {categories
                        .find(cat => cat.name === selectedCategoryLevel1)
                        ?.subcategories.map((sub) => (
                          <button
                            key={`cat2-${sub.name}`}
                            onClick={() => handleCategoryChange(2, sub.name)}
                            className={`w-full text-left px-4 py-2 rounded-lg flex justify-between items-center ${selectedCategoryLevel2 === sub.name ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-50'}`}
                          >
                            <span>{sub.name}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {sub.count}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Catégorie niveau 3 */}
                {selectedCategoryLevel2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type précis</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      <button
                        onClick={() => handleCategoryChange(3, null)}
                        className={`w-full text-left px-4 py-2 rounded-lg ${!selectedCategoryLevel3 ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-50'}`}
                      >
                        Tous les types
                      </button>
                      {categories
                        .find(cat => cat.name === selectedCategoryLevel1)
                        ?.subcategories.find(sub => sub.name === selectedCategoryLevel2)
                        ?.subsubcategories.map((subsub) => (
                          <button
                            key={`cat3-${subsub}`}
                            onClick={() => handleCategoryChange(3, subsub)}
                            className={`w-full text-left px-4 py-2 rounded-lg ${selectedCategoryLevel3 === subsub ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-50'}`}
                          >
                            {subsub}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Résultats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
          </h2>
          {(selectedCategoryLevel1 || selectedCategoryLevel2 || selectedCategoryLevel3) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategoryLevel1 && (
                <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                  {selectedCategoryLevel1}
                  <button 
                    onClick={() => handleCategoryChange(1, null)}
                    className="ml-1.5 text-indigo-500 hover:text-indigo-700"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              )}
              {selectedCategoryLevel2 && (
                <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                  {selectedCategoryLevel2}
                  <button 
                    onClick={() => handleCategoryChange(2, null)}
                    className="ml-1.5 text-indigo-500 hover:text-indigo-700"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              )}
              {selectedCategoryLevel3 && (
                <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                  {selectedCategoryLevel3}
                  <button 
                    onClick={() => handleCategoryChange(3, null)}
                    className="ml-1.5 text-indigo-500 hover:text-indigo-700"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Produits */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
            <p className="mt-1 text-gray-500 mb-6">Essayez de modifier vos critères de recherche</p>
            <button 
              onClick={resetFilters}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard 
                  key={product._id || product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={page <= 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    «
                  </button>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Précédent
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg border ${page === pageNum ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Suivant
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page >= totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    »
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Abonnez-vous à notre newsletter</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Recevez en exclusivité nos offres spéciales et nouveautés
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-grow px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-opacity-90 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">LUXURYSHOP</h3>
            <p className="mb-4">Votre destination premium pour des produits d'exception.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Acheter</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Tous les produits</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nouveautés</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Promotions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Meilleures ventes</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Informations</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Livraison</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Paiement sécurisé</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Service client</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Retours</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Conditions générales</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} LUXURYSHOP. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Catalogue;