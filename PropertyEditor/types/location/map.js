class Location_MapType extends BasePropertyType{
    constructor(){
        super({"en" : "Map", "ru" : "Карта"});
        
    }
    onCreate(){
        this._marker = undefined;
        this.map = undefined;
        this.value = {
            lat: 0,
            lot: 0
        };


        const widgetMain = new WidgetLayoutHorizontal();
        widgetMain.height = "100%";

        const widgetWrapper = new WidgetLayoutVertical();
        widgetWrapper.height = "300px";
        
        const widgetLon = new WidgetLayoutHorizontal();
        widgetLon.width = "40%";
        widgetLon.setStyleProp("minHeight","50px");
        widgetLon.setStyleProp("maxHeight","50px");
        const widgetLat = new WidgetLayoutHorizontal();
        widgetLat.width = "40%";
        widgetLat.setStyleProp("minHeight","50px");
        widgetLat.setStyleProp("maxHeight","50px");

        const latInput = new WidgetInput();
        const lngInput = new WidgetInput();

        const latLabel = new WidgetLabel();
        latLabel.text = "Широта";

        const lngLabel = new WidgetLabel();
        lngLabel.text = "Долгота";


        widgetLon.includeWidget(latLabel);
        widgetLon.includeWidget(latInput);


        widgetLat.includeWidget(lngLabel);
        widgetLat.includeWidget(lngInput);


        widgetWrapper.includeWidget(widgetLon);
        widgetWrapper.includeWidget(widgetLat);
        
        const widgetMap = new WidgetLayoutHorizontal();
        widgetMap.width = "100%";




        this.map = new WidgetGeoMap();
        this.map.setStyleProp("position","relative");
        this.map.height = "200px";
        this.map.width = "400px";
        widgetMap.includeWidget(this.map);

        
        this.map.map.map.on("click", (e) => {    
            this.value = {
                lat: e.latlng.lat,
                lot: e.latlng.lng
            }
            this.moveMarker(this.value.lat, this.value.lot);
            latInput.text = this.value.lat;
            lngInput.text = this.value.lot;
        })


        latInput.htmlElement.oninput = (e) => {
            const value = parseFloat(e.target.value);
            if(isNaN(value)) {
                e.target.value = this.value.lat;
                return;
            };
            this.value["lat"] = value;
            this.moveMarker(this.value.lat, this.value.lot);
        }
        lngInput.htmlElement.oninput = (e) => {
            const value = parseFloat(e.target.value);
            if(isNaN(value)) {
                e.target.value = this.value.lot;
                return;
            };
            this.value["lot"] = value;
            this.moveMarker(this.value.lat, this.value.lot);
        }

        widgetWrapper.includeWidget(widgetMap);
        widgetMain.includeWidget(widgetWrapper);
        this.widget = widgetMain;
    }
    moveMarker(lat,lon){
        if(typeof this._marker === "undefined"){
            const id = WidgetGeoMap.objectId++;
            this._marker = id;
            const parameters = {
                position: {
                    lon: lon,
                    lat: lat
                },
                
                GeoMapObject: {
                    GeoLayerObject: {
                        GeoObject: {
                            id: id,
                            events: []
                        }
                    },
                    maps: []
                }
            };
            WidgetGeoMap.createObject('Marker', parameters, id);
            
            geoManager.maps[this.map.id].addObjectToMap(id);
        } else {
            geoManager.objects[this._marker].setPos({lat: lat, lon: lon});
        }
        
    }
}