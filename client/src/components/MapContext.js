import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

const MapContext = React.createContext({});

export const withMap = Component => {
    const WrappedComponent = props => (
        <MapContext.Consumer>
            {map => <Component {...props} map={map}/>}
        </MapContext.Consumer>
    );

    WrappedComponent.displayName = `withMap(${Component.displayName || Component.name || 'Component'})`;

    hoistNonReactStatics(WrappedComponent, Component);
    return WrappedComponent;
};

export default MapContext;