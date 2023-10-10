import React, { useState, useEffect } from 'react';
import './Home.css';
import { createStock, getStocks, Update } from '../Api/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStockName, setNewStockName] = useState('');
  const [newStockPrice, setNewStockPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [stocksPerPage] = useState(5); // Number of stocks to display per page

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await getStocks();

        if (response.status === 200) {
          const responseData = response.data;
          const stocksArray = responseData.Stocks || [];

          setStocks(stocksArray);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    const updateStockPricesRandomly = () => {
      const updatedStocks = stocks.map(async (stock) => {
        const randomPriceChange = (Math.random() - 0.5) * 10;
        const newPrice = stock.Price + randomPriceChange;

        try {
          const response = await Update(stock._id, { Price: newPrice });

          if (response.status === 200) {
            return { ...stock, Price: newPrice };
          } else {
            console.log('Failed to update stock price');
            return stock;
          }
        } catch (error) {
          console.error('Error updating stock price', error);
          return stock;
        }
      });

      Promise.all(updatedStocks).then((updatedStocksArray) => {
        setStocks(updatedStocksArray);
      });
    };

    const priceUpdateInterval = setInterval(updateStockPricesRandomly, 3000);

    return () => {
      clearInterval(priceUpdateInterval);
    };
  }, [stocks]);

  const handleNewStockClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddNewStock = async () => {
    if (newStockName.trim() === '' || isNaN(newStockPrice)) {
      alert('Please enter a valid name and price for the new stock.');
      return;
    }

    try {
      const newStock = {
        name: newStockName,
        Price: parseFloat(newStockPrice),
      };

      const response = await createStock(newStock);

      if (response.status === 201) {
        setNewStockName('');
        setNewStockPrice('');

        toast.success('New stock has been added successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        console.log('Failed to create a new stock');

        toast.error('Failed to create a new stock', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error creating a new stock', error);
    }
  };

  // Calculate the range of stocks to display on the current page
  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = stocks.slice(indexOfFirstStock, indexOfLastStock);

  // Function to change the current page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`home-container ${isModalOpen ? 'blur-background' : ''}`}>
      <div className="header">
        <span>
          <button className="new-stock-button" onClick={handleNewStockClick}>
            New Stock
          </button>
        </span>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {currentStocks.map((stock) => (
            <tr key={stock._id}>
              <td>{stock._id}</td>
              <td>{stock.name}</td>
              <td>${stock.Price ? stock.Price.toFixed(2) : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(stocks.length / stocksPerPage) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
      {isModalOpen && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Stock</h2>
            <input
              type="text"
              id="newStockName"
              placeholder="Name"
              value={newStockName}
              onChange={(e) => setNewStockName(e.target.value)}
            />
            <input
              type="text"
              id="newStockPrice"
              placeholder="Price"
              value={newStockPrice}
              onChange={(e) => setNewStockPrice(e.target.value)}
            />
            <div>
              <button onClick={handleAddNewStock}>Add</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Home;
