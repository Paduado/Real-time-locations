import * as React from 'react'
import PropTypes from 'prop-types'

const FloatingMessage = ({style, ...props}) => {
    const defaultStyle = {
        position: 'absolute',
        padding: 10,
        color: 'white',
        background: 'rgba(0,0,0,.7)',
        borderRadius: 3,
        fontSize: '.8rem',
        width: 200,
        ...style
    };
    return (
        <p
            {...props}
            style={defaultStyle}
        />
    )
};

FloatingMessage.propTypes = {
    style: PropTypes.object
};

export default FloatingMessage;