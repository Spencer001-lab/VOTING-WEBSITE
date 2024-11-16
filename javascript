const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")("your-stripe-secret-key"); // Replace with your Stripe secret key

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

let users = []; // Simulated user database
let votes = {}; // Simulated voting database

// Middleware to check if the user is authenticated
function authenticateJWT(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send("Access denied.");
  }

  jwt.verify(token, "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).send("Access denied.");
    }
    req.user = user;
    next();
  });
}

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Login POST route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username: user.username }, "your-secret-key", { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).send("Invalid username or password");
  }
});

// Register page
app.get("/register", (req, res) => {
  res.render("register");
});

// Register POST route
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  res.send("User registered successfully");
});

// Payment page
app.get("/payment", authenticateJWT, (req, res) => {
  res.render("payment");
});

// Process payment (mock implementation)
app.post("/pay", authenticateJWT, async (req, res) => {
  const { token } = req.body;
  
  try {
    const payment = await stripe.paymentIntents.create({
      amount: 500, // Amount in cents
      currency: 'usd',
      payment_method: token,
      confirm: true
    });
    res.send("Payment successful");
  } catch (err) {
    res.status(400).send("Payment failed");
  }
});

// Voting page
app.get("/vote", authenticateJWT, (req, res) => {
  res.render("vote");
});

// Submit vote
app.post("/vote", authenticateJWT, (req, res) => {
  const { voteOption } = req.body;
  const username = req.user.username;

  if (votes[username]) {
    return res.status(400).send("You have already voted.");
  }

  votes[username] = voteOption;
  res.send("Vote submitted successfully!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
