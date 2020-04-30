// Global variable for the Mapbox interactive map
var map;
// Global variable for the ID before the first symbol layer of the map. The satellite raster basemap
// will be placed above this first symbol layer so that it is optimally visible on the map
var satelliteLayerId;
// ID of the layer in the map to place the mode layers above so they are optimally visible
var rasterLayerId;
// Global variable for the Mapbox geocoder element
var geocoder_el;
// Global variable for the layers of the map
var layers;
// Global variable for the length of animation transitions. For example, when the opacity of a raster
// layer is triggered to change, this change will take "transition_len" seconds. 
var transition_len = 1000;
// Global variable of the text labels for each row of the legend
var labels = ["45-50","50-55","55-60","60-70","70-80","80-90",">90"];
// Global variable of the colors of the symbols for each row of the legend
var map_colors = ["rgb(255,193,7)","rgb(255,128,0)","rgb(255,0,0)","rgb(255,51,153)","rgb(163,0,204)","rgb(82,0,204)","rgb(0,0,255)"];
// The web viewer displays different mode buttons depending on what value the year slider has been 
// set to. In 2016, the mode buttons displayed are for aviation noise, road noise, and aviation+road
// noise. In 2018, the mode buttons displayed are for aviation noise, road noise, rail noise, 
// aviation+road noise, aviation+road+rail noise. 
// As will be described subsequently, there is an array called "modes" containing five objects.
// Each object describes how its corresponding mode button should be displayed. 
// The buttons_2016 variable is an array of indexes into this "modes" array indicating which buttons
// to display for 2016.
var buttons_2016 = [3,0,1];
// The buttons_2018 variable is an array of indexes into this "modes" array indicating which buttons
// to display for 2018. 
var buttons_2018 = [4,3,0,1,2];

// The array above for buttons_2018 is the version for release. Temporarily, due to there not being 
// data available for two of the mode buttons, the buttons_2018 variable will be set to the following 
// array (indicating the same three buttons should be displayed for 2018 as for 2016).
var buttons_2018 = [3,0,1];

// For every layer that can be added to the map, there is a unique ID for the source data stored in
// Mapbox. Each data source is a raster .mbtiles file that allows for quick rendering of rasters on 
// the web viewer.
// There are eight possible layers that can be displayed in the web viewer: aviation noise in 2016, 
// aviation noise in 2018, road noise in 2016, road noise in 2018, aviation+road noise in 2016, 
// aviation+road noise in 2018, rail noise in 2018, aviation+road+rail noise in 2018.
// Each layer is broken up into three data sources: a source with noise data for the continental United 
// States, a source with noise data for Alaska, and a source with noise data for Hawaii.
// The dictionary below connects the name of every source with its unique ID
var source_ids = {
    "icon_av_2016":"bts-geospatial.arxt3338",
    "icon_av_2016_ak":"bts-geospatial.0mkxo9wm",
    "icon_av_2016_hi":"bts-geospatial.4nzlq57z",
    "icon_av_2018":"bts-geospatial.c20b2kws",
    "icon_av_2018_ak":"bts-geospatial.6157icc2",
    "icon_av_2018_hi":"bts-geospatial.44tatt0y",
    "icon_road_2016":"bts-geospatial.8md7woa0",
    "icon_road_2016_ak":"bts-geospatial.3zjo1wye",
    "icon_road_2016_hi":"bts-geospatial.8m9qjdcj",
    "icon_road_2018":"bts-geospatial.4dqm8wsi",
    "icon_road_2018_ak":"bts-geospatial.7zdof0mt",
    "icon_road_2018_hi":"bts-geospatial.5k6sohfc",
    "icon_avroad_2016":"bts-geospatial.2c47as6b",
    "icon_avroad_2016_ak":"bts-geospatial.afpycwuh",
    "icon_avroad_2016_hi":"bts-geospatial.9548ov6g",
    "icon_avroad_2018":"bts-geospatial.2c47as6b",
    "icon_avroad_2018_ak":"bts-geospatial.0wb2bmj0",
    "icon_avroad_2018_hi":"bts-geospatial.amcxbj90",
    "icon_all_2018":"",
    "icon_all_2018_ak":"bts-geospatial.0wb2bmj0",
    "icon_all_2018_hi":"bts-geospatial.amcxbj90",
    "icon_rail_2018":""
}
// Mapbox GL access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYnRzLWdlb3NwYXRpYWwiLCJhIjoiY2syM2ZvYm53MWpwMDNkcXd2MWNnNm9idiJ9.po5FBF_C4WqfbyAcge-hVg';

// React functions
// React.js is a javascript library used to simplify designing user interfaces. It does so by breaking 
// the user interface down conceptually into "components" or widgets. The developer designs those
// components in code individually, and can then re-use and nest them like puzzle pieces to assemble
// the user interface.
// A slider would be one example of a "component", as would a radio button group and a legend. The legend is also
// an example of a nested component: the legend itself is a "parent component", with each row (containing a symbol
// and corresponding text) considered a "child component". The developer would write the code for the row of the
// legend, then re-use that code multiple times to create the full legend. 
// One of the especially powerful features of React.js is the fact that each component contains internal data 
// defining its state. For example, a radio button group's internal data or state would specify which button is 
// currently pressed.
// React.js efficiently re-renders components when their state changes (and only those
// components, instead of re-rendering the entire page). Parent components can also pass their data (called 
// "props") to their child components. The radio button group, for example, would have a state specifying which
// button is currently pressed. It would pass that data to its child components to indicate how each of them should 
// be displayed (pressed or not pressed). 

