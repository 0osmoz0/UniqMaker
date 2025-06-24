import { useState } from "react";
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck, FiX } from "react-icons/fi";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import './index.css';

const API_BASE = "http://localhost:5000";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordRequirements = [
    { id: 1, text: "6 caractères minimum", validator: (val) => val.length >= 6 },
    { id: 2, text: "1 majuscule", validator: (val) => /[A-Z]/.test(val) },
    { id: 3, text: "1 caractère spécial", validator: (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val) }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.status === 201) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/20 backdrop-blur-sm"
        >
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl mb-6 border border-green-200/50">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FiCheck className="text-white text-2xl" />
            </motion.div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Inscription réussie !</h2>
            <p className="text-green-600">Votre compte a été créé avec succès.</p>
          </div>
          <p className="text-gray-600 mb-6">
            Vous pouvez maintenant accéder à votre espace client.
          </p>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/uniqmaker"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            Se connecter <FiArrowRight className="ml-2" />
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md w-full border border-white/20"
      >
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ rotate: 5 }}
            className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md"
          >
            <FiUser className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h1>
          <p className="text-gray-500">Rejoignez notre plateforme dès maintenant</p>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start border border-red-100"
            >
              <FiX className="flex-shrink-0 mt-0.5 mr-2" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiUser />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-gray-300"
                required
                placeholder="Jean Dupont"
              />
            </motion.div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiMail />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-gray-300"
                required
                placeholder="jean.dupont@exemple.com"
              />
            </motion.div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiLock />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-gray-300"
                required
                minLength="6"
                placeholder="••••••••"
              />
            </motion.div>

            <AnimatePresence>
              {passwordFocused && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1 overflow-hidden"
                >
                  {passwordRequirements.map(req => (
                    <div key={req.id} className="flex items-center text-sm">
                      {req.validator(formData.password) ? (
                        <FiCheck className="text-green-500 mr-2" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 mr-2" />
                      )}
                      <span className={req.validator(formData.password) ? "text-green-600" : "text-gray-500"}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiLock />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-gray-300"
                required
                minLength="6"
                placeholder="••••••••"
              />
            </motion.div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création en cours...
              </span>
            ) : (
              "S'inscrire maintenant"
            )}
          </motion.button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Vous avez déjà un compte?{" "}
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/uniqmaker"
              className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Connectez-vous ici
            </motion.a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default App;