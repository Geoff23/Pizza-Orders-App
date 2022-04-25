const db = require("./db_connection");

// delete the table if it already exists
const drop_pizza_table = "DROP TABLE IF EXISTS pizza";
db.execute(drop_pizza_table);
// create the table with suitable columbs and such
const create_pizza_table_sql =  `
    CREATE TABLE pizza (
        id INT NOT NULL AUTO_INCREMENT,
        type VARCHAR(45) NOT NULL,
        item VARCHAR(45) NOT NULL,
        quantity INT NOT NULL,
        description VARCHAR(150) NULL,
        PRIMARY KEY (id)
    );
    `
db.execute(create_pizza_table_sql);

const insert_pizza_table_sql = `
    INSERT INTO pizza 
        (type, item, quantity, description) 
    VALUES 
        (?, ?, ?, ?);
`
db.execute(insert_pizza_table_sql, ['Cheese', 'Widgets', '5', 'Widgets are cool! You can do ... so many... different things... with them...']);

db.execute(insert_pizza_table_sql, ['Money', 'Gizmos', '100', null]);

db.execute(insert_pizza_table_sql, ['Moolah', 'Thingamajig', '12345', 'Not to be confused with a Thingamabob']);

db.execute(insert_pizza_table_sql, ['Scheisse', 'Thingamabob', '54321', 'Not to be confused with a Thingamajig']);

const read_pizza_table_sql = "SELECT * FROM pizza";

db.execute(read_pizza_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'pizza' initialized with:")
        console.log(results);
    }
);

db.end();
