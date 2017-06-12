const db = process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://localhost/Web-crawler';
module.exports = db;
