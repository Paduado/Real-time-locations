import React, {Fragment} from 'react';
import * as WebServices from '../utils/webServices'
import Map from "./Map";
import Marker from "./Marker";
import Button from "./Button";
import EditLocationDialog from "./EditLocationDialog";
import FloatingMessage from "./FloatingMessage";
import {MarkerOffSvg, MarkerSvg} from "../svgs";

const updateLocation = updatedLocation => ({locations}) => ({
    locations: locations.map(
        location => location.id === updatedLocation.id
            ? updatedLocation
            : location
    )
});

const addLocation = location => ({locations}) => ({
    locations: locations.filter(
        ({id}) => id !== location.id
    ).concat(location)
});

const deleteLocation = locationId => ({locations}) => ({
    locations: locations.filter(({id}) => id !== locationId)
});

export default class App extends React.PureComponent {
    state = {
        locations: [],
        isDialogOpen: false,
        dialogLocationId: null,
    };

    componentDidMount() {
        this.getLocations();
        this.eventSouce = new EventSource(`/locations/subscribe`);
        this.eventSouce.onmessage = this.onMessageReceived
    }

    componentWillUnmount() {
        this.eventSouce.close();
    }

    getLocations = async () => {
        const locations = await WebServices.getLocations();
        this.setState({locations});
    };

    onMessageReceived = e => {
        const data = JSON.parse(e.data);
        switch(data.type) {
            case 'LOCATION_CREATED':
                this.setState(addLocation(data.location));
                break;
            case 'LOCATION_UPDATED':
                this.setState(updateLocation(data.location));
                break;
            case 'LOCATION_DELETED':
                this.setState(deleteLocation(Number(data.locationId)));
                break;
            default:
                break;
        }
    };

    onMarkerDragEnd = id => async ({lng, lat}) => {
        try {
            const location = await WebServices.updateLocation({id, lng, lat});
            this.setState(updateLocation(location));
        } catch(e) {
            console.error(e);
            this.onError('Error al actualizar el marcador');
        }
    };

    onMarkerContextMenu = locationId => {
        this.setState({
            isDialogOpen: true,
            dialogLocationId: locationId
        })
    };

    onDialogCreate = async locationData => {
        const location = await WebServices.createLocation(locationData);
        this.setState(state => ({
            isDialogOpen: false,
            dialogLocationId: null,
            ...addLocation(location)(state),
        }));
    };

    onDialogUpdate = async locationData => {
        const location = await WebServices.updateLocation(locationData);
        this.setState(state => ({
            isDialogOpen: false,
            dialogLocationId: null,
            ...updateLocation(location)(state),
        }));
    };

    onDialogDelete = async () => {
        const {dialogLocationId} = this.state;
        await WebServices.deleteLocation(dialogLocationId);
        this.setState(state => ({
            isDialogOpen: false,
            dialogLocationId: null,
            ...deleteLocation(dialogLocationId)(state)
        }))
    };

    onError = error => {
        this.setState({error});
        setTimeout(() => {
            this.setState({error: ''});
        }, 3000);
        this.getLocations();
    };

    render() {
        const {locations, isDialogOpen, dialogLocationId, error} = this.state;

        const openedLocation = dialogLocationId ? locations.find(
            ({id}) => id === dialogLocationId
        ) : undefined;

        const styles = {
            map: {
                width: '100vw',
                height: '100vh',
            },
            newButton: {
                position: 'fixed',
                top: 20,
                left: 20,
                margin: 0
            },
            markerLabel: {
                padding: '0 5px',
                background: 'rgba(0,0,0,.7)',
                color: 'white',
                borderRadius: 3,
                height: 20,
                marginTop: -20
            },
            markerIcon: {
                pointerEvents: 'all'
            },
            message: {
                top: 60,
                left: 20,
                padding: 10,
                width: 130
            },
            error: {
                bottom: 50,
                left: 0,
                right: 0,
                margin: 'auto',
                width: 200
            },
        };

        return (
            <div>
                <Map style={styles.map}>
                    {locations.map(({id, name, lat, lng, open}) => {
                        const markerProps = {
                            style: styles.markerIcon,
                            onContextMenu: () => this.onMarkerContextMenu(id)
                        };
                        return (
                            <Marker
                                key={id}
                                onDragEnd={this.onMarkerDragEnd(id)}
                                lng={lng}
                                lat={lat}
                                draggable
                                icon={
                                    <Fragment>
                                        {name && (
                                            <div style={styles.markerLabel}>
                                                {name}
                                            </div>
                                        )}
                                        {open
                                            ? <MarkerSvg {...markerProps}/>
                                            : <MarkerOffSvg {...markerProps}/>
                                        }
                                    </Fragment>
                                }
                            />
                        )
                    })}
                </Map>
                <Button
                    label="Agregar ubicación"
                    onClick={() => this.setState({isDialogOpen: true})}
                    style={styles.newButton}
                />
                <FloatingMessage style={styles.message}>
                    Haz click derecho para editar una ubicación
                </FloatingMessage>
                {error && (
                    <FloatingMessage style={styles.error}>
                        {error}
                    </FloatingMessage>
                )}
                <EditLocationDialog
                    open={isDialogOpen}
                    onClose={() => this.setState({isDialogOpen: false, dialogLocationId: null})}
                    onCreate={this.onDialogCreate}
                    onUpdate={this.onDialogUpdate}
                    onDelete={this.onDialogDelete}
                    currentLocation={openedLocation}
                />
            </div>
        );
    }
}