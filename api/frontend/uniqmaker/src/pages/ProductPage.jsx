import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiZoomIn, 
  FiCheck, 
  FiShoppingCart, 
  FiStar,
  FiHeart,
  FiShare2,
  FiChevronDown,
  FiTruck,
  FiShield,
  FiTag
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Configuration complète des couleurs avec amélioration visuelle
const COLOR_CONFIG = {
   "Abricot": { hex: "#FBCEB1", text: "text-gray-900" },
  "Anthracite": { hex: "#383E42", text: "text-white" },
  "Anthracite Chine": { hex: "#464646", text: "text-white" },
  "Aqua": { hex: "#00FFFF", text: "text-gray-900" },
  "Argent": { hex: "#C0C0C0", text: "text-gray-900" },
  "Argent Brillant": { hex: "#E6E8FA", text: "text-gray-900" },
  "Argent Mat": { hex: "#B6B6B6", text: "text-gray-900" },
  "Army": { hex: "#4B5320", text: "text-white" },
  "Astral Purple": { hex: "#5D4D7A", text: "text-white" },
  "Beige": { hex: "#F5F5DC", text: "text-gray-900" },
  "Beige Chine": { hex: "#E1C699", text: "text-gray-900" },
  "Beige Fonce": { hex: "#D2B48C", text: "text-gray-900" },
  "Beige/Rouge": { hex: "#F5F5DC", text: "text-gray-900" },
  "Blanc": { hex: "#FFFFFF", text: "text-gray-900", border: "border border-gray-200" },
  "Blanc 2": { hex: "#F8F8FF", text: "text-gray-900" },
  "Blanc Absolu": { hex: "#FFFFFF", text: "text-gray-900", border: "border border-gray-200" },
  "Blanc Cassé": { hex: "#F5F5F5", text: "text-gray-900" },
  "Blanc Chiné": { hex: "#F5F5F5", text: "text-gray-900" },
  "Blanc Recyclé": { hex: "#F5F5F5", text: "text-gray-900" },
  "Blanc Transparent": { hex: "#FFFFFF", text: "text-gray-900", border: "border border-gray-200" },
  "Blanc/Bleu": { hex: "#E6F1F7", text: "text-gray-900" },
  "Blanc/Bleu Foncé": { hex: "#D6E0E7", text: "text-gray-900" },
  "Blanc/Gris": { hex: "#E5E5E5", text: "text-gray-900" },
  "Blanc/Jaune Néon": { hex: "#FFFFCC", text: "text-gray-900" },
  "Blanc/Marine": { hex: "#E6E6FA", text: "text-gray-900" },
  "Blanc/Noir": { hex: "#F2F2F2", text: "text-gray-900" },
  "Blanc/Rouge": { hex: "#FFE6E6", text: "text-gray-900" },
  "Blanc/Turquoise": { hex: "#E0FFFF", text: "text-gray-900" },
  "Bleu": { hex: "#0000FF", text: "text-white" },
  "Bleu Abysse": { hex: "#00008B", text: "text-white" },
  "Bleu Arctique": { hex: "#B0E0E6", text: "text-gray-900" },
  "Bleu Ardoise": { hex: "#6A5ACD", text: "text-white" },
  "Bleu Atoll": { hex: "#00B7EB", text: "text-gray-900" },
  "Bleu Bébé": { hex: "#89CFF0", text: "text-gray-900" },
  "Bleu Canard": { hex: "#007791", text: "text-white" },
  "Bleu Caraibes": { hex: "#1E90FF", text: "text-white" },
  "Bleu Ciel Chine": { hex: "#87CEEB", text: "text-gray-900" },
  "Bleu Clair Transparent": { hex: "#ADD8E6", text: "text-gray-900" },
  "Bleu Cremeux": { hex: "#B0C4DE", text: "text-gray-900" },
  "Bleu Glacier": { hex: "#E1F5FE", text: "text-gray-900" },
  "Bleu Marine": { hex: "#000080", text: "text-white" },
  "Bleu Petrole": { hex: "#005F6A", text: "text-white" },
  "Bleu Royal": { hex: "#4169E1", text: "text-white" },
  "Bleu Transparent": { hex: "#E6F1F7", text: "text-gray-900" },
  "Bleu/Blanc": { hex: "#E6F1F7", text: "text-gray-900" },
  "Bois": { hex: "#966F33", text: "text-white" },
  "Bordeaux": { hex: "#800020", text: "text-white" },
  "Champagne": { hex: "#F7E7CE", text: "text-gray-900" },
  "Chili": { hex: "#E03C31", text: "text-white" },
  "Chocolat": { hex: "#7B3F00", text: "text-white" },
  "Chocolat Fonce": { hex: "#5A3A22", text: "text-white" },
  "Ciel": { hex: "#87CEEB", text: "text-gray-900" },
  "Ciel Piqué": { hex: "#B0E2FF", text: "text-gray-900" },
  "Citron": { hex: "#FFF44F", text: "text-gray-900" },
  "Corail Fluo": { hex: "#FF7F50", text: "text-gray-900" },
  "Corde": { hex: "#BA7C45", text: "text-white" },
  "Couleurs Assorties": { hex: "#FFD700", text: "text-gray-900" },
  "Creme": { hex: "#FFFDD0", text: "text-gray-900" },
  "Cuivré": { hex: "#B87333", text: "text-white" },
  "Denim": { hex: "#1560BD", text: "text-white" },
  "Denim Chine": { hex: "#1E4D6B", text: "text-white" },
  "Ecru": { hex: "#F5F3E5", text: "text-gray-900" },
  "Emeraude": { hex: "#50C878", text: "text-white" },
  "Folk Pink Twin": { hex: "#FFB6C1", text: "text-gray-900" },
  "Folk Red Twin": { hex: "#FF0000", text: "text-white" },
  "French Marine": { hex: "#3B5998", text: "text-white" },
  "French Marine 2": { hex: "#3B5998", text: "text-white" },
  "French Marine/Blanc": { hex: "#3B5998", text: "text-white" },
  "Fuchsia": { hex: "#FF00FF", text: "text-white" },
  "Fuchsia Transparent": { hex: "#FF00FF", text: "text-white" },
  "Fuschia Fluo": { hex: "#FF00FF", text: "text-white" },
  "Gris": { hex: "#808080", text: "text-white" },
  "Gris 2": { hex: "#A9A9A9", text: "text-gray-900" },
  "Gris Anthracite": { hex: "#383E42", text: "text-white" },
  "Gris Carbone": { hex: "#625D5D", text: "text-white" },
  "Gris Chiné": { hex: "#A9A9A9", text: "text-gray-900" },
  "Gris Chiné II": { hex: "#A9A9A9", text: "text-gray-900" },
  "Gris Chiné Recyclé": { hex: "#A9A9A9", text: "text-gray-900" },
  "Gris Clair": { hex: "#D3D3D3", text: "text-gray-900" },
  "Gris Fonce": { hex: "#696969", text: "text-white" },
  "Gris Foncé/Gris": { hex: "#696969", text: "text-white" },
  "Gris Metal": { hex: "#A8A8A8", text: "text-gray-900" },
  "Gris Pierre": { hex: "#8B8B8B", text: "text-white" },
  "Gris Pur": { hex: "#808080", text: "text-white" },
  "Gris Souris": { hex: "#9E9E9E", text: "text-gray-900" },
  "Gris Transparent": { hex: "#D3D3D3", text: "text-gray-900" },
  "Hibiscus": { hex: "#B43757", text: "text-white" },
  "Ivoire": { hex: "#FFFFF0", text: "text-gray-900" },
  "Jaune": { hex: "#FFFF00", text: "text-gray-900" },
  "Jaune Clair": { hex: "#FFFFE0", text: "text-gray-900" },
  "Jaune Fluo": { hex: "#FFFF00", text: "text-gray-900" },
  "Jaune Pâle": { hex: "#FFFF99", text: "text-gray-900" },
  "Jaune Transparent": { hex: "#FFFFE0", text: "text-gray-900" },
  "Kaki": { hex: "#C3B091", text: "text-gray-900" },
  "Kaki Chiné": { hex: "#C3B091", text: "text-gray-900" },
  "Kaki Foncé": { hex: "#8B864E", text: "text-white" },
  "Lilas": { hex: "#C8A2C8", text: "text-gray-900" },
  "Lime": { hex: "#00FF00", text: "text-gray-900" },
  "Lime Fluo": { hex: "#32CD32", text: "text-gray-900" },
  "Linen Twin": { hex: "#FAF0E6", text: "text-gray-900" },
  "Marine": { hex: "#000080", text: "text-white" },
  "Marine Recyclé": { hex: "#000080", text: "text-white" },
  "Marron": { hex: "#800000", text: "text-white" },
  "Multicolore": { hex: "#FFD700", text: "text-gray-900" },
  "Naturel": { hex: "#F5DEB3", text: "text-gray-900" },
  "Noir": { hex: "#000000", text: "text-white" },
  "Noir 2": { hex: "#0A0A0A", text: "text-white" },
  "Noir Profond": { hex: "#000000", text: "text-white" },
  "Noir Recyclé": { hex: "#000000", text: "text-white" },
  "Noir/Blanc": { hex: "#000000", text: "text-white" },
  "Noir/Bleu": { hex: "#000000", text: "text-white" },
  "Noir/Lime": { hex: "#000000", text: "text-white" },
  "Noir/Rouge": { hex: "#000000", text: "text-white" },
  "Or": { hex: "#FFD700", text: "text-gray-900" },
  "Or Mat": { hex: "#D4AF37", text: "text-gray-900" },
  "Orange": { hex: "#FFA500", text: "text-gray-900" },
  "Orange 2": { hex: "#FF8C00", text: "text-gray-900" },
  "Orange Brulee": { hex: "#CC5500", text: "text-white" },
  "Orange Fluo": { hex: "#FFA500", text: "text-gray-900" },
  "Orange Transparent": { hex: "#FFA500", text: "text-gray-900" },
  "Outremer": { hex: "#120A8F", text: "text-white" },
  "Oxblood Chine": { hex: "#800020", text: "text-white" },
  "Peche": { hex: "#FFDAB9", text: "text-gray-900" },
  "Petrole": { hex: "#005F6A", text: "text-white" },
  "Pool Blue": { hex: "#7CB9E8", text: "text-gray-900" },
  "Pop Orange": { hex: "#FF9F00", text: "text-gray-900" },
  "Ribbon Pink": { hex: "#FFC0CB", text: "text-gray-900" },
  "Rose": { hex: "#FF007F", text: "text-white" },
  "Rose Bonbon": { hex: "#F9429E", text: "text-white" },
  "Rose Bébé": { hex: "#F4C2C2", text: "text-gray-900" },
  "Rose Chine": { hex: "#E75480", text: "text-white" },
  "Rose Cremeux": { hex: "#FFE4E1", text: "text-gray-900" },
  "Rose Fluo 2": { hex: "#FF007F", text: "text-white" },
  "Rose Moyen": { hex: "#C21E56", text: "text-white" },
  "Rose Orchidée": { hex: "#DA70D6", text: "text-white" },
  "Rose Pâle": { hex: "#FFD1DC", text: "text-gray-900" },
  "Rose Transparent": { hex: "#FFE4E1", text: "text-gray-900" },
  "Rouge": { hex: "#FF0000", text: "text-white" },
  "Rouge 2": { hex: "#DC143C", text: "text-white" },
  "Rouge Piment": { hex: "#FF0000", text: "text-white" },
  "Rouge Recyclé": { hex: "#FF0000", text: "text-white" },
  "Rouge Tango": { hex: "#FF4D00", text: "text-white" },
  "Rouge Transparent": { hex: "#FF0000", text: "text-white" },
  "Rouge Vif": { hex: "#FF0000", text: "text-white" },
  "Royal": { hex: "#4169E1", text: "text-white" },
  "Royal 3": { hex: "#4169E1", text: "text-white" },
  "Royal Recyclé": { hex: "#4169E1", text: "text-white" },
  "Sable": { hex: "#F4A460", text: "text-gray-900" },
  "Taupe": { hex: "#483C32", text: "text-white" },
  "Terracotta": { hex: "#E2725B", text: "text-white" },
  "Terre": { hex: "#E2725B", text: "text-white" },
  "Tilleul": { hex: "#BAB86C", text: "text-gray-900" },
  "Titanium": { hex: "#878681", text: "text-white" },
  "Transparent": { hex: "#FFFFFF", text: "text-gray-900", border: "border border-gray-200" },
  "Turquoise": { hex: "#40E0D0", text: "text-gray-900" },
  "Vert": { hex: "#008000", text: "text-white" },
  "Vert 2": { hex: "#00FF00", text: "text-gray-900" },
  "Vert Armée Vert": { hex: "#4B5320", text: "text-white" },
  "Vert Bouteille": { hex: "#006A4E", text: "text-white" },
  "Vert Clair Chine": { hex: "#90EE90", text: "text-gray-900" },
  "Vert Cremeux": { hex: "#8FBC8F", text: "text-gray-900" },
  "Vert Empire": { hex: "#245336", text: "text-white" },
  "Vert Fluo": { hex: "#00FF00", text: "text-gray-900" },
  "Vert Foncé": { hex: "#023020", text: "text-white" },
  "Vert Foncé 2": { hex: "#013220", text: "text-white" },
  "Vert Foret": { hex: "#228B22", text: "text-white" },
  "Vert Glace": { hex: "#C1E1C1", text: "text-gray-900" },
  "Vert Golf": { hex: "#008000", text: "text-white" },
  "Vert Lime Transparent": { hex: "#00FF00", text: "text-gray-900" },
  "Vert Menthe": { hex: "#3EB489", text: "text-white" },
  "Vert Pomme": { hex: "#8DB600", text: "text-white" },
  "Vert Prairie": { hex: "#7CFC00", text: "text-gray-900" },
  "Vert Prairie /Blanc": { hex: "#7CFC00", text: "text-gray-900" },
  "Vert Printemps": { hex: "#00FF7F", text: "text-gray-900" },
  "Vert Sapin": { hex: "#0A5C36", text: "text-white" },
  "Vert Transparent": { hex: "#90EE90", text: "text-gray-900" },
  "Vieux Rose": { hex: "#C08081", text: "text-white" },
  "Violet": { hex: "#8A2BE2", text: "text-white" },
  "Violet Clair": { hex: "#EE82EE", text: "text-gray-900" },
  "Violet Fonce": { hex: "#9400D3", text: "text-white" },
  "Violet Transparent": { hex: "#EE82EE", text: "text-gray-900" },
  "Zinc": { hex: "#7D7D7D", text: "text-white" }
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [zoomImage, setZoomImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Chargement des données du produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/products/${id}`);
        if (!response.ok) throw new Error('Produit non trouvé');
        
        const data = await response.json();
        setProduct(data);
        setMainImage(data.image);
        
        // Sélection automatique de la première couleur disponible
        if (data.colors_json?.length > 0) {
          setSelectedColor(data.colors_json[0]);
        }

        // Charger les produits similaires
        const similarResponse = await fetch(`http://localhost:5001/products/${id}/similar`);
        if (similarResponse.ok) {
          const similarData = await similarResponse.json();
          setSimilarProducts(similarData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  function parseJsonField(field) {
    if (!field) return null;
    if (typeof field !== 'string') return field;
    
    try {
      return JSON.parse(field);
    } catch (e) {
      if (typeof field === 'string' && field.includes(',')) {
        return field.split(',').map(item => item.trim()).filter(Boolean);
      }
      return field;
    }
  }

  // Organise les images par couleur
  const { allImages, imagesByColor, availableColors } = useMemo(() => {
    if (!product) return { allImages: [], imagesByColor: {}, availableColors: [] };

    const allImages = [];
    const imagesByColor = {};
    const colors = new Set();

    // Image principale
    if (product.image) {
      allImages.push({
        url: product.image,
        color: null
      });
    }

    // Images supplémentaires
    const additionalImages = parseJsonField(product.images_json);
    if (Array.isArray(additionalImages)) {
      additionalImages.forEach(img => {
        if (img?.url) {
          allImages.push({
            url: img.url,
            color: img.color || null
          });
        }
      });
    }

    // Images par couleur
    const colorImagesData = parseJsonField(product.images_by_color_json);
    
    if (Array.isArray(colorImagesData)) {
      colorImagesData.forEach(item => {
        if (item.color && item.images) {
          imagesByColor[item.color] = item.images.map(url => ({
            url,
            color: item.color
          }));
          colors.add(item.color);
        }
      });
    } else if (typeof colorImagesData === 'object') {
      Object.entries(colorImagesData).forEach(([color, urls]) => {
        if (color && urls) {
          imagesByColor[color] = urls.map(url => ({
            url,
            color
          }));
          colors.add(color);
        }
      });
    }

    // Couleurs disponibles
    const productColors = parseJsonField(product.colors_json);
    if (Array.isArray(productColors)) {
      productColors.forEach(color => {
        if (color && color !== "Non spécifié") {
          colors.add(color);
        }
      });
    }

    imagesByColor['all'] = [...allImages];

    return {
      allImages,
      imagesByColor,
      availableColors: Array.from(colors)
    };
  }, [product]);

  // Images à afficher
  const displayedImages = useMemo(() => {
    const colorKey = selectedColor || 'all';
    return (imagesByColor[colorKey] || [])
      .filter(img => img?.url && typeof img.url === 'string')
      .map(img => img.url);
  }, [selectedColor, imagesByColor]);

  // Met à jour l'image principale
  useEffect(() => {
    if (displayedImages.length > 0) {
      setMainImage(displayedImages[0]);
      setCurrentImageIndex(0);
    }
  }, [displayedImages]);

  // Navigation entre images
  const navigateImage = (direction) => {
    setCurrentImageIndex(prev => {
      const newIndex = direction === 'next' 
        ? (prev + 1) % displayedImages.length
        : (prev - 1 + displayedImages.length) % displayedImages.length;
      
      setMainImage(displayedImages[newIndex]);
      return newIndex;
    });
  };

  // Sélection d'une couleur
  const selectColor = (color) => {
    setSelectedColor(prev => prev === color ? null : color);
  };

  // Gestion de la quantité
  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      if (newQuantity < 1) return 1;
      if (newQuantity > (product.stock || 10)) return product.stock || 10;
      return newQuantity;
    });
  };

  // Animation pour les transitions
  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Chargement du produit...</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-lg">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Produit non disponible</h2>
        <p className="text-gray-600 mb-6">{error || 'Le produit demandé n\'existe pas ou n\'est plus disponible'}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          Retour aux produits
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Barre de navigation supérieure */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div>
                  <button 
                    onClick={() => navigate('/')} 
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg className="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="sr-only">Accueil</span>
                  </button>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <button 
                    onClick={() => navigate('/products')} 
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Boutique
                  </button>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500 line-clamp-1">
                    {product.category_level1 || 'Catégorie'}
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-blue-600 line-clamp-1">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Colonne Gallery */}
          <div className="lg:w-1/2 space-y-6">
            {/* Image principale avec navigation et zoom */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
              <div 
                className="relative w-full aspect-square cursor-zoom-in"
                onClick={() => setZoomImage(mainImage)}
              >
                <AnimatePresence custom={1} initial={false}>
                  <motion.div
                    key={currentImageIndex}
                    custom={1}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute inset-0 flex items-center justify-center bg-white"
                  >
                    <LazyLoadImage
                      src={mainImage}
                      alt={`${product.name} ${selectedColor ? `- ${selectedColor}` : ''}`}
                      effect="blur"
                      className="w-full h-full object-contain p-8"
                      onError={() => setMainImage('/placeholder-product.jpg')}
                      placeholderSrc="/placeholder-product.jpg"
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation entre images */}
                {displayedImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('prev');
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Image précédente"
                    >
                      <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('next');
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Image suivante"
                    >
                      <FiChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                {/* Indicateur de zoom */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiZoomIn className="mr-1" />
                  <span>Zoom</span>
                </div>
                
                {/* Indicateur de position */}
                {displayedImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {displayedImages.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Actions sur l'image */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-full shadow-md transition-all ${
                    isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:text-red-500'
                  }`}
                  aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button 
                  className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-blue-600 transition-colors"
                  aria-label="Partager ce produit"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Miniatures */}
            {displayedImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                {displayedImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === img ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setMainImage(img);
                      setCurrentImageIndex(idx);
                    }}
                  >
                    <LazyLoadImage
                      src={img}
                      alt={`Vue ${idx + 1}`}
                      effect="blur"
                      className="w-20 h-20 object-cover"
                      placeholderSrc="/placeholder-product.jpg"
                    />
                    {mainImage === img && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <FiCheck className="text-white w-5 h-5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colonne Info */}
          <div className="lg:w-1/2 space-y-6">
            {/* En-tête */}
            <div>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium mb-3">
                Ref: {product.reference || id}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i}
                        className={`w-5 h-5 ${i < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({product.reviewCount || 0} avis)</span>
                </div>
                
                <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  Écrire un avis
                </span>
              </div>
            </div>

            {/* Prix et promotions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    {product.price?.toFixed(2)} €
                  </span>
                  {product.originalPrice && (
                    <div className="flex items-center mt-1">
                      <span className="text-lg text-gray-500 line-through mr-2">
                        {product.originalPrice.toFixed(2)} €
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 10 ? 'bg-green-100 text-green-800'
                    : product.stock > 0 ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                  </span>
                  
                  {product.stock > 0 && product.stock < 5 && (
                    <span className="text-xs text-red-600 font-medium">
                      Plus que quelques pièces !
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <FiTruck className="mr-2 text-blue-500" />
                <span>Livraison gratuite sous 2-3 jours ouvrés</span>
              </div>
              
              {product.originalPrice && (
                <div className="mt-3 flex items-center text-sm text-gray-600">
                  <FiTag className="mr-2 text-green-500" />
                  <span>Économisez {(product.originalPrice - product.price).toFixed(2)} €</span>
                </div>
              )}
            </div>

            {/* Sélecteur de couleurs amélioré */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">COULEURS DISPONIBLES</h3>
                  {selectedColor && (
                    <span className="text-xs text-gray-500">
                      Sélection: <span className="font-medium">{selectedColor}</span>
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color) => {
                    const config = COLOR_CONFIG[color] || { hex: '#CCCCCC', text: 'text-gray-900' };
                    const isSelected = selectedColor === color;
                    
                    return (
                      <button
                        key={color}
                        className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all transform ${
                          isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 shadow-md' : 'hover:scale-105 hover:shadow-sm'
                        } ${config.border || ''}`}
                        onClick={() => selectColor(color)}
                        aria-label={`Sélectionner la couleur ${color}`}
                        style={{ backgroundColor: config.hex }}
                        data-tooltip={color}
                      >
                        {isSelected && (
                          <div className={`absolute -top-2 -right-2 bg-blue-500 rounded-full p-1 ${config.text}`}>
                            <FiCheck className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sélecteur de taille (optionnel) */}
            {product.sizes && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">TAILLES DISPONIBLES</h3>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`py-2 px-3 border rounded-lg text-center transition-all ${
                        selectedSize === size 
                          ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <a href="#" className="inline-block text-xs text-blue-600 hover:underline mt-1">
                  Guide des tailles
                </a>
              </div>
            )}

            {/* Quantité et CTA */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 bg-white w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    disabled={quantity >= (product.stock || 10)}
                  >
                    +
                  </button>
                </div>
                
                <span className="text-sm text-gray-500">
                  {product.stock || 10} disponible{product.stock !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                  disabled={product.stock === 0}
                  className={`w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center ${
                    product.stock === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 shadow-md hover:shadow-lg'
                  }`}
                >
                  <FiShoppingCart className="mr-3" />
                  {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                </button>
                
                <button 
                  disabled={product.stock === 0}
                  className={`w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center ${
                    product.stock === 0 
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                      : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg'
                  }`}
                  onClick={() => navigate(`/products/${id}/personnaliser`, {
                    state: {
                      productData: product,
                      selectedColor,
                      selectedSize
                    }
                  })}
                >
                  {product.stock > 0 ? 'Personnaliser maintenant' : 'Indisponible'}
                </button>
              </div>
              
              <div className="flex items-center justify-center text-sm text-gray-500">
                <FiShield className="mr-2 text-green-500" />
                <span>Paiement sécurisé • Retours faciles</span>
              </div>
            </div>

            {/* Description avec lecture plus/moins */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                {product.description?.length > 200 && (
                  <button 
                    onClick={() => setExpandedDescription(!expandedDescription)}
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    {expandedDescription ? 'Voir moins' : 'Voir plus'}
                    <FiChevronDown className={`ml-1 transition-transform ${expandedDescription ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              
              <div className={`text-gray-700 ${expandedDescription ? '' : 'line-clamp-3'}`}>
                {product.description || 'Aucune description disponible pour ce produit.'}
              </div>
            </div>

            {/* Caractéristiques avec accordéon */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {[
                { title: 'Détails du produit', content: [
                  product.material && `Matériau: ${product.material}`,
                  product.dimensions && `Dimensions: ${product.dimensions}`,
                  product.weight && `Poids: ${product.weight}`
                ].filter(Boolean) },
                { title: 'Livraison et retours', content: [
                  'Livraison gratuite en France métropolitaine',
                  'Retours acceptés sous 30 jours',
                  'Emballage écologique'
                ] },
                { title: 'Entretien', content: [
                  'Lavage en machine à 30°C',
                  'Ne pas utiliser de javel',
                  'Repasser à basse température'
                ] }
              ].map((section, idx) => (
                <div key={idx} className="border-b border-gray-200 last:border-b-0">
                  <button className="w-full px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <span>{section.title}</span>
                    <FiChevronDown className="text-gray-400 transition-transform" />
                  </button>
                  <div className="px-5 pb-4 pt-1 bg-gray-50">
                    <ul className="space-y-2 text-gray-700">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section des images spécifiques à la couleur */}
        {selectedColor && imagesByColor[selectedColor]?.length > 0 && (
          <section className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Variante <span className="text-blue-600">{selectedColor}</span>
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {imagesByColor[selectedColor].length} visualisations
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagesByColor[selectedColor].map((img, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white cursor-pointer"
                  onClick={() => {
                    setMainImage(img.url);
                    setCurrentImageIndex(displayedImages.findIndex(i => i === img.url));
                  }}
                >
                  <LazyLoadImage
                    src={img.url}
                    alt={`${selectedColor} variant ${idx + 1}`}
                    effect="blur"
                    className="w-full h-64 object-contain p-6"
                    placeholderSrc="/placeholder-product.jpg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-80 p-2 rounded-full">
                      <FiZoomIn className="text-gray-800 w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Section recommandations */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Produits similaires</h2>
          {similarProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <LazyLoadImage
                      src={product.image || '/placeholder-product.jpg'}
                      alt={product.name}
                      effect="blur"
                      className="w-full h-full object-contain p-4"
                      placeholderSrc="/placeholder-product.jpg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-blue-600 font-bold mt-2">{product.price?.toFixed(2)} €</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun produit similaire trouvé</p>
          )}
        </section>
      </div>

      {/* Modal de zoom */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-6xl max-h-screen"
            >
              <img
                src={zoomImage}
                alt="Zoom"
                className="max-w-full max-h-screen object-contain"
              />
              <button 
                className="absolute top-4 right-4 bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-30 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomImage(null);
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeJoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;