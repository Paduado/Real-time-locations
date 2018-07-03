import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './main.css'
import mapboxgl from 'mapbox-gl'
import {StyleRoot} from "radium";

mapboxgl.accessToken = 'pk.eyJ1IjoicGFkdWFkbyIsImEiOiJjaml6NTZnZnYwM2YzM3dueHRtYzlzanQ3In0.uLmzhUKI-37RHVLSQVNLQQ';

ReactDOM.render((
    <StyleRoot>
        <App/>
    </StyleRoot>
), document.getElementById('root'));
