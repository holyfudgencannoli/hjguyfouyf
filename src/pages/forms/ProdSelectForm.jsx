import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProdSelectForm() {
  const [formData, setFormData] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('myFormData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setFormData(data);
        fetchProducts(data.batch_id);
      } catch (err) {
        console.error('Invalid localStorage JSON:', err);
      }
    }
  }, []);

  const fetchProducts = async (batch_id) => {
    try {
      const res = await fetch(`http://localhost:5000/products-by-batch?batch_id=${batch_id}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const toggleProductSelection = (prod_id) => {
    setSelectedProductIds((prev) =>
      prev.includes(prod_id)
        ? prev.filter((id) => id !== prod_id)
        : [...prev, prod_id]
    );
  };

  const handleNextStep = () => {
    const updated = {
      ...formData,
      prod_ids: selectedProductIds,
    };
    localStorage.setItem('myFormData', JSON.stringify(updated));
    navigate('/confirm-contam');
  };

  return (
    <div id="prod-select" className="form">
      <div id="title">
        <h1>SELECT PRODUCT IDs</h1>
      </div>

      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.prod_id}>
              <label>
                <input
                  type="checkbox"
                  value={product.prod_id}
                  checked={selectedProductIds.includes(product.prod_id)}
                  onChange={() => toggleProductSelection(product.prod_id)}
                />
                {product.spec_label}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading or no products available</p>
      )}

      <button onClick={handleNextStep}>Next</button>
    </div>
  );
}
