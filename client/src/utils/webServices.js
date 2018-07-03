import axios from 'axios'

export const getLocations = async () => {
    const {data: {locations}} = await axios.get('/locations');
    return locations;
};

export const updateLocation = async ({id, name, lat, lng, open}) => {
    const {data: {location}} = await axios.patch(`/locations/${id}`, {
        name,
        lat,
        lng,
        open
    });
    return location;
};

export const createLocation = async ({name, lat, lng, open}) => {
    const {data: {location}} = await axios.post('/locations', {
        name,
        lat,
        lng,
        open
    });
    return location;
};

export const deleteLocation = async id => {
    const {data: {locationId}} = await axios.delete(`/locations/${id}`);
    return locationId;
};