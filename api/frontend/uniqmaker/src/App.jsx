import { useState, useEffect } from "react";
import { FiLogIn, FiLogOut, FiLoader, FiAlertCircle, FiEye, FiEyeOff, FiSearch } from "react-icons/fi";

const API_BASE = "http://localhost:5000";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        onLogin(data.token);
      } else {
        setError(data.message || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-700 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Bienvenue</h1>
            <p className="text-indigo-100 mt-2">Connectez-vous à votre espace</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="flex items-center bg-red-50 text-red-600 p-3 rounded-lg">
                <FiAlertCircle className="mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="email@exemple.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                  autoFocus
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <FiLogIn className="mr-2" />
                    Se connecter
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-gray-500">
              Pas encore de compte ?{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Contactez l'administrateur
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center text-white text-sm">
          <p>© 2023 MonApplication. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}

function Catalog({ token, onLogout }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/products/images`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setImages(data.images || []);
        } else {
          setError(data.message || "Erreur lors du chargement des images");
          if (res.status === 401) {
            onLogout();
          }
        }
      } catch (e) {
        setError("Erreur de connexion au serveur");
      }
      setLoading(false);
    }
    fetchImages();
  }, [token, onLogout]);

  const filteredImages = images.filter(image =>
    image.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-indigo-700">Catalogue Produits</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition"
              >
                <FiLogOut />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <FiLoader className="animate-spin text-indigo-600 text-4xl mb-4" />
              <p className="text-gray-600">Chargement du catalogue...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {filteredImages.length} {filteredImages.length > 1 ? 'produits' : 'produit'} trouvé(s)
              </h2>
            </div>
            
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun produit ne correspond à votre recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredImages.map((url, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer group"
                    onClick={() => setSelectedImage(url)}
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                      <img
                        src={url}
                        alt={`Produit ${i + 1}`}
                        className="w-full h-48 object-cover group-hover:opacity-90 transition"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">Produit {i + 1}</h3>
                      <p className="mt-1 text-xs text-gray-500">Réf: {url.split('/').pop().split('.')[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Produit en grand"
              className="max-h-[80vh] w-full object-contain rounded-lg"
            />
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
      // Si le token est stocké comme objet JSON
      if (storedToken) {
        const parsed = JSON.parse(storedToken);
        if (parsed && parsed.value) {
          return parsed;
        }
        // Si c'est juste le token JWT (ancien format)
        if (typeof parsed === "string" && parsed.startsWith("eyJ")) {
          const tokenData = {
            value: parsed,
            timestamp: new Date().getTime()
          };
          localStorage.setItem("token", JSON.stringify(tokenData));
          return tokenData;
        }
      }
      return null;
    } catch (e) {
      // Si le parsing échoue mais que c'est un JWT valide (ancien format)
      if (typeof storedToken === "string" && storedToken.startsWith("eyJ")) {
        const tokenData = {
          value: storedToken,
          timestamp: new Date().getTime()
        };
        localStorage.setItem("token", JSON.stringify(tokenData));
        return tokenData;
      }
      return null;
    }
  });

  const handleLogin = (newToken) => {
    const tokenData = {
      value: newToken,
      timestamp: new Date().getTime()
    };
    setToken(tokenData);
    localStorage.setItem("token", JSON.stringify(tokenData));
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token) {
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      const isExpired = new Date().getTime() - token.timestamp > TWENTY_FOUR_HOURS;
      if (isExpired) {
        handleLogout();
      }
    }
  }, [token]);

  return token ? (
    <Catalog token={token.value} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}