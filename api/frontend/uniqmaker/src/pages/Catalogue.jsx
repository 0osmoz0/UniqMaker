import React, { useState, useEffect, useMemo } from "react";
import { FiShoppingCart } from "react-icons/fi";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-current"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.172c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.963c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.963a1 1 0 00-.364-1.118L2.045 9.39c-.783-.57-.38-1.81.588-1.81h4.172a1 1 0 00.95-.69l1.286-3.963z" />
        </svg>
      ))}

      {hasHalfStar && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-current"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGrad)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.172c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.963c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.963a1 1 0 00-.364-1.118L2.045 9.39c-.783-.57-.38-1.81.588-1.81h4.172a1 1 0 00.95-.69l1.286-3.963z"
          />
        </svg>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-current text-gray-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.172c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.963c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.963a1 1 0 00-.364-1.118L2.045 9.39c-.783-.57-.38-1.81.588-1.81h4.172a1 1 0 00.95-.69l1.286-3.963z" />
        </svg>
      ))}
    </div>
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
  const productsPerPage = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Produits reçus :", data);
        // Filtrer uniquement ceux avec image
        const filtered = Array.isArray(data) ? data.filter(p => p.image) : [];
        setProducts(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Construction des catégories à partir des produits
  const categories = useMemo(() => {
    const cats = [];

    products.forEach(p => {
      const level1 = p.category_level1;
      const level2 = p.category_level2;
      const level3 = p.category_level3;

      if (!level1) return; // Ignorer si pas de catégorie niveau 1

      let cat1 = cats.find(c => c.name === level1);
      if (!cat1) {
        cat1 = { name: level1, subcategories: [] };
        cats.push(cat1);
      }

      if (level2) {
        let cat2 = cat1.subcategories.find(s => s.name === level2);
        if (!cat2) {
          cat2 = { name: level2, subsubcategories: [] };
          cat1.subcategories.push(cat2);
        }

        if (level3 && !cat2.subsubcategories.includes(level3)) {
          cat2.subsubcategories.push(level3);
        }
      }
    });

    return cats;
  }, [products]);

  // Filtrer les produits selon les catégories sélectionnées
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      return (
        (selectedCategoryLevel1 ? p.category_level1 === selectedCategoryLevel1 : true) &&
        (selectedCategoryLevel2 ? p.category_level2 === selectedCategoryLevel2 : true) &&
        (selectedCategoryLevel3 ? p.category_level3 === selectedCategoryLevel3 : true)
      );
    });
  }, [products, selectedCategoryLevel1, selectedCategoryLevel2, selectedCategoryLevel3]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  // Handlers pour changer de catégories et page
  const handleCategoryLevel1Change = (val) => {
    setSelectedCategoryLevel1(val || null);
    setSelectedCategoryLevel2(null);
    setSelectedCategoryLevel3(null);
    setPage(1);
  };

  const handleCategoryLevel2Change = (val) => {
    setSelectedCategoryLevel2(val || null);
    setSelectedCategoryLevel3(null);
    setPage(1);
  };

  const handleCategoryLevel3Change = (val) => {
    setSelectedCategoryLevel3(val || null);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleAddToCart = (product) => {
    alert(`Produit ajouté au panier : ${product.name}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">Erreur : {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-8
       text-gray-900">Catalogue</h1>
         {/* Filtres */}
  <div className="flex flex-wrap gap-3 mb-10">
    <select
      onChange={(e) => handleCategoryLevel1Change(e.target.value)}
      value={selectedCategoryLevel1 || ""}
      className="px-4 py-2 rounded-full border font-semibold"
    >
      <option value="">Catégorie principale</option>
      {categories.map((cat, index) => (
        <option key={`cat1-${cat.name}-${index}`} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </select>

    {selectedCategoryLevel1 && (
      <select
        onChange={(e) => handleCategoryLevel2Change(e.target.value)}
        value={selectedCategoryLevel2 || ""}
        className="px-4 py-2 rounded-full border font-semibold"
      >
        <option value="">Sous-catégorie</option>
        {categories
          .find(cat => cat.name === selectedCategoryLevel1)
          ?.subcategories.map((sub, index) => (
            <option key={`cat2-${sub.name}-${index}`} value={sub.name}>
              {sub.name}
            </option>
          ))}
      </select>
    )}

    {selectedCategoryLevel2 && (
      <select
        onChange={(e) => handleCategoryLevel3Change(e.target.value)}
        value={selectedCategoryLevel3 || ""}
        className="px-4 py-2 rounded-full border font-semibold"
      >
        <option value="">Type précis</option>
        {categories
          .find(cat => cat.name === selectedCategoryLevel1)
          ?.subcategories.find(sub => sub.name === selectedCategoryLevel2)
          ?.subsubcategories.map((subsub, index) => (
            <option key={`cat3-${subsub}-${index}`} value={subsub}>
              {subsub}
            </option>
          ))}
      </select>
    )}
  </div>

  {/* Produits */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {paginatedProducts.map((product, index) => (
      <div
        key={product._id || product.id || `prod-${index}`}
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2 flex-grow">{product.description}</p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-indigo-600 font-bold text-lg">{product.price} €</span>
            <button onClick={() => handleAddToCart(product)} className="text-indigo-600">
              <FiShoppingCart size={24} />
            </button>
          </div>
          <div className="mt-2">
            <StarRating rating={product.rating || 0} />
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Pagination */}
  <div className="flex justify-center mt-8 space-x-4">
    <button
      onClick={() => handlePageChange(page - 1)}
      className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
      disabled={page <= 1}
    >
      Précédent
    </button>
    <span className="px-4 py-2 font-semibold">
      Page {page} sur {totalPages}
    </span>
    <button
      onClick={() => handlePageChange(page + 1)}
      className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
      disabled={page >= totalPages}
    >
      Suivant
    </button>
  </div>
</div>
);
};
export default Catalogue;