// Below are definitions for several React components that will be used to assemble the user interface
// Each React component returns HTML-based code specifying how to render the component on the web page, using
// data from props (from the parent component)

/**
 * React component for a slider
 *  @param props Data from the parent component 
 */
function My_Slider(props){
    return(
        <input 
        id="typeinp" 
        type="range" 
        // Minimum value is 2016 and maximum value is 2018
        min="2016" max="2018" 
        // Current value of the slider is the "year" property from props 
        value={props.year} 
        // The "onChange" event is triggered when the slider is moved
        // Handler for the "onChange" event is the "onChange" property from props, which is
        // the function to call when the "onChange" event occurs
        onChange={props.onChange}
        // Step size between the minimum and maximum value is 2, since the only valid years
        // are 2016 and 2018
        step="2"/>
    )
}

/**
 * React component for a mode button in the control panel
 *  @param props Data from the parent component 
 */
function Mode(props){
    return(
    <div className="btn_div">
        <button 
            // CSS styles for the button are passed in as the "classes" property from props
            className={props.classes} 
            // The "onClick" event is triggered when the button is clicked
            // Handler function for the "onClick" event is the "onClick" property from props
            onClick={props.onClick}
        >
        {/* Mode icon identified by className passed in from props */}
        <i className={props.value}></i>
        </button>
    </div>
      )
  }

/**
 * React component for a radio button group
 *  @param props Data from the parent component 
 */
function RadioGroup(props){
    // Each radio button is contained in a div
    // CSS style for the div containing a radio button
    var div_styles = {
        // "inline-block" ensures radio buttons are placed horizontally in a row instead of vertically
        // in a column 
        display:"inline-block"
     }
      return (
        <div style={div_styles}>
          {/* Radio button for the dark basemap background */}
          <div style={div_styles}>
            <input
              id="radio_dark"
              type="radio"
              value="dark"
              // The radio button is "checked" if the "radio_checked" property from props is equal to
              // "dark". The parent component's data (props) keeps track of which of the two radio
              // buttons is currently clicked.
              checked={props.radio_checked == "dark"} 
              // The "onChange" event is triggered when a radio button is clicked
              // Handler for the "onChange" event is the "onChange" property from props, which is
              // the function to call when the "onChange" event occurs
              onChange={props.onChange} 
            />
            {/* Label for the radio button */}
            <span>Dark</span>
          </div>

          {/* Div element to separate the two radio buttons in the group */}
          <div style={{display:"inline-block",width:"5px"}}></div>

          {/* Radio button for the satellite basemap background */}
          <div style={div_styles}>
            <input
              id="radio_satellite"
              type="radio"
              value="satellite"
              // The radio button is "checked" if the "radio_checked" property from props is equal to
              // "satellite". The parent component's data (props) keeps track of which of the two radio
              // buttons is currently clicked.
              checked={props.radio_checked == "satellite"}
              // The "onChange" event is triggered when a radio button is clicked
              // Handler for the "onChange" event is the "onChange" property from props, which is
              // the function to call when the "onChange" event occurs
              onChange={props.onChange}
            />
            {/* Label for the radio button */}
            <span>Satellite</span>
          </div>
        </div>
      )
}

/**
 * React component for a row of the Legend containing a colored symbol and its corresponding text label
 *  @param props Data from the parent component 
 */
function Legend_Div(props){
    // Separate the "props" input into its three constitutent components
    // "color" is the color of each colored symbol in the legend
    // "label" is the text label
    // "id_ind" is the id for the div containing the text label
    const {color,label,id_ind } = props;
    // CSS styles for the div containing the text label
    var textDiv_styles = {
        display:"block",
        textAlign:"center",
        borderRadius:"15px",
        flexGrow:1
    }
    // CSS styles for the colored symbol 
    var square_styles = {
        verticalAlign: "middle",
        // Color of the symbol is based on value from props
        backgroundColor: `${color}`,
        display:"table",
    };
    // CSS Flexbox layout used to dynamically align and distribute space among items to fill
    // their container 
    // In this case, each row of the legend contains two elements (colored symbol and text label),
    // which are placed horizontally in the same row. Using Flexbox, they are allowed to expand
    // to fill the entire width of the row
    // CSS styles for the Div containing the row of the legend
    var rowDiv_styles = {
        display:"flex",
        flexDirection:"row"
    }
    // CSS styles for the div containing the colored symbol
    var squareDiv_styles = {
        // "inline-block" ensures the elements are placed horizontally in the same row instead
        // of vertically in the same column
        display:"inline-block"
    }
    return(
        <div style={rowDiv_styles}>
            {/* Div containing the colored symbol */}
            <div style={squareDiv_styles}>
                <span style={square_styles}></span>
            </div>
            {/* Div containing the text label */}
            <div id={id_ind} style={textDiv_styles}>
                {label}
            </div>
        </div>
    )
}

// The previous React components were written as functions. The subsequent React components will be written as
// classes, due to being parent components with more complex definitions
/**
 * React component for the Legend
 */
