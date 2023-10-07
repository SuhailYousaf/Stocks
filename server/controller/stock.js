const mongoose = require('mongoose');
const Stock = require('../models/stock')


exports.StockCreate = async (req, res) => {
    const Data = req.body;
  const NewStock =new Stock({
    ...Data
    
  })
  try {
    await NewStock.save();
    res.status(201).json(NewStock)
  } catch (error) {
    console.log(error)
    res.status(404).json({message:"something went wrong"})
  }
    
  }
  

exports.findStock = async(req, res)=>{
    try {
        const Stocks = await Stock.find({})
        if(!Stocks){
            return res.status(409).json({ error: 'Not found', message: 'Stock empty' });
        }
        res.status(200).json({Stocks})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.UpdateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStock = await Stock.findByIdAndUpdate(id, req.body, { new: true }); 

    if (!updatedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.status(200).json({ stock: updatedStock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};