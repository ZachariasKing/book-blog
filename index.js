import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

//Express server setup
const app = express();
const port = process.env.PORT || 3000;
console.log(`process.env.PORT: ${process.env.PORT}`);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Endpoints
app.get('/', (req, res) => {
  res.render('index.ejs', { title: 'Welcome to the Book Blog!' });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
