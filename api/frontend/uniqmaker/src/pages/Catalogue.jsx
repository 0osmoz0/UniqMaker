import React, { useState, useMemo } from "react";
import { FiShoppingCart } from "react-icons/fi";

const allProducts = [
  {
    id: 1,
    name: "T-shirt classique noir",
    price: 19.99,
    image: "https://mistertee.com/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/t/s/ts001-black-front.jpg",
    description: "Un t-shirt noir basique, confortable et polyvalent.",
    category: "T-shirts",
    stock: 12,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Sweat à capuche gris",
    price: 39.99,
    image: "https://mistertee.com/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/h/o/hoodie-gray-front.jpg",
    description: "Sweat à capuche doux avec poche kangourou.",
    category: "Sweats",
    stock: 0,
    rating: 4.2,
  },
  {
    id: 3,
    name: "Casquette snapback rouge",
    price: 15.99,
    image: "https://mistertee.com/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/c/a/cap-red-front.jpg",
    description: "Casquette stylée pour un look urbain.",
    category: "Accessoires",
    stock: 5,
    rating: 4.8,
  },
  {
    id: 4,
    name: "T-shirt imprimé vintage",
    price: 24.99,
    image: "https://mistertee.com/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/t/s/ts-vintage-front.jpg",
    description: "T-shirt avec impression rétro tendance.",
    category: "T-shirts",
    stock: 7,
    rating: 3.9,
  },
  {
    id: 5,
    name: "Sweatshirt à capuche noir",
    price: 45.99,
    image: "https://mistertee.com/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/h/o/hoodie-black-front.jpg",
    description: "Sweatshirt confortable pour toutes saisons.",
    category: "Sweats",
    stock: 3,
    rating: 4.7,
  },
  {
    id: 6,
    name: "Casquette trucker blanche",
    price: 17.99,
    image: "https://mistertee.com/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/c/a/cap-white-front.jpg",
    description: "Casquette classique style trucker.",
    category: "Accessoires",
    stock: 10,
    rating: 4.3,
  },
];

// Composant étoiles (rating)
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={"full" + i}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-current"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.172c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.963c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.963a1 1 0 00-.364-1.118L2.045 9.39c-.783-.57-.38-1.81.588-1.81h4.172a1 1 0 00.95-.69l1.286-3.963z" />
        </svg>
      ))}
      {halfStar && (
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
          key={"empty" + i}
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
  const [category, setCategory] = useState("Tous");
  const [page, setPage] = useState(1);
  const productsPerPage = 4;

  const categories = useMemo(() => {
    const cats = allProducts.reduce((acc, p) => {
      if (!acc.includes(p.category)) acc.push(p.category);
      return acc;
    }, []);
    return ["Tous", ...cats];
  }, []);

  const filteredProducts = useMemo(() => {
    if (category === "Tous") return allProducts;
    return allProducts.filter(p => p.category === category);
  }, [category]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Catalogue de Produits</h1>

      {/* Filtre catégories */}
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full border font-semibold transition-colors ${
              category === cat
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <div className="overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
                loading="lazy"
              />
            </div>

            <div className="p-4 flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm flex-grow">{product.description}</p>

              <div className="mt-3 flex items-center justify-between">
                <StarRating rating={product.rating} />
                <span
                  className={`font-bold text-lg ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? "En stock" : "Rupture"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-indigo-600 font-extrabold text-xl">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  disabled={product.stock === 0}
                  onClick={() => alert(`Produit ajouté au panier: ${product.name}`)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-semibold transition-colors ${
                    product.stock > 0
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FiShoppingCart size={20} />
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12 gap-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md border ${
            page === 1 ? "text-gray-400 border-gray-300 cursor-not-allowed" : "border-indigo-600 text-indigo-600"
          }`}
        >
          Précédent
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 rounded-md border ${
              page === i + 1
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-indigo-600 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-md border ${
            page === totalPages ? "text-gray-400 border-gray-300 cursor-not-allowed" : "border-indigo-600 text-indigo-600"
          }`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Catalogue;
