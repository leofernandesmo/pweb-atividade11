const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

//Inform the defaul engine
app.set('view engine', 'ejs');
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Simulated database of users
const users = [
    { username: 'user1', password: 'pass1', name: 'John Doe' },
    { username: 'user2', password: 'pass2', name: 'Jane Doe' },
    // Add more user objects as needed
];



// GET request for the login page
app.get('/login', (req, res) => {
    res.render('login'); // Render the 'login.ejs' template
});

app.get('/register', (req, res) => {
    res.render('registration'); // Render the 'registration.ejs' template
});

// POST request for submitting login credentials
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     // Perform authentication logic here
//     var authenticated = true; // Replace with actual authentication logic
//     if (authenticated) {
//         res.redirect('/dashboard');
//     } else {
//         // Handle authentication failure
//     }
// });

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    // Compare hashed password with password entered by the user
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        // Authentication successful
        // Create a session or set a cookie to persist user authentication
        // Redirect the user to the dashboard page
        res.render('dashboard', {user: user});
    } else {
        // Authentication failed
        // Redirect the user back to the login page with an error message
        res.render('login', { error: 'Invalid username or password' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password, name } = req.body;
    // Check if username is already taken (optional)
    // If username is not taken, store user registration data securely
    // You can store the data in an array, database, or any other persistent storage
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user object with username and hashed password
    const newUser = {
        username: username,
        password: hashedPassword,
        name: name
    };
    
    // Push the new user object into the users array
    users.push(newUser);
    res.send('Registration successful!');
});

app.get('/registered-logins', (req, res) => {
    // Assuming 'users' is your array list containing registered logins
    res.render('registeredLogins', { users: users });
});

app.get('/delete/:username', (req, res) => {
    const username = req.params.username;
    // Assuming 'users' is your array list containing registered logins
    const index = users.findIndex(user => user.username === username);
    users.splice(index, 1);
    res.redirect('/registered-logins');
});



const PORT = process.env.PORT || 3000; // Use the environment port or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the Express API
module.exports = app;
