'use strict';
const express = require('express');
const router = express.Router();
const client = require('../dbClient');

router.get('/', (req, res) => {
    client
        .query('SELECT * FROM prefixes')
        .then(result => res.json(result.rows))
        .catch(e => console.error(e));
})

router.get('/:guildId', (req, res, next) => {
    client
        .query('SELECT guild_id, prefix FROM prefixes WHERE guild_id = $1;', [req.params.guildId])
        .then(result => {
            if (result.rows.length > 0)
                res.json(result.rows);
            else
                //next will cause it to chain into 404 route
                next();
        })
        .catch(e => console.error(e));
});

/* POST new guild prefix */
router.post('/', (req, res) => {
    const sql = 'INSERT INTO prefixes (guild_id, prefix) VALUES ($1, $2) ON CONFLICT (guild_id) DO UPDATE SET prefix = $2';
    const values = [req.body.guild_id, req.body.prefix];

    client
        .query(sql, values)
        .then(result => {
            res.json(result);
        })
        .catch(e => console.error(e));
});

/* DELETE a prefix */
router.delete('/', (req, res) => {
    const sql = 'DELETE FROM prefixes WHERE guild_id = $1';
    const values = [req.body.guild_id];

    client
        .query(sql, values)
        .then(result => {
            res.send(result);
        })
        .catch(e => console.error(e));
});


module.exports = router;