module.exports = function(err, req, res) {
    console.error(err);
    res.status(500).send(err.message);
};