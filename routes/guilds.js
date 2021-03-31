'use strict';
const express = require('express');
const router = express.Router();
const client = require('../dbClient');

router.get('/count', (req, res) => {
    const sql = 'SELECT COUNT(*) FROM guilds LEFT JOIN prefixes ON guilds.guild_id = prefixes.guild_id';

    client
        .query(sql)
        .then(result => res.json(result.rows[0]))
        .catch(e => console.error(e));
});

/* GET guilds listing. */
router.route('/').get((req, res) => {
    const sql = 'SELECT * FROM guilds';

    client
        .query(sql)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e));

})
    /* POST new guild */
    .post((req, res) => {
        const sql = 'INSERT INTO guilds (guild_id, guild_name) VALUES ($1, $2) ON CONFLICT (guild_id) DO UPDATE SET guild_name = $2';
        const values = [req.body.guild_id, req.body.guild_name];

        client
            .query(sql, values)
            .then(result => {
                res.send(result);
            })
            .catch(e => console.error(e));
    })

    /* DELETE a guild */
    .delete((req, res) => {
        const sql = 'DELETE FROM guilds WHERE guild_id = $1';
        const values = [req.body.guild_id];

        client
            .query(sql, values)
            .then(result => {
                res.send(result);
            })
            .catch(e => console.error(e));
    });

router.get('/getByName/:guild_name', (req, res) => {
    const sql = 'SELECT * FROM guilds WHERE guilds.guild_name = $1';
    const values = [req.params.guild_name];

    client
        .query(sql, values)
        .then(result => {
            if (result.rows.length > 0)
                res.json(result.rows);
            else
                //next will cause it to chain into 404 route
                next();
        })
        .catch(e => console.error(e));
})

router.get('/:guild_id', (req, res, next) => {
    const sql = 'SELECT guilds.guild_id, guilds.guild_name, prefixes.prefix FROM guilds LEFT JOIN prefixes ON prefixes.guild_id = guilds.guild_id WHERE guilds.guild_id = $1';
    const values = [req.params.guild_id];

    client
        .query(sql, values)
        .then(result => {
            if (result.rows.length > 0)
                res.json(result.rows);
            else
                //next will cause it to chain into 404 route
                next();
        })
        .catch(e => console.error(e));

});

module.exports = router;
