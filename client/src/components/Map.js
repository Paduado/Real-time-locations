import * as React from 'react'
import * as mapboxgl from "mapbox-gl";
import MapContext from "./MapContext";
import 'mapbox-gl/dist/mapbox-gl.css'
import {PositionSvg} from "../svgs";
import {defaultLocation} from "../utils/locations";
import Marker from "./Marker";
import PropTypes from 'prop-types'

export default class Map extends React.PureComponent {
    static propTypes = {
        style: PropTypes.object
    };
    state = {
        center: null
    };

    container = React.createRef();

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.container.current,
            style: 'mapbox://styles/mapbox/streets-v10',
            zoom: 12
        }).setCenter(defaultLocation);

        this.getCurrentPosition();
    }

    componentWillUnmount() {
        this.map.remove();
    }

    getCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition(({coords}) => {
            this.setState({
                center: {
                    lng: coords.longitude,
                    lat: coords.latitude
                }
            });
        });
    };

    render() {
        const {children, ...props} = this.props;
        const {center} = this.state;
        return (
            <MapContext.Provider value={this.map}>
                <div
                    {...props}
                    ref={this.container}
                />
                {children}
                {center && (
                    <Marker
                        lng={center.lng}
                        lat={center.lat}
                        position={center}
                        icon={<PositionSvg/>}
                    />
                )}
            </MapContext.Provider>
        )
    }
}