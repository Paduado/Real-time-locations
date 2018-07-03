import PropTypes from 'prop-types'

export const locationType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
});