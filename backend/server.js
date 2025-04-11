const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());

app.get('/api/cambio/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    const apiKey = process.env.EXCHANGE_API_KEY;

    console.log('Requisição recebida para:', { from, to }); // Log da requisição recebida
    console.log('Chave da API:', apiKey); // Log da chave da API

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/35f22d6001b1972700ed55d6/pair/${from}/${to}`
    );
    console.log('Requisição recebida para:', { from, to });
    console.log('Chave da API:', apiKey);

    console.log('Resposta da API externa:', response.data); // Log da resposta da API externa

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao obter taxa de câmbio:', error);
    console.error('Detalhes do erro:', error.message, error.stack); // Log detalhado do erro
    res.status(500).json({ error: 'Erro ao obter taxa de câmbio', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});