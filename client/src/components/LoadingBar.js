import * as React from 'react'
import PropTypes from 'prop-types'
import Radium from "radium";

const animation = Radium.keyframes({
    '0%': {
        strokeDashoffset: 200,
        opacity: .5
    },
    '20%': {
        strokeDashoffset: 0,
        opacity: 1
    },
    '50%': {
        strokeDashoffset: -200,
        opacity: .5
    },
    '80%': {
        strokeDashoffset: 0,
        opacity: 1
    },
    '100%': {
        strokeDashoffset: 200,
        opacity: .5
    },
});

const LoadingBar = Radium(({style}) => {
    const styles = {
        container: {
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            height: 3,
            ...style
        },
        line: {
            strokeLinecap: 'round',
            strokeDasharray: 200,
            animation: `1500ms linear infinite`,
            animationName: animation,
        }
    };
    return (
        <svg style={styles.container} viewBox="0 0 200 1">
            <line
                x1="0"
                x2="200"
                y1="0"
                y2="0"
                stroke="#3FB1CE"
                strokeWidth="3"
                style={styles.line}
            />
        </svg>
    )
});

LoadingBar.propTypes = {
    style: PropTypes.object
};

export default LoadingBar;