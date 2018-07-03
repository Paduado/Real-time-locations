'use strict';
module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define('Location', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        lat: DataTypes.FLOAT,
        lng: DataTypes.FLOAT,
        open: DataTypes.BOOLEAN
    }, {
        timestamps: true,
        paranoid: true
    });
    Location.associate = function(models) {
        // associations can be defined here
    };
    return Location;
};