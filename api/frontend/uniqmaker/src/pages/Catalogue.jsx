import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiChevronDown, 
  FiChevronUp, 
  FiFilter, 
  FiX, 
  FiSearch, 
  FiHeart, 
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiDownload
} from "react-icons/fi";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ReactLoading from 'react-loading';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";

const colorNameToHex = (colorName) => {
  if (!colorName) return "#CCCCCC";

  const colors = {
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
  
  const trimmedColor = colorName.toString().trim();
  return colors[trimmedColor] || "#CCCCCC";
};

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

const DevisPopup = ({ product, onClose, onSubmit }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [companyInfo, setCompanyInfo] = useState({
    siret: '',
    companyName: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    billingAddress: '',
    deliveryAddress: '',
    sameAddress: true
  });
  const [loadingSiret, setLoadingSiret] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [sendCopy, setSendCopy] = useState(true);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001';
  const userToken = localStorage.getItem('token');

  const parseJsonField = (field) => {
  if (!field) return [];
  
  // Si c'est déjà un tableau ou un objet, retournez-le directement
  if (typeof field === 'object') return field;
  
  try {
    return JSON.parse(field);
  } catch (e) {
    console.error("Error parsing JSON field:", e);
    return [];
  }
};

  const { allImages, imagesByColor } = useMemo(() => {
    const allImages = [];
    const imagesByColor = {};

    if (product.image) {
      allImages.push({
        url: product.image,
        color: null
      });
    }

    const additionalImages = parseJsonField(product.images_json);
    additionalImages.forEach(img => {
      if (img?.url) {
        allImages.push({
          url: img.url,
          color: img.color || null
        });
      }
    });

    const colorImagesData = parseJsonField(product.images_by_color_json);
    
    if (Array.isArray(colorImagesData)) {
      colorImagesData.forEach(item => {
        if (item.color && item.images) {
          imagesByColor[item.color] = item.images.map(url => ({
            url,
            color: item.color
          }));
        }
      });
    } else if (typeof colorImagesData === 'object') {
      Object.entries(colorImagesData).forEach(([color, urls]) => {
        if (color && urls) {
          imagesByColor[color] = urls.map(url => ({
            url,
            color
          }));
        }
      });
    }

    imagesByColor['all'] = [...allImages];
    return { allImages, imagesByColor };
  }, [product]);

  const availableColors = useMemo(() => {
    const colors = new Set();

    Object.keys(imagesByColor).forEach(color => {
      if (color && color !== 'all') {
        colors.add(color);
      }
    });

    const productColors = parseJsonField(product.colors_json);
    productColors.forEach(color => {
      if (color && color !== "Non spécifié") {
        colors.add(color);
      }
    });

    return Array.from(colors);
  }, [product.colors_json, imagesByColor]);

  const displayedImages = useMemo(() => {
    const colorKey = selectedColor || 'all';
    return (imagesByColor[colorKey] || [])
      .filter(img => img?.url && typeof img.url === 'string')
      .map(img => img.url);
  }, [selectedColor, imagesByColor]);

  const navigateImage = (direction) => {
    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % displayedImages.length;
      }
      return (prev - 1 + displayedImages.length) % displayedImages.length;
    });
  };

  const fetchCompanyInfo = async (siret) => {
    if (siret.length < 14) return;
    
    setLoadingSiret(true);
    try {
      const response = await fetch(`${API_BASE}/api/company-info?siret=${siret}`);
      const data = await response.json();
      
      if (data.success) {
        setCompanyInfo(prev => ({
          ...prev,
          companyName: data.company.name || '',
          billingAddress: data.company.address || '',
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des infos SIRET:", error);
    } finally {
      setLoadingSiret(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    const devisData = {
      product: {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        quantity,
        color: selectedColor,
        image: displayedImages[currentImageIndex] || product.image,
        description: product.description,
        reference: product.reference || 'N/A',
        specifications: product.specifications || {}
      },
      companyInfo: {
        companyName: companyInfo.companyName,
        firstName: companyInfo.firstName,
        lastName: companyInfo.lastName,
        email: companyInfo.email,
        phone: companyInfo.phone,
        billingAddress: companyInfo.billingAddress,
        deliveryAddress: companyInfo.sameAddress ? companyInfo.billingAddress : companyInfo.deliveryAddress
      },
      client_reference: companyInfo.siret ? `CLI-${companyInfo.siret.slice(-6)}` : 'N/A',
      sendCopy
    };

    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      }

      const response = await fetch(`${API_BASE}/api/devis`, {
        method: 'POST',
        headers,
        body: JSON.stringify(devisData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi du devis");
      }

      setSendSuccess(true);
      setPdfUrl(result.pdf_url);
      onSubmit(result);
      
      if (sendCopy && result.pdf_url) {
        window.open(result.pdf_url, '_blank');
      }

      setTimeout(() => {
        onClose();
      }, 5000);

    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Demande de devis</h3>
              <p className="text-indigo-100">Remplissez les informations pour recevoir votre devis personnalisé</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              disabled={isSending}
            >
              <FiX size={24} />
            </button>
          </div>
          
          {!isSending && !sendSuccess && (
            <div className="flex mt-6 border-b border-white/20">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-white border-b-2 border-white' : 'text-indigo-200'}`}
              >
                Détails du produit
              </button>
              <button
                onClick={() => setActiveTab('company')}
                className={`px-4 py-2 font-medium ${activeTab === 'company' ? 'text-white border-b-2 border-white' : 'text-indigo-200'}`}
              >
                Informations société
              </button>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          )}

          {isSending ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-lg font-medium text-gray-600">Envoi en cours...</p>
              <p className="text-sm text-gray-500 mt-2">Génération du devis PDF</p>
            </div>
          ) : sendSuccess ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Devis créé avec succès !</h3>
              <p className="text-gray-600 mb-6">
                Un email de confirmation a été envoyé à <span className="font-medium">{companyInfo.email}</span>.
              </p>
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <FiDownload className="mr-2" />
                  Télécharger le PDF
                </a>
              )}
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Fermer
              </button>
            </div>
          ) : activeTab === 'details' ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="bg-gray-50 rounded-lg overflow-hidden relative h-64 flex items-center justify-center">
                  {displayedImages.length > 0 ? (
                    <>
                      <img 
                        src={displayedImages[currentImageIndex]} 
                        alt={product.name}
                        className="max-h-full w-auto object-contain"
                      />
                      {displayedImages.length > 1 && (
                        <>
                          <button
                            onClick={() => navigateImage('prev')}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-70 rounded-full shadow-md z-10 hover:bg-opacity-90 transition-opacity"
                          >
                            <FiChevronLeft className="w-5 h-5 text-gray-800" />
                          </button>
                          <button
                            onClick={() => navigateImage('next')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-70 rounded-full shadow-md z-10 hover:bg-opacity-90 transition-opacity"
                          >
                            <FiChevronRight className="w-5 h-5 text-gray-800" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <FiImage className="w-16 h-16" />
                      <span className="mt-2">Image non disponible</span>
                    </div>
                  )}
                </div>

                {availableColors.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Couleur sélectionnée</label>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color, index) => (
                        <button
                          key={index}
                          className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'} shadow-sm hover:scale-110 transition-transform`}
                          style={{ backgroundColor: color }}
                          title={color}
                          onClick={() => {
                            setSelectedColor(color);
                            setCurrentImageIndex(0);
                          }}
                        />
                      ))}
                    </div>
                    {selectedColor && (
                      <p className="mt-2 text-sm text-gray-600">Couleur : {selectedColor}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h4>
                  {product.reference && (
                    <p className="text-sm text-gray-500">Référence : {product.reference}</p>
                  )}
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 mb-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-2">Description</h5>
                  <p>{product.description || "Aucune description disponible."}</p>
                </div>

                {product.specifications && (
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-800 mb-2">Caractéristiques</h5>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key} className="flex">
                          <span className="font-medium text-gray-700 w-1/2">{key}:</span>
                          <span className="text-gray-600">{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Prix unitaire</p>
                      <p className="text-lg font-bold text-indigo-600">{product.price.toFixed(2)} €</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FiChevronDown />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FiChevronUp />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{(product.price * quantity).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total TTC</span>
                      <span className="text-indigo-600">{(product.price * quantity * 1.2).toFixed(2)} €</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setActiveTab('company')}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Continuer vers les informations
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6">Informations de facturation</h4>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SIRET (facultatif)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={companyInfo.siret}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 14);
                          setCompanyInfo({...companyInfo, siret: value});
                          if (value.length === 14) fetchCompanyInfo(value);
                        }}
                        placeholder="123 456 789 00000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {loadingSiret && (
                        <div className="absolute right-3 top-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'entreprise*</label>
                    <input
                      type="text"
                      value={companyInfo.companyName}
                      onChange={(e) => setCompanyInfo({...companyInfo, companyName: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom*</label>
                      <input
                        type="text"
                        value={companyInfo.firstName}
                        onChange={(e) => setCompanyInfo({...companyInfo, firstName: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom*</label>
                      <input
                        type="text"
                        value={companyInfo.lastName}
                        onChange={(e) => setCompanyInfo({...companyInfo, lastName: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email*</label>
                    <input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone*</label>
                    <input
                      type="tel"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6">Adresse de facturation</h4>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse*</label>
                    <textarea
                      value={companyInfo.billingAddress}
                      onChange={(e) => setCompanyInfo({...companyInfo, billingAddress: e.target.value})}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      checked={companyInfo.sameAddress}
                      onChange={(e) => setCompanyInfo({...companyInfo, sameAddress: e.target.checked})}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sameAddress" className="ml-3 block text-sm text-gray-700">
                      Utiliser la même adresse pour la livraison
                    </label>
                  </div>

                  {!companyInfo.sameAddress && (
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Adresse de livraison</h4>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse de livraison</label>
                      <textarea
                        value={companyInfo.deliveryAddress}
                        onChange={(e) => setCompanyInfo({...companyInfo, deliveryAddress: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Votre sélection</h5>
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {displayedImages.length > 0 ? (
                          <img 
                            src={displayedImages[currentImageIndex]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiImage className="w-full h-full text-gray-400 p-2" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {selectedColor && (
                          <p className="text-sm text-gray-600">Couleur: {selectedColor}</p>
                        )}
                        <p className="text-sm text-gray-600">Quantité: {quantity}</p>
                        <p className="text-sm font-bold">Total TTC: {(product.price * quantity * 1.2).toFixed(2)} €</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendCopy"
                      checked={sendCopy}
                      onChange={(e) => setSendCopy(e.target.checked)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sendCopy" className="ml-3 block text-sm text-gray-700">
                      Recevoir une copie du devis par email
                    </label>
                  </div>

                  <div className="pt-4">
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Retour
                      </button>
                      <button
                        type="submit"
                        disabled={isSending}
                        className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isSending ? 'Envoi en cours...' : 'Envoyer la demande'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {!isSending && !sendSuccess && (
          <div className="bg-gray-50 p-4 border-t border-gray-200 text-center text-sm text-gray-500">
            Votre demande sera traitée dans les plus brefs délais. Un email de confirmation vous sera envoyé.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};


const ProductCard = ({ product, onCreateDevis }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();


  const handleCardClick = () => {
    navigate(`/products/${product.id}`); // ✅ corriger ici
  };


  const parseJsonField = (field) => {
  if (!field) return [];
  
  // Si c'est déjà un tableau ou un objet, retournez-le directement
  if (typeof field === 'object') return field;
  
  try {
    return JSON.parse(field);
  } catch (e) {
    console.error("Error parsing JSON field:", e);
    return [];
  }
};

  const { allImages, imagesByColor } = useMemo(() => {
  const allImages = [];
  const imagesByColor = {};

  // Gestion de l'image principale
  if (product.image) {
    allImages.push({
      url: product.image,
      color: null
    });
  }

  // Gestion des images supplémentaires
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

  // Gestion des images par couleur
  const colorImagesData = parseJsonField(product.images_by_color_json);
  
  if (colorImagesData && typeof colorImagesData === 'object') {
    Object.entries(colorImagesData).forEach(([color, urls]) => {
      if (color && urls) {
        if (!Array.isArray(urls)) {
          // Si ce n'est pas un tableau, essayez de le convertir
          urls = [urls].filter(Boolean);
        }
        
        imagesByColor[color] = urls.map(url => ({
          url,
          color
        }));
      }
    });
  }

  imagesByColor['all'] = [...allImages];
  return { allImages, imagesByColor };
}, [product.image, product.images_json, product.images_by_color_json]);

  const availableColors = useMemo(() => {
    const colors = new Set();

    Object.keys(imagesByColor).forEach(color => {
      if (color && color !== 'all') {
        colors.add(color);
      }
    });

    const productColors = parseJsonField(product.colors_json);
    productColors.forEach(color => {
      if (color && color !== "Non spécifié") {
        colors.add(color);
      }
    });

    return Array.from(colors);
  }, [product.colors_json, imagesByColor]);

  const displayedImages = useMemo(() => {
    const colorKey = selectedColor || 'all';
    return (imagesByColor[colorKey] || [])
      .filter(img => img?.url && typeof img.url === 'string')
      .map(img => img.url);
  }, [selectedColor, imagesByColor]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(false);
    setImageLoading(true);
  }, [displayedImages]);

  const navigateImage = (direction, e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % displayedImages.length;
      }
      return (prev - 1 + displayedImages.length) % displayedImages.length;
    });
  };

  const selectColor = (color, e) => {
    e.stopPropagation();
    setSelectedColor(prev => prev === color ? null : color);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer relative bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-gray-100 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)"
      }}
    >
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

      <div className="relative overflow-hidden h-64 w-full">
        {displayedImages.length > 0 && !imageError ? (
          <>
            <LazyLoadImage
              src={displayedImages[currentImageIndex]}
              alt={product.name}
              effect="blur"
              className={`w-full h-full object-cover transition-transform duration-200 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ transform: isHovered ? "scale(1.03)" : "scale(1)" }}
              wrapperClassName="w-full h-full"
              onError={handleImageError}
              onLoad={handleImageLoad}
              placeholderSrc="/placeholder-product.jpg"
            />

            {displayedImages.length > 1 && (
              <>
                <button
                  onClick={(e) => navigateImage('prev', e)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-70 rounded-full shadow-md z-10 hover:bg-opacity-90 transition-opacity"
                >
                  <FiChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={(e) => navigateImage('next', e)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-70 rounded-full shadow-md z-10 hover:bg-opacity-90 transition-opacity"
                >
                  <FiChevronRight className="w-5 h-5 text-gray-800" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <FiImage className="text-gray-400 w-12 h-12" />
          </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-2">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            {product.category_level1}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        {availableColors.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Couleurs disponibles :</div>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color, index) => (
                <button
                  key={index}
                  className={`w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform ${
                    selectedColor === color ? 'ring-2 ring-indigo-600' : ''
                  }`}
                  style={{ backgroundColor: colorNameToHex(color) }}
                  title={color}
                  onClick={(e) => selectColor(color, e)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-indigo-600 font-bold text-xl">
                {product.price?.toFixed(2)} €
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            <span className={`text-xs font-medium ${
              product.stock > 10 ? 'text-green-600'
              : product.stock > 0 ? 'text-yellow-600'
              : 'text-red-600'
            }`}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FiStar className="text-yellow-400 mr-1" />
              <span className="text-sm text-gray-500">
                {product.rating || '0.0'}
              </span>
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onCreateDevis(product);
              }}
              disabled={product.stock === 0}
              className={`p-2 rounded-full ${
                product.stock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              } transition-colors duration-300`}
              whileTap={product.stock > 0 ? { scale: 0.9 } : {}}
              title={product.stock === 0 ? "Produit en rupture" : "Créer un devis"}
            >
              <FiShoppingCart size={18} />
            </motion.button>
          </div>
        </div>
      </div>
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
  const [devisProduct, setDevisProduct] = useState(null);
  const [devisSent, setDevisSent] = useState(false);
  const productsPerPage = 12;
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

const parseJsonField = (field) => {
  if (!field) return [];
  
  // Si c'est déjà un tableau ou un objet, retournez-le directement
  if (typeof field === 'object') return field;
  
  try {
    return JSON.parse(field);
  } catch (e) {
    console.error("Error parsing JSON field:", e);
    return [];
  }
};

useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      
      let data = await response.json();
      
      // Assurez-vous que data est un tableau
      if (!Array.isArray(data)) {
        throw new Error("Les données reçues ne sont pas un tableau");
      }
      
      // Filtrez les produits sans image
      data = data.filter(p => p.image || (p.images_json && parseJsonField(p.images_json).length > 0));
      
      setProducts(data);
    } catch (err) {
      console.error("Erreur de chargement:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

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

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category_level1?.toLowerCase().includes(query) ||
        p.category_level2?.toLowerCase().includes(query) ||
        (p.color && p.color.toLowerCase().includes(query))
      );
    }
    
    result = result.filter(p => {
      return (
        (selectedCategoryLevel1 ? p.category_level1 === selectedCategoryLevel1 : true) &&
        (selectedCategoryLevel2 ? p.category_level2 === selectedCategoryLevel2 : true) &&
        (selectedCategoryLevel3 ? p.category_level3 === selectedCategoryLevel3 : true)
      );
    });
    
    switch (sortOption) {
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price);
      case 'rating':
        return result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      default:
        return result;
    }
  }, [products, searchQuery, selectedCategoryLevel1, selectedCategoryLevel2, selectedCategoryLevel3, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

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

  const handleCreateDevis = (product) => {
    setDevisProduct(product);
    setDevisSent(false);
  };

  const handleSubmitDevis = async (devisData) => {
    try {
      const response = await fetch(`${API_BASE}/api/devis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devisData),
      });

      if (response.ok) {
        setDevisSent(true);
        setTimeout(() => {
          setDevisProduct(null);
          setDevisSent(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du devis:", error);
    }
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

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
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
                  onCreateDevis={handleCreateDevis}
                />
              ))}
            </div>

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

      {devisProduct && (
        <DevisPopup 
          product={devisProduct}
          onClose={() => setDevisProduct(null)}
          onSubmit={handleSubmitDevis}
        />
      )}

      {devisSent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Votre demande de devis a bien été envoyée
        </motion.div>
      )}
    </div>
  );
}; 

export default Catalogue;