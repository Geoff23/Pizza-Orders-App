//set up the server
const express = require( "express" );
const logger = require("morgan");
const app = express();
const port = 8080;
const db = require('./db/db_pool');
app.set("view engine", "ejs")
app.set("views", __dirname+"/views");
// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );

// define middleware that logs all incoming requests
app.use(logger("dev"));

app.use(express.static(__dirname+'/public'))
app.use( express.urlencoded({ extended: false }) );
// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
} );

// define a route for the stuff inventory page
const read_stuff_all_sql = `
    SELECT 
        type, id, item, quantity
    FROM
        pizza
`
app.get( "/stuff", ( req, res ) => {
    db.execute(read_stuff_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.render('stuff', { inventory : results });
    });
});

// define a route for the item detail page
const read_stuff_item_sql = `
    SELECT 
        id, type, item, quantity, description 
    FROM
        pizza
    WHERE
        id = ?
`
app.get( "/stuff/item/:id", ( req, res ) => {
    db.execute(read_stuff_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = results[0];
            res.render('item', data);
        } 
    });
});

app.get("/pizza.gif", (req, res) => {
    res.sendFile( __dirname+"/pizza.gif")
} );

const delete_item_sql = `
    DELETE
    FROM
        pizza
    WHERE
        id = ?
`

app.get("/stuff/item/:id/delete", ( req, res ) => {
    db.execute(delete_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/stuff");
        }
    });
})



// define a route for item CREATE
const create_item_sql = `
    INSERT INTO pizza
        (type, item, quantity)
    VALUES
        (?, ?, ?)
`
app.post("/stuff", ( req, res ) => {
    db.execute(create_item_sql, [req.body.type, req.body.size, req.body.quantity], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/stuff/item/${results.insertId}`);
        }
    });
})

const update_item_sql = `
    UPDATE
        pizza
    SET
        type = ?,
        item = ?,
        quantity = ?,
        description = ?
    WHERE
        id = ?
`
app.post("/stuff/item/:id", ( req, res ) => {
    db.execute(update_item_sql, [req.body.type, req.body.size, req.body.quantity, req.body.description, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/stuff/item/${req.params.id}`);
        }
    });
})