import * as React from 'react'
import PropTypes from 'prop-types'
import * as mapboxgl from "mapbox-gl";
import {withMap} from "./MapContext";
import * as ReactDOM from "react-dom";

export default withMap(class Marker extends React.PureComponent {
    static propTypes = {
        onDragEnd: PropTypes.func,
        lng: PropTypes.number.isRequired,
        lat: PropTypes.number.isRequired,
        icon: PropTypes.node,
        draggable: PropTypes.bool
    };

    static defaultProps = {
        onDragEnd: () => {}
    };

    el = this.props.icon && document.createElement('div');

    componentDidMount() {
        const {map, lng, lat, draggable, icon} = this.props;
        this.marker = new mapboxgl.Marker({
            element: icon && this.el,
            draggable
        }).setLngLat([
            lng,
            lat
        ]).addTo(map);

        this.marker.on('dragend', this.onDragEnd);
    }

    componentWillUnmount() {
        this.marker.remove();
    }

    componentDidUpdate(prevProps) {
        const {lng, lat} = this.props;
        if(lng !== prevProps.lng || lat !== prevProps.lat) {
            this.marker.setLngLat([
                lng,
                lat
            ]);
        }
    }

    onDragEnd = e => {
        const {lat, lng} = e.target.getLngLat();
        const {onDragEnd} = this.props;
        onDragEnd({lng, lat})
    };

    render() {
        const {icon} = this.props;
        this.el.style.textAlign = 'center';
        this.el.style.pointerEvents = 'none';
        return icon && ReactDOM.createPortal(icon, this.el)
    }
});