class Legend extends React.Component{
    /**
     * Render a Legend_Div component (row of the legend with colored symbol and corresponding text label), 
     * as defined in the Legend_Div function
     *  @param i The colored symbol and text label will be determined by the index "i" passed in as input
     */
    renderLegend_Div(i){
        // Construct the id of the row of the legend based on the input index "i"
        var id_full = "legend_row_"+i.toString();
        // Render a Legend_Div component 
        return <Legend_Div 
                    id_ind={id_full} 
                    // The map_colors array contains the color for each symbol in the legend
                    // Set the color of the symbol in this Legend_Div child component to the i-th element
                    // of the map_colors array
                    color={map_colors[i]} 
                    // The labels array contains the text for each label in the legend
                    // Set the text of the label in this Legend_Div child component to the i-th element
                    // of the labels array
                    label={labels[i]}
                />
    }
    /**
     * Render a Legend component
     */
    render(){
        // CSS styles for the title header
        var header_styles = {
            fontWeight:"700",
            textAlign:"center"
        }
        // CSS styles for the title subheader
        var subheader_styles = {
            fontWeight:"500",
            textAlign:"center",
            fontStyle:"italic"
        };
        return(
        // Div for the legend
        <div className="legend">
            {/* Div for the legend title */}
            <div className="legend_title">
                <br></br>
                <p style={header_styles}>Noise (dBA)</p>
                <p style={subheader_styles}>24-hr LAeq</p>
                <br></br>
            </div>
            {/* Re-use the Legend_Div React child component multiple times to create each row 
            of the legend. For each row, pass in the appropriate index to specify the colored
            symbol and text label differently for each row */}
            {this.renderLegend_Div(6)}
            {this.renderLegend_Div(5)}
            {this.renderLegend_Div(4)}
            {this.renderLegend_Div(3)}
            {this.renderLegend_Div(2)}
            {this.renderLegend_Div(1)}
            {this.renderLegend_Div(0)}
        </div>
        )
    }
}

/**
 * React component for the entire application
 */
