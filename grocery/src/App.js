import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Datagrid from './Components/Datagrid';
import ProductDetails from './Components/ProductDetails'; // Import your details component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Datagrid />} />
        <Route path="/product-details" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
