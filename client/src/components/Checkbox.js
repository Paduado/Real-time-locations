import * as React from 'react'
import PropTypes from 'prop-types'

const Checkbox = ({value, onChange, label}) => {
    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
        },
        label: {
            marginLeft: 5
        },
    };

    return (
        <div style={styles.container} onClick={() => onChange(!value)}>
            {value
                ? <ActiveSvg/>
                : <InactiveSvg/>
            }
            <span style={styles.label}>
                {label}
            </span>
        </div>
    )
};

Checkbox.propTypes = {
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
};

const ActiveSvg = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#3FB1CE" {...props}>
        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
);

const InactiveSvg = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#3FB1CE" {...props}>
        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
    </svg>
);


export default Checkbox;