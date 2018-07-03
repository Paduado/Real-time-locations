import * as React from "react";
import Radium from 'radium'
import Color from 'color'
import PropTypes from 'prop-types'

const Button = Radium(({label, disabled, style, color, ...props}) => {
    const defaultStyle = {
        background: color,
        color: 'white',
        padding: 10,
        border: 0,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all .2s',
        fontSize: '.85rem',
        pointerEvents: disabled && 'none',
        display: 'block',
        ':hover': {
            background: Color(color).lighten(-.2)
        },
        ...style
    };
    return (
        <button
            style={defaultStyle}
            disabled={disabled}
            {...props}
        >
            {label}
        </button>
    );
});

Button.propTypes = {
    label: PropTypes.any,
    onClick: PropTypes.func,
    color: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    color: '#3FB1CE',
    onClick: () => {}
};

export default Button;