class Application extends React.Component {
    // For React components written as classes, "constructor" allows you to define the state or internal data of 
    // the component. This state or internal data changes dynamically as the user interacts with the application
    // and can be passed to any child components so they can be appropriately updated on the web page
    constructor(props) {
        // As per Javascript convention, the super() method needs to be called since this class is a child of the 
        // React.Component class that it extends. super() allows this child class (Application) to inherit methods 
        // and properties of the parent class (React.Component)
        super(props);
        // Define the state of the React component
        // "this" is a Javascript keyword that refers to the context an object belongs to. The value of "this"
        // changes depending on where it is used. In this case, since it is used within the constructor() method,
        // "this" refers to the Application class since that is the context the constructor() function belongs
        // to. If "this" was used outside of the constructor() method but still within the Application class, it 
        // would refer to the global window object for the web page, since that is the context the Application 
        // class belongs to.
        // "this.state" therefore refers to the "state" property of the Application class
        this.state = {
            // Array of five objects, each corresponding to one of the five possible mode buttons
            // to display in the control panel. Each object contains the name of the mode button,
            // the CSS classes used to display the button, and the active state of the button (either
            // true to indicate the button should be turned on, or false to indicate the button should
            // be turned off)
            modes:[{name:'icon_av',classes:"btn btn-dark",active:false},{name:'icon_road',classes:"btn btn-dark",active:false},{name:'icon_rail',classes:"btn btn-dark",active:false},{name:'icon_avroad',classes:"btn btn-warning",active:true},{name:'icon_all',classes:"btn btn-dark",active:false}],
            // Array of two objects, each corresponding to one of the two radio buttons in the 
            // radio button group used to toggle between basemaps.
            // Each object contains the id of the radio button, the "type" property which specifies 
            // how to render the HTML element corresponding to the radio button, and the name of the
            // radio button group the radio buttons belong to 
            radio_buttons:[{id:"dark",type:"radio",name:"rtoggle"},{id:"satellite",type:"radio",name:"rtoggle"}],
            // Property to keep track of which of the two radio buttons ("dark" or "satellite") is
            // currently selected in the radio button group
            radio_checked:"dark",
            // Property to keep track of which of the two years ("2016" or "2018") is currently 
            // selected by the year slider
            year:"2018",
            // Property to keep track of what year's data is not being displayed on the map
            other_year:"2016",
            // Property to keep track of which mode buttons to display on the map. "buttons_2018" 
            // is an array of indexes into the "modes" property of 'this.state" that indicates which
            // mode buttons to display. 
            buttons:buttons_2018
        };
        // When functions are called, their behavior might change depending on their context (specified by "this"). 
        // Context can change depending on where in the code the function is called from. For the functions below, 
        // they will not work correctly unless they execute within the same context every time, which should be
        // the Application class. To ensure that these functions execute within the context of the Application 
        // class, the "bind" method binds the desired context, passed in as an argument, to those functions so that
        // they consistently execute within the desired context. Since the value of "this" in the constructor() 
        // method is equal to the desired context (the Application class), the argument to the bind method is set to 
        // the value of "this". 
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    /**
     * Handler function to call when a radio button is clicked in the radio button group
     *  @param event Data for the change event
     */
    handleRadioChange(event) {
        // Value of the radio button that was clicked (either "dark" or "satellite")
        var layerId = event.target.value;
        // If the "satellite" button is clicked, turn on the satellite basemap layer
        if(layerId=="satellite"){
            map.turnOnSatellite();
        }
        // If the "dark" button is clicked, turn off the satellite basemap layer, which reveals the
        // underlying dark basemap layer
        else if(layerId=="dark"){
            map.turnOffSatellite();
        }
        // When the setState() method is called, the component state is changed and the view on the web
        // page changes accordingly to reflect the new state.
        // Change the state of the Application component's radio_checked property to the value of the clicked
        // radio button to update the view
        this.setState({
            radio_checked: event.target.value
        });
    }

    // In the control panel in the top right of the map, the section furthest to the right contains buttons
    // for each mode and mode combination that can be displayed on the map. The buttons can be toggled on and
    // off but only one button can be toggled "on" at a time. 

    // There are five possible mode buttons in the control panel: "Aviation", "Road", "Rail", "Aviation+Road",
    // "Aviation+Rail". 
    // When a button is pressed, the actions to take will change depending on the current state of the web viewer 
    // (i.e. which button in the control panel is currently pressed and what year the slider is set to). This state 
    // is described by the Application component state, which updates continuously as the user interacts with the web 
    // viewer. Concretely, as the user interacts with the mode buttons in the control panel, their state will
    // be stored in the "modes" array property of the Application component state. 
    
    // There are five objects in the "modes" array property, each corresponding to one of the five mode/
    // mode combinations. Since there are two possible years in this web viewer ("2016" and "2018"), 
    // there are ten possible layers that can be shown. For example, for the "Aviation" mode, the two possible
    // layers are "Aviation_2016" and "Aviation_2018", which can be toggled between using the "Year" slider.
    // For the "Aviation+Road" mode combination, the two possible layers are "Aviation+Road_2016" and 
    // "Aviation+Road+2018". 
    // Layers are displayed one at a time in the web viewer. If the user toggles on the "Aviation" button while
    // the slider is set to "2016", the "Aviation_2016" layer will be displayed. If they switch the slider 
    // to "2018", the "Aviation_2018" layer will be displayed and the "Aviation_2016" layer will be turned off.
    // If the "Aviation+Road" button is toggled on, the "Aviation" button will be toggled off. Therefore, 
    // the "Aviation_2018" layer will be turned off and the "Aviation+Road_2018" layer will be turned on. 
    // Note, however, that not all of the five possible mode/mode combinations are available for each year. 
    // In 2016, data for rail is not available. Therefore, the only allowed mode/mode combinations are 
    // "Aviation", "Road", and "Aviation+Road" (three total possible layers for 2016).
    // In 2018, rail data is available and all five mode/mode combinations are available (five total possible
    // layers for 2018).
    // Therefore, of the ten possible layers, only eight can be displayed. Specifically, the layers "Rail_2016" 
    // and "Aviation+Road+Rail_2016" are not available. 

    // Each object in the "modes" array corresponds to one of the five possible mode buttons and has three elements: 
    // the "name" of the mode/mode combination for the button, the CSS "classes" for the button, and the "active" 
    // state of the button (true or false). The handleClick() function below will be attached to each mode button, 
    // and execute a different set of actions for each mode button when clicked, depending on the button's state 
    // as described in the "modes" array. The input "i" allows the function to differentiate between the 
    // different mode buttons described by the "modes" array by ther index in the array. 
    // For example, the first element in the "modes" array corresponds to aviation. If the Aviation mode 
    // button was "active" before the user clicked it, the handleClick() function will change the display 
    // of the button to appear "off" and also turn off the Aviation layer for the current year after the user
    // clicks the button. The handleClick() function knows to do this for the Aviation layer only (and not 
    // for the other modes) based on the input index "i" which connects the Aviation mode button to the state 
    // described in the first element of the "modes" array. 

    /**
     * Handler function to call when the user clicks a mode button in the control panel
     *  @param i Index of an element in the "modes" array property of the Application component state
     */
    handleClick(i){
        // Create a copy of the "modes" array property of the Application component state
        var modes_new = this.state.modes.slice();
        // Store the value of the "year" property of the Application component state in "curr_year"
        // The "year" property of the Application component state indicates the year the map data should currently
        // display (i.e. the value the user has set the slider to)
        var curr_year = this.state.year;
        // Each layer in the map is identified by a unique ID that takes the form "icon_" + [mode] + "_" + [year]
        // where [mode] takes one of the five possible mode/mode combination values and [year] takes one of the two
        // possible year values (2016 or 2018). For example, the ID for the "Aviation_2016" layer is 
        // "icon_av_2016". The ID for the "Aviation+Road_2018" layer is "icon_avroad_2018". The ID for the
        // "Aviation+Road+Rail_2018" layer is "icon_all_2018" where "all" refers to all three modes. 
        // Construct the ID of the layer corresponding to the current mode and current year and store in "id_curr_year".
        // For example, if the "Aviation" button is clicked while the year slider is set to "2016", the ID stored 
        // in "id_curr_year" will be "icon_av_2016". 
        var id_curr_year = modes_new[i].name+'_'+curr_year.toString();
        // If the mode button that was clicked was "active" before being clicked, make it "inactive" and turn off
        // the corresponding layer
        if(modes_new[i].active==true){
            // Change the "classes" property of the object in the "modes" array to "btn btn-dark" to make it appear
            // inactive
            modes_new[i].classes = "btn btn-dark";
            // Change the "active" property of the object in the "modes" array to false to indicate the mode button
            // is now inactive
            modes_new[i].active = false;
            // Turn off the corresponding layer depending on the mode the button refers to 
            map.setModeOff(id_curr_year);
           
        }
        // If the mode button that was clicked was "inactive" before being clicked, make it "active" and turn on
        // the corresponding layer. Also turn off the previously "active" layer. 
        else if(modes_new[i].active==false){
            // For every object in the "modes" array perform the following
            for(var j=0;j<modes_new.length;j++){
                // If the mode/mode combination was previously active, make it "inactive" and turn off the
                // corresponding layer
                if(modes_new[j].active){
                    // Change the "classes" property of the object in the "modes" array to "btn btn-dark" to make it appear
                    // inactive
                    modes_new[j].classes = "btn btn-dark";
                    // Change the "active" property of the object in the "modes" array to false to indicate the mode button
                    // is now inactive
                    modes_new[j].active = false;
                    // Construct the ID of the layer corresponding to the current mode and current year and store in 
                    // "id_year".
                    var id_year = modes_new[j].name+'_'+curr_year.toString();
                    // Turn off the corresponding layer depending on the mode the button refers to 
                    map.setModeOff(id_year);
                }   
            }
            // After turning off the previously "active" mode/mode combination, you can turn on the new layer that
            // should be displayed.
            // Change the "classes" property of the object in the "modes" array to "btn btn-warning" to make it 
            // appear active
            modes_new[i].classes = "btn btn-warning";
            // Change the "active" property of the object in the "modes" array to true to indicate the mode is now
            // active 
            modes_new[i].active = true;
            // Turn on the corresponding layer depending on the mode the button refers to 
            map.addModeLayer(id_curr_year);
            map.setModeOn(id_curr_year);
        }
        // After making the changes to the modes_new array (indicating which previous mode/mode combination to
        // turn off and which new mode/mode combination to turn on), call the setState() function to finalize
        // those changes in the Application component class and tell React.js to re-render the view on the web page
        // accordingly 
        this.setState({
            modes:modes_new
        })
    }

    
    /**
     * Handler function to call when the user moves the slider
     *  @param event Data for the change event
     */
    handleChange(event){
        // The input (event) for the change event specifies the value the user has set the slider to
        // In this case, the slider can take one of two values: "2016" or "2018"
        var new_year = event.target.value;
        // The "year" property of the Application component state indicates the year the map data should currently
        // display (i.e. the value the user has set the slider to)
        // The "other_year" property of the Application component state indicates the other year that the map data
        // should not currently display. If "year" is set to "2018", "other_year" is set to "2016" and if "year"
        // is set to "2016", "other_year" is set to "2018". 
        // Set the value of the "year" property of the Application component state to the new value of the slider
        // Set the value of the 
        this.setState(()=>(
            {
                year: new_year,
                // Set "other_year" to "2018" if "year" is "2016", or set "other_year" to "2016" if "year" is "2018"
                other_year:(new_year=="2018") ? "2016" : "2018",
                // Change the set of available mode buttons in the control panel. If the year slider is set to 
                // "2016", display the mode buttons for 
                buttons:(new_year=="2018") ? buttons_2018 : buttons_2016
            }
        ),
        // The second argument to the setState() function is a callback function to call after the setState()
        // function completes and the new values for the state have been set. 
        this.handleChangeCallback
        )
    }

    /**
     * Callback function to call after setState() in the handleChange() method finishes executing
     */
    handleChangeCallback = () => {
        // The "modes" property of the Application component state describes how these mode buttons should be 
        // displayed, and is updated every time the user clicks a button on or off. 
        // The "modes "property is an array of five objects, each with three elements. Each object corresponds to a 
        // different mode/mode combination. The five possible mode/mode combinations are Aviation, Road, Rail,
        // Aviation+Road, and Aviation+Road+Rail. 
        // For each of the five objects in the "modes" array, the first element "name" is the name of a 
        // mode/mode combination. It corresponds to the CSS class of the icon displayed in the middle of the button 
        // and indicates which icon should be displayed in each button.
        // The second element "classes" lists the CSS classes for the button corresponding to the mode/mode 
        // combination. It changes depending on if the button is toggled on or off.
        // The third element "active" is a Boolean (true or false) indicating if the button is toggled on or off.

        // Create an array of the "active" property in each object of the "modes" array 
        var active_modes = this.state.modes.map(a => a.active);
        // The current value of "this" is the Application class, since that is the context the handleChangeCallback()
        // function belongs to 
        // In the following "for" and "if" blocks, the value of "this" will change, since the blocks are nested
        // within each other, thereby changing the context "this" refers to. 
        // Since we need "this" to refer to the Application class in order to be able to refer to its "state"
        // property, set a new variable "that" equal to the current value of "this". In this way, the variable 
        // "that" will consistently refer to the value of "this" we want. 
        var that = this;
        
        // For every mode/mode combination perform the following
        for(var i=0;i<active_modes.length;i++){
            // When the slider is changed by the user while a mode button is toggled on, the web viewer should 
            // switch from displaying data for the specified mode in the previous year to data for the specified
            // mode in the new year. For example, if the "Aviation" button is toggled on and the user changes the
            // slider from 2018 to 2016, the web viewer should switch from displaying the "Aviation_2018" layer
            // (with ID "icon_av_2018") to displaying the "Aviation_2016" layer (with ID "icon_av_2016"). 
            // The variable "id_other_year" is the ID of the layer that was displayed before the user changed the
            // slider
            // The variable "id_year" is the ID of the layer that should be displayed after the user changes the 
            // slider
            // To construct the strings for these two IDs, the data is derived from two sources. Recall the IDs
            // take the form "icon_" + [mode] + "_" + [year]. The portion "icon_"+[mode] can be derived from the
            // value of "name" in each object in the "modes" property of the Application component state. For
            // example, for "Aviation", the value of "name" in the corresponding object in the "modes" property 
            // is "icon_av", which corresponds to the "icon_" + [mode] portion of its ID where [mode] is "av" in
            // this case.  
            // The portion [year] can be derived from the value of the "year" or "other_year" properties in the 
            // Application component state.
            // For example, let's assume the "Aviation" mode button is toggled on. If the user shifts the slider to 
            // "2016", this means that the layer that was displayed before the slider changed was "Aviation_2018" with 
            // ID "icon_av_2018". This should be the value of "id_other_year".
            // The layer that should be displayed after the slider changes is "Aviation_2016" with ID "icon_av_2016". 
            // This should be the value of "id_year".
            // To construct these IDs, note that after the slider changes, the value of the "year" property in the 
            // Application component state will be set to "2016" and the value of the "other_year" property will be 
            // set to "2018". 
            
            // To construct the ID for the "id_other_year" variable, therefore, use the value of the "other_year" 
            // property of the Application component state ("2018" in this case). 
            // To construct the ID for the "id_year" variable, use the value of the "year" property ("2016" in this
            // case). 
            var id_other_year = that.state.modes[i].name+'_'+that.state.other_year.toString();
            var id_year = that.state.modes[i].name+'_'+that.state.year.toString();

            // Recall the for loop iterates over every object in the "modes" property of the Application component
            // state. If the current object's "active" property is set to true, this means that the mode/mode 
            // combination layer corresponding to the object should be displayed on the map. 
            // For this mode/mode combination, switch off the layer corresponding to the year before the user 
            // changed the slider and switch on the layer corresopnding to the year the user changed the slider to.
            if(active_modes[i]){
                // Turn off the mode/mode combination layer corresponding to the "other_year" (year before
                // the user changed the slider). Call different methods depending on the mode type
                map.setModeOff(id_other_year);
                // Recall that the "icon_rail_2016" and "icon_all_2016" layers are not available because rail data
                // is not available for 2016
                // If the layer to display after the user changes the slider is not one of these two layers, then
                // turn on the new layer for the current year. Call different methods depending on the mode type. 
                if((id_year!="icon_rail_2016")&&(id_year!="icon_all_2016")){
                    map.addModeLayer(id_year);
                    map.setModeOn(id_year);
                }
            }   
        }
    }

    /**
     * Render a Slider component, as defined in the My_Slider function
     */
    renderMy_Slider(){
        return (
            <My_Slider 
                // Pass the "year" property of the Application component state as props to the My_Slider 
                // component. This will determine the slider's current value. 
                year={this.state.year}
                // Pass the handleChange() function as props to the My_Slider component. This is the handler 
                // function to execute for an onChange event. 
                onChange={this.handleChange.bind(this)}
            />
        )
    }
    
    /**
     * Render a Legend component, as defined in the Legend function
     */
    renderLegend(){
        return <Legend />
    }

    /**
     * Render a RadioGroup component, as defined in the Legend function
     */
    renderRadioGroup(){
        return <RadioGroup 
                    // Pass the radio_checked property of the Application component state as props to the RadioGroup
                    // component. This property keeps track of which radio button is currently clicked. 
                    radio_checked={this.state.radio_checked} 
                    // Pass the handleRadioChange() function as props to the RadioGroup component. This is the handler
                    // function to execute for an onChange event.
                    onChange={this.handleRadioChange}
                />
    }
    
    /**
     * This function is called after the components are rendered (or "mounted") to the web page and is designed
     * to execute actions that can only take place once this has occurred. Specifically, in this case, the function
     * is used to load the interactive Mapbox map into the web page only after the element containing the map
     * has been rendered successfully 
     */
    componentDidMount() {
        // Add the interactive Mapbox map to the HTML page
        map = new mapboxgl.Map({
            // Div to place the map within
            container: this.map,
            // Default Mapbox dark basemap style
            style: 'mapbox://styles/mapbox/dark-v9',
            // Default zoom when the user opens the web viewer
            zoom:4,
            // Max zoom allowed
            maxZoom:12,
            // Min zoom allowed
            minZoom:4,
            // Default centering of the map when the user opens the web viewer
            // The coordinates are for the geographical center of the continental
            // United States
            center:[-98.5795,39.8283],
            // Turn off the default attribution control provided by Mapbox. 
            // Instead, a manual attribution control will be created ("i" icon
            // in the bottom right of the web viewer page).
            attributionControl: false,
        });
        // Perform the following after the map loads successfully
        map.on('load',function(){
            // Data source for Mapbox satellite base map
            map.addSource("mapbox-satellite", {
                "type": "raster",
                "url": "mapbox://mapbox.satellite",
                "tileSize": 256
            });

            // There are two options for basemaps in the web viewer: a dark basemap and satellite
            // basemap. The dark basemap is vector tiles, while the satellite basemap is a raster. 
            // By default the dark basemap is displayed. To switch to the satellite basemap, 
            // the satellite raster layer is added to the map and placed over the dark basemap. 
            // To switch back to the dark basemap, the satellite raster layer is hidden and removed
            // from the map. 
            /**
             * Turn on satellite basemap layer
             */
            map.turnOnSatellite = function() {
                map.addLayer({
                    "type": "raster",
                    "id": 'satellite_map',
                    "source": "mapbox-satellite",
                    // Initially set the opacity of the raster to 0. The "raster-opacity-transition"
                    // property determines how long it will take to transition from one raster opacity
                    // value to another. In this case, the variable "transition_len" specifies how
                    // many seconds the transition will take. 
                    "paint":{
                        'raster-opacity':0,
                        'raster-opacity-transition': {duration: transition_len}
                    }
                    // The second argument to the "paint" property is the ID of the layer in the map
                    // to place the new raster layer above. In this case, "rasterLayerId" is the ID
                    // of the map's first symbol layer. By placing the satellite basemap above this
                    // layer, this ensures that names of cities and places will continue to be visible
                    // from the underlying dark basemap. 
                    }, satelliteLayerId);
                // Change the opacity of the satellite basemap to visible (which occurs after the time
                // specified in "raster-opacity-transition")
                map.setPaintProperty('satellite_map','raster-opacity',0.6);
            }
        
            /**
             * Turn off satellite basemap layer
             */
            map.turnOffSatellite = function() {
                // Change the opacity of the satellite basemap to hidden
                map.setPaintProperty('satellite_map','raster-opacity', 0);
                // After the opacity has successfully changed to 0, remove the satellite basemap layer
                // from the map
                setTimeout(function(){ 
                    map.removeLayer('satellite_map')
                }, transition_len);
            }
            
            /**
             * Add layer for a mode in a particular year
             *  @param layer_source ID of layer to add
             */
            map.addModeLayer = function(layer_source){
                // Recall that there are eight possible layers for the map. For example, there is 
                // a layer for aviation noise in 2016, a layer for road noise in 2016, a layer for
                // aviation noise in 2018, etc. Each of these layers has a unique ID associated with 
                // it. For example, the ID for the layer of aviation noise in 2016 is "icon_av_2016".
                // The ID for the layer of aviation noise in 2018 is "icon_av_2018" and the ID for
                // the layer of road noise in 2016 is "icon_road_2016". This ID is passed into this
                // function as an argument to identify which layer to add to the map. 
                // Recall also that each of the eight possible layers is broken up into three 
                // data sources, with one being for the continental United States, the second being
                // for Alaska, and the third being for Hawaii. Therefore, there are three calls to the
                // map.addLayer() function to add data from all three data sources to the map. 
                // Note that the input argument "layer_source" is the ID of the source data for the 
                // continental United States. The ID of the source data for Alaska appends "_ak" to that
                // ID, while the ID of the source data for Hawaii appends "_hi" to that ID. For example,
                // if the input "layer_source" to the function is "icon_av_2016", "icon_av_2016" is the
                // ID of the source with data for the continental United States. The ID of the source 
                // data for Alaska is "icon_av_2016_ak" and the ID of the source data for Hawaii is 
                // "icon_av_2016_hi".

                // Add source data for continental United States
                map.addSource(layer_source,{
                    "type": "raster",
                    "url": "mapbox://"+source_ids[layer_source],
                    "tileSize": 128
                });
                // Add layer for source data of continental United States 
                map.addLayer({
                    "type": "raster",
                    "id": layer_source,
                    "source": layer_source,
                    "paint":{
                        'raster-opacity':0,
                        'raster-opacity-transition': {duration: transition_len}
                    }
                }, rasterLayerId);

                // The rail 2018 layer is the only one that does not have data sources for Alaska and
                // Hawaii. Run the following code block for all mode layers except rail
                if(layer_source!='icon_rail_2018'){
                    // Add source data for Alaska
                    map.addSource(layer_source+'_ak',{
                        "type": "raster",
                        "url": "mapbox://"+source_ids[layer_source+'_ak'],
                        "tileSize": 128
                    });
                    // Add layer for source data of Alaska
                    map.addLayer({
                        "type": "raster",
                        "id": layer_source+'_ak',
                        "source": layer_source+'_ak',
                        "paint":{
                            'raster-opacity':0,
                            'raster-opacity-transition': {duration: transition_len}
                        }
                    }, rasterLayerId);

                    // Add source data for Hawaii
                    map.addSource(layer_source+'_hi',{
                        "type": "raster",
                        "url": "mapbox://"+source_ids[layer_source+'_hi'],
                        "tileSize": 128
                    });
                    // Add layer for source data of Hawaii 
                    map.addLayer({
                        "type": "raster",
                        "id": layer_source+'_hi',
                        "source": layer_source+'_hi',
                        "paint":{
                            'raster-opacity':0,
                            'raster-opacity-transition': {duration: transition_len}
                        }
                    }, rasterLayerId);
                }
            }

            /**
             * Make a layer for a mode in a particular year visible
             *  @param layer_source ID of layer to add
             */
            map.setModeOn = function(layer_source){
                // Recall that each of the eight possible layers is broken up into three 
                // data sources, with one being for the continental United States, the second being
                // for Alaska, and the third being for Hawaii. Therefore, there are three calls to the
                // map.setPaintProperty() function to make visible data from all three data sources

                // Change the opacity of the layer for the continental United States to visible
                map.setPaintProperty(layer_source,'raster-opacity', 0.8);
                // The rail 2018 layer is the only one that does not have data sources for Alaska and
                // Hawaii. Run the following code block for all mode layers except rail
                if(layer_source!='icon_rail_2018'){
                    // Change the opacity of the layer for Alaska to visible
                    map.setPaintProperty(layer_source+'_ak','raster-opacity', 0.8);
                    // Change the opacity of the layer for Hawaii to visible
                    map.setPaintProperty(layer_source+'_hi','raster-opacity', 0.8);
                }
            }

            /**
             * Make a layer for a mode in a particular year visible
             *  @param layer_source ID of layer to add
             */
            // Recall that each of the eight possible layers is broken up into three 
            // data sources, with one being for the continental United States, the second being
            // for Alaska, and the third being for Hawaii. Therefore, there are three calls to the
            // map.setPaintProperty() function to make hidden data from all three data sources
            map.setModeOff = function(layer_source){
                // Change the opacity of the layer for the continental United States to hidden
                map.setPaintProperty(layer_source,'raster-opacity', 0);
                // After the layer is hidden, remove the layer and source from the map
                setTimeout(function(){ 
                    map.removeLayer(layer_source);
                    map.removeSource(layer_source);
                }, transition_len);
                // The rail 2018 layer is the only one that does not have data sources for Alaska and
                // Hawaii. Run the following code block for all mode layers except rail
                if(layer_source!='icon_rail_2018'){
                    // Change the opacity of the layer for Alaska to hidden
                    map.setPaintProperty(layer_source+'_ak','raster-opacity', 0);
                    // After the layer is hidden, remove the layer and source from the map
                    setTimeout(function(){ 
                        map.removeLayer(layer_source+'_ak');
                        map.removeSource(layer_source+'_ak');
                    }, transition_len);
                    // Change the opacity of the layer for Hawaii to hidden
                    map.setPaintProperty(layer_source+'_hi','raster-opacity', 0);
                    // After the layer is hidden, remove the layer and source from the map
                    setTimeout(function(){ 
                        map.removeLayer(layer_source+'_hi');
                        map.removeSource(layer_source+'_hi');
                    }, transition_len);
                }
            }
            
            // Store all the layers in the map in the variable "layers"
            layers = map.getStyle().layers;
            // Find the index of the first symbol layer in the map and store in the variable 
            // "rasterLayerId"
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol') {
                    rasterLayerId = layers[i].id;
                    satelliteLayerId = layers[i-1].id;
                    break;
                }
            };

            // When the user opens the web viewer application, default to displaying aviation and
            // noise data for 2016
            // Add the data for aviation and noise data in 2016 to the map
            map.addModeLayer('icon_avroad_2018');
            // Make the layers with aviation and noise data in 2016 visible 
            map.setModeOn('icon_avroad_2018');

            // Initialize the Mapbox geocoder
            var geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            })
            // Add the Mapbox geocoder to the map
            geocoder_el = geocoder.onAdd(map);
            // Change the default text in the geocoder to read "Enter Location:" 
            geocoder_el.children[1].placeholder = "Enter Location:"
            // Place the geocoder in the HTML div element with ID "search"
            document.getElementById("search").appendChild(geocoder_el);
            // Add manual attribution control ("i" button in the bottom right of the web viewer)
            map.addControl(new mapboxgl.AttributionControl({
                compact: true,
                customAttribution: (
                        '<p style="color:#394E39;font-size:12px;"><strong>SOURCES: </strong>Map created by the Office of Spatial Analysis and Visualization at the Bureau of Transportation Statistics, U.S. Department of Transportation. For any edits or corrections to this map, please <a href="mailto:ed.strocko@dot.gov" target="_blank"><strong><u>contact us</u></strong></a>.</p>')
            }));
        })
            
        
    }
    /**
     * Render the application
     */
    render() {
        return (
        <div>
            {/* The map ref specifies that the interactive Mapbox map should be drawn to the HTML
            page in a new div below */}
            <div ref={el => this.map = el} className='map' />
            {/* BTS logo image */}
            <img className="image" src={'BTS_logo.png'} />
            {/* The description of the application */}
            <div className="header panel">
                <div>
                    {/* The <i> tags display the mode icons, depending on the class
                    name specified */}
                    <p>View Aviation (<i className='icon_av modeText'></i>
                    ), Road (<i className='icon_road modeText'></i>
                    ), Rail (<i className='icon_rail modeText'></i>
                    ) Noise in the U.S. for 2016 and 2018
                    </p>
                </div>
            </div>
            {/* Div container for the control panel */}
            <div className="container">
                {/* Div for the mode buttons */}
                <div className="main1 panel">
                    <div>
                        <span><strong>Mode:</strong></span>
                        {/* A different set of mode buttons is displayed depending on which value
                        the year slider is set to. As described previously, the "modes" property
                        of the Application component state is an array of objects describing how
                        to display each mode button. The "buttons" property of the Application
                        component state is an array of indexes, indicating which of the mode
                        buttons in the "modes" array should be displayed at any given time. When the
                        year is 2016, three buttons are displayed, but when the year is 2018, five
                        buttons are displayed. The code below renders one Mode component for
                        each index in the "buttons" array and uses the information in the corresponding
                        object in the "modes" property of the Application component state to 
                        pass relevant data as props to render the button */}
                        {this.state.buttons.map((value) => {
                            return (
                                // The key property is a unique value required when creating a list
                                // of objects using React
                                // The "inline-block" property ensures that mode buttons are placed
                                // horizontally adjacent to each other in a row
                                <div key={value} style={{display:"inline-block"}}>
                                    {/* Div container to create a 5px wide space between mode 
                                    buttons */}
                                    <div style={{display:"inline-block",width:"5px"}}></div>
                                    {/* Mode component */}
                                    <Mode 
                                        value={this.state.modes[value].name}
                                        onClick={()=>this.handleClick(value)}
                                        classes={this.state.modes[value].classes}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
                {/* Div for the year slider */}
                <div className="main2 panel">
                    <div>
                        <div className="year_filter">
                            <span><strong>Year: </strong></span><span style={{fontSize:"12px"}}>2016</span>
                            {/* Render the Slider component */}
                            {this.renderMy_Slider()}
                            <span style={{fontSize:"12px"}}>2018</span>
                        </div>
                    </div>
                </div>
                {/* Div for the radio button group */}
                <div className="main3 panel">
                    <div>
                        <span><strong>Map:</strong></span>
                        {/* Div container to create a 5px wide space between the label and the 
                        radio button group itself */}
                        <div style={{display:"inline-block",width:"5px"}}></div>
                        {/* Render the Radio Button Group component */}
                        {this.renderRadioGroup()}
                    </div>
                </div>
                {/* Div for the Mapbox geocoder */}
                <div className="searchBar panel" id="search"></div>
            </div>
            {/* Render the Legend component */}
            {this.renderLegend()}
        </div>
        )
    }
}

// Render the Application component and place it within the div element on the HTML page with id "app" 
ReactDOM.render(<Application />, document.getElementById('app'));