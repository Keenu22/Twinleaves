import {
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Datagrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [sortModel, setSortModel] = useState([
    { field: 'price', sort: 'asc' },
  ]);

  const navigate = useNavigate();

  const containerStyle = useMemo(
    () => ({
      textAlign: 'center',
    }),
    []
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        const productsData = Array.isArray(response.data.products)
          ? response.data.products
          : [];
        const productsWithId = productsData.map((product, index) => ({
          ...product,
          id: product.id || index,
          activation_date: product.activation_date
            ? new Date(product.activation_date)
            : 'Invalid Date',
          deactivation_date: product.deactivation_date
            ? new Date(product.deactivation_date)
            : 'Invalid Date',
          price: product.price || 0,
        }));
        setProducts(productsWithId);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Use useCallback to debounce search changes
  const debouncedHandleSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    [] // Empty array because debounce does not depend on any values from the component state.
  );
  const handleSearch = (event) => {
    debouncedHandleSearch(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? product.main_category === category : true)
  );

  const handleSortModelChange = (model) => {
    setSortModel(model);
  };

  const handleRowClick = (params) => {
    navigate(`/product-details?id=${params.row.id}`);
  };

  return (
    <Container className="bg-secondary" style={containerStyle}>
      <Typography
        variant="h3"
        style={{ fontFamily: 'Arial, sans-serif', margin: '20px 0' }}
      >
        Product Catalog
      </Typography>
      <TextField
        label="Search by Name"
        variant="outlined"
        onChange={handleSearch}
        style={{ marginBottom: '20px', marginRight: '20px' }}
      />
      <FormControl
        variant="outlined"
        style={{ minWidth: 120, marginBottom: '20px' }}
      >
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={handleCategoryChange}
          label="Category"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Array.from(
            new Set(products.map((product) => product.main_category))
          ).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div style={{ height: 600, width: '100%', backgroundColor: '#F5F5DC' }}>
          <DataGrid
            rows={filteredProducts}
            columns={[
              { field: 'id', headerName: 'ID', width: 70 },
              {
                field: 'image',
                headerName: 'Image',
                width: 150,
                renderCell: () => (
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Product"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                    }}
                    loading="lazy"
                  />
                ),
              },
              { field: 'brand', headerName: 'Brand', width: 130 },
              { field: 'name', headerName: 'Name', width: 250 },
              { field: 'description', headerName: 'Description', width: 300 },
              { field: 'sku_code', headerName: 'SKU Code', width: 130 },
              {
                field: 'activation_date',
                headerName: 'Activation Date',
                width: 180,
              },
              {
                field: 'deactivation_date',
                headerName: 'Deactivation Date',
                width: 180,
              },
              { field: 'price', headerName: 'Price', width: 100, type: 'number' },
            ]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            pagination
            page={page}
            onPageChange={(params) => setPage(params.page)}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </div>
      )}
      {error && <Snackbar open autoHideDuration={6000} message={error} />}
    </Container>
  );
};

export default Datagrid;
