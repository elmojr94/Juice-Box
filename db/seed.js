// inside db/seed.js

// grab our client with destructuring from the export in index.js
// const { client } = require('./index');

// async function testDB() {
//   try {
//     // connect the client to the database, finally
//     client.connect();

//     // queries are promises, so we can await them
//     const result = await client.query(`SELECT * FROM users;`);

//     // for now, logging is a fine way to see what's up
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     // it's important to close out the client connection
//     client.end();
//   }
// }
// async function testDB() {
//   try {
//     client.connect();

//     const { rows } = await client.query(`SELECT * FROM users;`);
//     console.log(rows);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     client.end();
//   }
// }
// const {
//   client,
//   getAllUsers // new
// } = require('./index');

// async function testDB() {
//   try {
//     client.connect();

//     const users = await getAllUsers();
//     console.log(users);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     client.end();
//   }
// }

// testDB();

// inside db/seed.js --seeding module

// this function should call a query which drops all tables from our database
// async function dropTables() {
//   try {
//     await client.query(`

//     `);
//   } catch (error) {
//     throw error; // we pass the error up to the function that calls dropTables
//   }
// }
// async function dropTables() {
//   try {
//     await client.query(`
//       DROP TABLE IF EXISTS users;
//     `);
//   } catch (error) {
//     throw error;
//   }
// }


// this function should call a query which creates all tables for our database 
// async function createTables() {
//   try {
//     await client.query(`

//     `);
//   } catch (error) {
//     throw error; // we pass the error up to the function that calls createTables
//   }
// }
// async function createTables() {
//   try {
//     await client.query(`
//       CREATE TABLE users (
//         id SERIAL PRIMARY KEY,
//         username varchar(255) UNIQUE NOT NULL,
//         password varchar(255) NOT NULL
//       );
//     `);
//   } catch (error) {
//     throw error;
//   }
// }

// async function rebuildDB() {
//   try {
//     client.connect();

//     await dropTables();
//     await createTables();
//   } catch (error) {
//     console.error(error);
//   } finally {
//     client.end();
//   }
// }

// rebuildDB();
// --------MY CODE ^^^^^--------

const { 
  // other imports,
  createUser
} = require('./index');

// new function, should attempt to create a few users
async function createInitialUsers() {
  try {
    console.log("Starting to create users...");
    const albertTwo = await createUser({ username: 'albert', password: 'imposter_albert' });

    const albert = await createUser({ username: 'albert', password: 'bertie99' });

    console.log(albert);

    console.log("Finished creating users!");
  } catch(error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createUser({ username, password }) {
  try {
    const result = await client.query(`
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password]);

    return result;
  } catch (error) {
    throw error;
  }
}
// old stuff below here!



const {
  client,
  getAllUsers
} = require('./index');

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());