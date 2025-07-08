import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Catalogue from '../pages/Catalogue';
import ProductPage from '../pages/ProductPage';
import PersonaliserPage from '../pages/PersonaliserPage';

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Catalogue />} />
      <Route path="/products/:id" element={<ProductPage />} />
      <Route path="/products/:id/personnaliser" element={<PersonaliserPage />} />
    </Routes>
  );
};

export default Router;