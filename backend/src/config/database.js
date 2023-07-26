const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const dbUrl = process.env.MONGODB_URI; // Certifique-se de que MONGODB_URI tenha a URL correta com o nome do banco de dados
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao banco de dados MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};

module.exports = connectDatabase;
