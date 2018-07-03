const express = require('express');
const {Location} = require('../models/index');
const router = express.Router();
const connections = [];

function sendMessage(payload) {
    connections.forEach(
        connection => connection.sseSend(payload)
    );
}

router.get('/subscribe', function(req, res) {
    res.sseSetup();
    connections.push(res)
});

router.get('/', async function(req, res, next) {
    try {
        const locations = await Location.findAll({
            attributes: {
                exclude: [
                    'createdAt',
                    'updatedAt',
                    'deletedAt',
                ]
            }
        });
        res.json({locations});
    } catch(e) {
        next(e);
    }
});

router.patch('/:id', async function(req, res, next) {
    try {
        const {id} = req.params;
        const {lat, lng, name, open} = req.body;
        const location = await Location.findOne({
            where: {id},
            attributes: {
                exclude: [
                    'createdAt',
                    'updatedAt',
                    'deletedAt',
                ]
            }
        });
        if(!location)
            throw new Error('No se pudo eliminar la ubicación');

        await location.update({
            ...(lat !== undefined && {lat}),
            ...(lng !== undefined && {lng}),
            ...(name !== undefined && {name}),
            ...(open !== undefined && {open}),
        });
        sendMessage({
            type: 'LOCATION_UPDATED',
            location
        });
        res.json({location});
    } catch(e) {
        next(e);
    }
});

router.post('/', async function(req, res, next) {
    try {
        const {lat, lng, name, open} = req.body;
        const location = await Location.create({
            lat,
            lng,
            name,
            open,
        });
        sendMessage({
            type: 'LOCATION_CREATED',
            location
        });
        res.json({location});
    } catch(e) {
        next(e);
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        const {id} = req.params;
        const location = await Location.findById(id);
        if(!location)
            throw new Error('No se pudo eliminar la ubicación');

        await location.destroy();
        sendMessage({
            type: 'LOCATION_DELETED',
            locationId: id
        });
        res.json({locationId: id});
    } catch(e) {
        next(e);
    }
});

module.exports = router;