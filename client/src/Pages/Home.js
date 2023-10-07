import React, { useState, useEffect } from 'react';
import './Home.css'; 
import { createStock, getStocks, Update } from '../Api/Api';

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStockName, setNewStockName] = useState('');
  const [newStockPrice, setNewStockPrice] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await getStocks();

        if (response.status === 200) {
          const responseData = response.data; // Assuming the data object has the structure { Stocks: [] }
          const stocksArray = responseData.Stocks || []; // Extract the Stocks array

          setStocks(stocksArray);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    // Function to update stock prices randomly
    const updateStockPricesRandomly = () => {
      const updatedStocks = stocks.map(async (stock) => {
        const randomPriceChange = (Math.random() - 0.5) * 10; // Generate a random price change
        const newPrice = stock.Price + randomPriceChange;

        try {
          // Make an API call to update the stock price
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

    // Update stock prices randomly every 3 seconds
    const priceUpdateInterval = setInterval(updateStockPricesRandomly, 3000);

    return () => {
      clearInterval(priceUpdateInterval); // Cleanup the interval on component unmount
    };
  }, [stocks]);

  const handleNewStockClick = () => {
    setIsModalOpen(true);
  };

  const handleAddNewStock = async () => {
    if (newStockName.trim() === '' || isNaN(newStockPrice)) {
      alert('Please enter a valid name and price for the new stock.');
      return;
    }

    try {
      const newStock = {
        name: newStockName,
        Price: parseFloat(newStockPrice), // Use the correct property name from your API response
      };

      const response = await createStock(newStock);

      if (response.status === 200) {
        const createdStock = response.data;
        setStocks([...stocks, createdStock]);
        setNewStockName('');
        setNewStockPrice('');
        setIsModalOpen(false);
      } else {
        console.log('Failed to create a new stock');
      }
    } catch (error) {
      console.error('Error creating a new stock', error);
    }
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
          {stocks.map((stock) => (
            <tr key={stock._id}>
              <td>{stock._id}</td>
              <td>{stock.name}</td>
              <td>${stock.Price ? stock.Price.toFixed(2) : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Stock</h2>
            <label htmlFor="newStockName">Name:</label>
            <input
              type="text"
              id="newStockName"
              value={newStockName}
              onChange={(e) => setNewStockName(e.target.value)}
            />
            <label htmlFor="newStockPrice">Price:</label>
            <input
              type="text"
              id="newStockPrice"
              value={newStockPrice}
              onChange={(e) => setNewStockPrice(e.target.value)}
            />
            <button onClick={handleAddNewStock}>Add</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
