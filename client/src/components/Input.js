import React from 'react';
import PropTypes from 'prop-types'

const Input = ({
    label,
    color,
    style,
    inputStyle,
    labelStyle,
    ...props
}) => {
    const styles = {
        container: {
            margin: '10px 0',
            ...style,
        },
        label: {
            fontSize: '.8rem',
            marginBottom: '3px',
            color,
            ...labelStyle
        },
        input: {
            width: '100%',
            padding: '0 5px',
            border: '1px solid #ddd',
            borderRadius: 2,
            fontSize: '.9rem',
            height: 30,
            WebkitAppearance: 'none',
            ...inputStyle
        }
    };

    return (
        <div style={styles.container}>
            {label && (
                <div style={styles.label}>{label}</div>
            )}
            <input
                {...props}
                style={styles.input}
            />
        </div>
    )
};

Input.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    color: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    inputStyle: PropTypes.object,
    labelStyle: PropTypes.object,
};
Input.defaultProps = {
    color: '#3FB1CE',
    onChange: () => {}
};

export default Input;
