# Country Travel Tracker V2

## Description
Country Travel Tracker is a web application built with Express.js, using a PostgreSQL database to keep track of visited countries. Multiple Users can add countries they have visited, and the application displays the total number of visited countries along with a list of them.

## Setup

### Prerequisites
- Node.js installed
- PostgreSQL database running

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Country_Travel_Tracker.git
   cd Country_Travel_Tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure PostgreSQL:**
   - Ensure PostgreSQL is running on your machine.
   - Create a database named "world" and update the database connection details in `index.js` if needed.

4. **Run the application with nodemon:**
   ```bash
   npm run dev
   ```

5. **Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to use the application.**

## Usage

1. **Visit the home page (`index.ejs`) to see the list of visited countries and the total count.**

2. **To add a new country:**
   - Enter the country name in the provided input field.
   - Click the "Add" button.
   - If the country exists in the database, it will be added to the list of visited countries.
   - If the country name does not exist, an error message will be displayed.

## Project Structure
- `public/`: Contains static files (CSS, images, etc.).
- `views/`: Contains EJS templates, including `index.ejs` for the home page.

## Dependencies
- [express](https://www.npmjs.com/package/express)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [pg](https://www.npmjs.com/package/pg)
- [ejs](https://www.npmjs.com/package/ejs)

## License
This project is licensed under the [ISC License](LICENSE).