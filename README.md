# Real-time locations editor example

## Steps to run

* Clone repository.
* Have SQL server running on port 3306  (or [configure](config/config.json) your own).


```
npm install
npm run create-db
npm start
```

## Application details

* React application for view.
* Mapbox GL JS for maps.
* Express server.
* SQL database.
* Sequelize ORM

## Challenges

### Using Mapbox Api in React

The approach I like to take when working with external Api's in React is first to create an abstraction of the Api using React components.

In this case we have 2 classes from the Mapbox Api: **Map** and **Marker**.

```jsx
const map = new mapboxgl.Map({
    container: el,
    style: 'mapbox://styles/mapbox/streets-v10',
    zoom: 12
});

const marker = new mapboxgl.Marker({
    element:el //custom icon
}).setLngLat([
    lng,
    lat
]).addTo(map);
```

Implementing those classes as React components looks something like this:
```jsx
class Map extends React.PureComponent {
    container = React.createRef();

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.container.current,
            style: 'mapbox://styles/mapbox/streets-v10',
            zoom: 12
        });
    }
    
    componentWillUnmount() {
        this.map.remove();
    }

    render() {
        return (
            <div
                {...this.props}
                ref={this.container}
            />
        )
    }
}

class Marker extends React.PureComponent {
    el = document.creatElement('div');
    
    componentDidMount() {
        const {map, lng, lat} = this.props;
        this.marker = new mapboxgl.Marker({
            element: this.el
        }).setLngLat([
            lng,
            lat
        ]).addTo(map);
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

    render() {
        return ReactDOM.createPortal((
            <CustomIcon/>
        ), this.el)
    }
}
```

Now that we have both components the problem is how to pass the Mapbox Map instance from the Map component to the Marker component.

We can declare a context for that:

```jsx
const MapContext = React.createContext();

const withMap = Component =>  props => (
    <MapContext.Consumer>
        {map => <Component {...props} map={map}/>}
    </MapContext.Consumer>
);
```

And then modifying our components like this:
```jsx
class Map extends React.PureComponent{
    // component code
    
    render() {
        return (
            <MapContext.Provider value={this.map}>
                <div
                    {...this.props}
                    ref={this.container}
                />
            </MapContext.Provider>
        )
    }
}

const Marker = withMap(class extends React.PureComponent{
    //component code
})
```
With this our components will be connected internally, the Marker component can read the map instance from the Map component as long as it is it's parent.

Now we can use the Mapbox Api just using React components like this:
```jsx
class App extends React.PureComponent{
    state = {
        locations:[
            {lat:10,lng:10},
            {lat:20,lng:20}
        ];
    };
    
    render(){
        const {locations} = this.state;
        return (
            <Map>
                {locations.map(({lat, lng}, i)=>(
                   <Marker
                        key={i}
                        lat={lat}
                        lng={lng}
                   /> 
                ))}
            </Map>
        )
    }
}
``` 

### Implementing real time updates

I decided to use Server-sent events over webSockets because it's easier to implement, and works perfectly for this simple application.

To implement we have to declare: 
* An array where we will store the client connections.
* A route in our server which will setup a new connection.
* A function to send a message to all the client connections.

```jsx
const connections = [];

router.get('/subscribe', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-transform',
        'Connection': 'keep-alive'
    })
    connections.push(res)
});

function sendMessage(payload) {
    connections.forEach(
        connection => connection.write(`data: ${JSON.stringify(payload)}\n\n`);
    );
}
```
And then we can send a message where we want:
```jsx
router.post('/', async function(req, res, next) {
    //create location code
    
    sendMessage({
        type: 'LOCATION_CREATED',
        location
    });
    res.send('success');
});
```
The implementation in the client looks something like this:
```jsx
    const source = new EventSource('/subscribe');
    source.onmessage = e => {
        const data = JSON.parse(e.data);
        if(data.type === 'LOCATION_CREATED'){
            // add location
        }
    };
    
```
 