import * as React from 'react'
import PropTypes from 'prop-types'
import Dialog from "./Dialog";
import LoadingBar from "./LoadingBar";
import Input from "./Input";
import Checkbox from "./Checkbox";
import Button from "./Button";
import {locationType} from "../types";
import {defaultLocation} from "../utils/locations";
import FloatingMessage from "./FloatingMessage";

const defaultFields = {
    name: '',
    locationOpen: false,
    lat: defaultLocation[1],
    lng: defaultLocation[0],
};
export default class EditLocationDialog extends React.PureComponent {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        onCreate: PropTypes.func.isRequired,
        onUpdate: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        currentLocation: locationType,
    };

    state = {
        loading: false,
        error: '',
        ...defaultFields
    };

    componentDidUpdate(prevProps) {
        const {currentLocation} = this.props;
        if(currentLocation !== prevProps.currentLocation) {
            this.setState(
                () => currentLocation
                    ? {
                        name: currentLocation.name,
                        locationOpen: currentLocation.open,
                        lat: currentLocation.lat,
                        lng: currentLocation.lng,
                    }
                    : defaultFields
            );
        }
    }

    onCreate = async e => {
        e.preventDefault();
        try {
            const {onCreate} = this.props;
            const {
                name,
                locationOpen,
                lat,
                lng,
            } = this.state;
            this.setState({loading: true});
            await onCreate({
                name,
                open: locationOpen,
                lat,
                lng,
            });
            this.setState({loading: false});
        } catch(e) {
            console.error(e);
            this.onError('Error al crear la ubicación');
        }
    };

    onUpdate = async e => {
        e.preventDefault();
        try {
            const {onUpdate, currentLocation} = this.props;
            const {
                name,
                locationOpen,
                lat,
                lng,
            } = this.state;
            this.setState({loading: true});
            await onUpdate({
                id: currentLocation.id,
                name,
                open: locationOpen,
                lat,
                lng,
            });
            this.setState({loading: false});
        } catch(e) {
            console.error(e);
            this.onError('Error al actualizar la ubicación');
        }
    };

    onDelete = async () => {
        try {
            const {onDelete} = this.props;
            this.setState({loading: true});
            await onDelete();
            this.setState({loading: false});
        } catch(e) {
            console.error(e);
            this.onError('Error al eliminar la ubicación');
        }
    };

    onError = error => {
        this.setState({error, loading: false});
        setTimeout(() => {
            this.setState({error: ''})
        }, 3000)
    };

    render() {
        const {open, onClose, currentLocation} = this.props;
        const {
            loading,
            name,
            lat,
            lng,
            locationOpen,
            error,
        } = this.state;

        const styles = {
            dialogButtonsContainer: {
                display: 'flex',
                alignItems: 'space-between',
                marginTop: 20
            },
            error: {
                bottom: 10,
                left: 0,
                right: 0,
                margin: 'auto',
            }
        };

        return (
            <Dialog
                open={open}
                onClose={onClose}
            >
                {loading && (
                    <LoadingBar/>
                )}
                <form onSubmit={currentLocation ? this.onUpdate : this.onCreate}>
                    <h3>
                        {`${currentLocation ? 'Editar' : 'Crear'} ubicación`}
                    </h3>
                    <Input
                        label="Nombre"
                        value={name}
                        onChange={e => this.setState({name: e.target.value})}
                    />
                    <Checkbox
                        label="Abierta"
                        value={locationOpen}
                        onChange={locationOpen => this.setState({locationOpen})}
                    />
                    <Input
                        label="Latitud"
                        type="number"
                        value={lat}
                        onChange={e => this.setState({lat: Number(e.target.value)})}
                    />
                    <Input
                        label="Nombre"
                        type="number"
                        value={lng}
                        onChange={e => this.setState({lng: Number(e.target.value)})}
                    />
                    <div style={styles.dialogButtonsContainer}>
                        {currentLocation && (
                            <Button
                                label="Eliminar"
                                onClick={this.onDelete}
                                color="#f44336"
                                type="button"
                            />
                        )}
                        <Button
                            label={currentLocation ? 'Guardar' : 'Crear'}
                            style={{marginLeft: 'auto'}}
                            type="submit"
                        />
                    </div>
                    {error && (
                        <FloatingMessage style={styles.error}>
                            {error}
                        </FloatingMessage>
                    )}
                </form>
            </Dialog>
        )
    }
}