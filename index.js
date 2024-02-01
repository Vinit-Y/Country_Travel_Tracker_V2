import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "postgres",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [];

async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1;", [currentUserId]); // On page load, we want the 1st Users Data to load.
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);   // Adding all the countries in array where, current User had visited.
  });
  return countries;
}

async function getUsers() {
  const usersData = await db.query("SELECT * FROM users"); // Gets all the USERS in the DB.
  users = usersData.rows;
  //console.log(users.find((user) => user.id == currentUserId));
  return users.find((user) => user.id == currentUserId); // On page load, we want the 1st Users Data to load. 
}

app.get("/", async (req, res) => {
  const countries = await checkVisited();
  const currentUser = await getUsers();
  if (!currentUser) {
    console.log("No Users Exist!");
    res.render("new.ejs"); 
    console.log(currentUser);
  } else {
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,                             // Sends all the Users to Static files to display in the list of Users Tab.
      color: currentUser.color,                 // We want the 1st || currentUsers data/ Color to display on pageload.
    });
  }
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const currentUser = await getUsers();

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisited();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    console.log(err);
    const countries = await checkVisited();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    });
  }
});

app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs");      // Code for adding a new family member submit button
  } else {
    currentUserId = req.body.user; // Newely created tab/user's map page will display and currentUserId will cahnge with newly created user id, making us possible to enter new users visited data. 
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const inputName = req.body.name;
  const inputColor = req.body.color;
  try {
    const result = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *;", [inputName, inputColor]); // returns all data of newely inserted data.
    const id = result.rows[0].id;
    currentUserId = id;
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
