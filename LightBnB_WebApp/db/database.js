const properties = require("./json/properties.json");
const users = require("./json/users.json");
const {Pool} = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
  .query(`SELECT * FROM users WHERE email = $1`, [email])
  .then((result) => {
    //console.log(result.rows[0]);
    if(result.rows[0]){
      return result.rows[0];
    }else{
      return null;
    }
  })
  .catch((err) => {
    console.log(err.message);
  });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
  .query(`SELECT * FROM users WHERE id = $1`, [id])
  .then((result) => {
    //console.log(result.rows[0]);
    if(result.rows[0]){
      return result.rows[0];
    }else{
      return null;
    }
  })
  .catch((err) => {
    console.log(err.message);
  });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryText = 
  `INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3)
    RETURNING *;`;
  return pool
  .query(queryText, [user.name, user.email, user.password])
  .then((result) => {
    //console.log(result.rows);
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryText = `SELECT reservations.id, properties.*, reservations.start_date, reservations.end_date, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date DESC
  LIMIT $2;`;
  return pool
  .query(queryText,[guest_id,limit])
  .then((result) => {
    //console.log(result.rows);
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  
  const queryParams = [];
  
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // filters for city, owner_id, price
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += addClause(queryParams, `city LIKE $${queryParams.length}`);
    //queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.owner_id){
    queryParams.push(options.owner_id);
    queryString += addClause(queryParams, `owner_id = $${queryParams.length}`);
    //queryString += `WHERE owner_id = $${queryParams.length}`;
  }
  if (options.minimum_price_per_night && options.maximum_price_per_night){
    queryParams.push(options.minimum_price_per_night*100, options.maximum_price_per_night*100);
    queryString += addClause(queryParams, `cost_per_night > $${queryParams.length -1} AND cost_per_night < $${queryParams.length}`);
    //queryString += `WHERE cost_per_night > $${queryParams.length -1} AND cost_per_night < $${queryParams.length}`
  }

  // GROUP BY
  queryString += `
  GROUP BY properties.id
  `;
  // HAVING after GROUP BY
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING AVG(property_reviews.rating) > $${queryParams.length}`;
  }
  
  //Other clauses
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addClause = function(arr, str){
  if(arr.length === 1){
    return 'WHERE ' + str;
  }else if(arr.length > 1){
    return ' AND ' + str;
  }
  return '';
}

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
