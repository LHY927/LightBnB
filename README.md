# LightBnB
    This project is the database for hte LightBnB project, it could provide interfaces for users to interact with the database.
## Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.


- Folders
  - 1_queries: The folder that includes different quries.
  - LightBnB_WebApp: Includes the node.js based server for the project, by running the server, it could allow users to get access with the database with different types of query.
    - db: The folder for database in of the system, includes two JSON files.
      - properties.json: The JSON file for detailed properties of each data entry.
      - user.json: The JSON file for users of the system, includes their username, email and passwords.
    - public: The frontend assets folder
      - javascript: Include the js files of both libararies and handling the frontend requrests.
      - styles: css files of the frontend user interface.
      - index.html: The frontend user interface page.
    - routes: The routes for node.js based server that handle requests from users.
      - apiRoutes.js: Handle the requests for manipulation of the database.
      - userRoutes.js: Handle user-related requests, like login and log out.