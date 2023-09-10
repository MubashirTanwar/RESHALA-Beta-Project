var express = require('express');
var mysql = require('mysql2');
const app = express()
var path = require('path');
const session = require('express-session');
const bcrypt = require("bcrypt")
const bodyParser = require('body-parser');
app.set('views', './views');


app.use(express.urlencoded({extended: false}));
console.log("Server started");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.set("view engine", "ejs");


app.post("/register", async (req,res)=>{
    console.log("Received a POST request to /login")
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const  email= req.body.email;
           const password= hashedPassword;
            const number= req.body.number;
            const name= req.body.name;
           const college= req.body.colname;
           const university= req.body.uniname;
           const course= req.body.course;
           const year= req.body.year;
            const usertable = 'CREATE '
            const sql = `INSERT INTO user_db (email,password,number,name,college,university,course,year) VALUES ('${email}', '${password}',${number},'${name}' ,'${college}','${university}' ,'${course}' ,${year}  )`;
            connection.query(sql, (err, result) => {
              if (err) throw err;
              console.log('User signed up successfully!');
              res.redirect('/login');
            });
          });


app.post("/", async(req,res)=>{
  console.log("Received a POST request to /")
  const id = Date.now()
  const bookName = req.body.bookName;
  const version = req.body.bookVersion;
  const author = req.body.authorName;
  const publication = req.body.publication;
  const description = req.body.description;
  const price = req.body.price;
  const url = req.body.URL;
  const email = req.session.email;
  const sql = `INSERT INTO books (bkname, version, author,publication ,description ,url, price,email,id) VALUES ("${bookName}", "${version}","${author}","${publication}" ,"${description}","${url}", "${price}", "${email}" , "${id}" )`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log('book registered!');
    res.redirect('/');
  });
});



app.post("/login", async (req,res)=>{
    console.log("Received a POST request to /login")
    const email = req.body.email;
    const password = req.body.password;
    const sql = `SELECT * FROM user_db WHERE email = '${email}'`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send('Email not found!');
      } else {
        bcrypt.compare(password, result[0].password, (err, match) => {
          if (err) throw err;
          if (match) {
            req.session.email = email;
            res.redirect('/');
          } else {
            res.send('Incorrect password!');
          }
        });
      }
    });
});



console.log("Routes registered");

app.use(express.static(path.join(__dirname, 'public')));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '-------',
    database: 'users'
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database: ', error);
    } else {
        console.log('Connected to the database.');
    }
});

app.get('/', function(req, res) {
  console.log("received post request from books")
  var queryBK = "SELECT * FROM books order by id DESC";
  connection.query(queryBK, function(error, results) {
    if (error) throw error;
    var allBooks = results;    
    var email = req.session.email;
    if (email) {
      var sql = "SELECT name, college, course FROM user_db WHERE email = ?";
      connection.query(sql, [email], function(error, results, fields) {
        if (error) throw error;
        var user = results[0];    
        res.render('index', {allBooks: allBooks, user: user});
      });
    } else {
      res.render('index', {allBooks: allBooks});
    }
  });
});


app.get('/product/:id', function(req, res) {
  const productId = BigInt(req.params.id);
  console.log("req.params.id:", req.params.id);
  console.log("productId:", productId);
  var sql = "SELECT * FROM books WHERE id = ?";
  connection.query(sql, [req.params.id], function(error, results, fields) {
    if (error) throw error;
    var details = results[0]; 
    var sellerQuery = "SELECT email from books WHERE id = ?";
    connection.query(sellerQuery, [productId], function(error, results, fields) {
      if (error) throw error;
      var sellerMail = results[0].email;
      var sql = "SELECT * FROM user_db WHERE email = ?";
      connection.query(sql, [sellerMail], function(error, results, fields) {
        if (error) throw error;
        var seller = results[0];    
        res.render("product4.ejs", {details: details, seller: seller});
      });
    });
  });
});

app.get('/mylist',function(req,res){
  var email = req.session.email;
  var sql = "SELECT * FROM books WHERE email = ?";
  connection.query(sql, [email], function(error, results, fields) {
    if (error) throw error;
    var mylist = results;
  res.render("mylist.ejs",{mylist:mylist})
  })
});


app.get('/user/:email',function(req,res){
  const email = req.params.email;
  var sql = "SELECT * FROM books WHERE email = ?";
  // var profilesql = "SELECT name, college from user_db where email=?";
  connection.query(sql, [email], function(error, results, fields) {
    if (error) throw error;
    var mylist = results;
  res.render("user.ejs",{mylist:mylist})
  })
});

// app.get('/user/:id', function(req, res) {
//   const productId = BigInt(req.params.id);
//   console.log("req.params.id:", req.params.id);
//   console.log("productId:", productId);
//   connection.query(sql, [req.params.id], function(error, results, fields) {
//     if (error) throw error;
//     var details = results[0]; 






/* <div class="product-card">
				
<div class="product-tumb">
  <img src="https://i.imgur.com/3ULdxMa.jpeg" alt="">
</div>
<div class="product-details">
  <span class="product-catagory">Mumbai</span>
  <h4><a href="">Women leather bag</a></h4>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, possimus nostrum!</p>
  <div class="product-bottom-details">
  <div class="product-price">$230.99</div>
  <div class="product-links">
    <a href=""><i class="fa fa-heart"></i></a>
    <a href=""><i class="fa fa-shopping-cart"></i></a>
  </div>
  </div>
</div>
</div>  */


// =========ROUTE===========
app.get('/', function (req,res){
  res.render("index.ejs")
});

app.get('/login',function(req,res){
  res.render("login.ejs")
})
app.get('/register',function(req,res){
  res.render("register.ejs")
})
app.get('/sell',function(req,res){
res.render("sell.ejs")
})


app.listen(4000);
