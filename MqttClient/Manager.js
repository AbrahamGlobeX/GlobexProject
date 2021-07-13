class MQTT_Manager {
    constructor(connecthandler, url, port, userName, userPassword)
    {
        this._client = null;
        this._path = "/wss";
        this._clientID = "mqtt_sub-" + (new Date()).getTime();
        
        this._connecthandler = connecthandler;
        this._userName = "5940a9c2f462ea2254c38e01";
        this._userPassword = APP.dbWorker.m_long_token+""+APP.dbWorker.m_short_token;
        //"357d95e6d831aff764ca4ffc27d80a480b6aec4b70d6b7f3f00f38abf31c12866214673eb39b42300998fe0cd50c41d139748b0387325c2cd03819ce6b98705a"
        this._url = "nbus.0070.ru";
        this._port = 48082;
        this._arrivedMessageHandler = null;

        console.log("this._userPassword",this._userPassword)
        this.onInit();

        window.mqtt_client = this;
    }
    onInit(){
        this._client = new Paho.MQTT.Client(this._url, this._port, this._path, this._clientID);

        this._client.onConnectionLost = this.connectionLost.bind(this);
	    this._client.onMessageArrived = this.messageArrived.bind(this);
        
	    this._client.connect({
            timeout : 30,
            mqttVersion : 3,
            cleanSession : true,
            onSuccess : this.connectionOpen.bind(this),
            onFailure : this.connectionFailure.bind(this),
            userName : this._userName,
            password : this._userPassword
        });
    }
    connectionLost(err){
        console.log("Lost connect", err);
    }
    connectionOpen(){
        console.log("connectionOpen");
        setTimeout(() => {
        Module.Store.dispatch({
            "eventName" : this._connecthandler
        });},0);
    }
    sendMessage(topic, text){
        let msg = new Paho.MQTT.Message(text);
        msg.destinationName = topic;//topic;
        this._client.send(msg);
    }
    messageArrived(msg){
        if(this._arrivedMessageHandler === null) return;
        setTimeout(() => {
            Module.Store.dispatch({
                "eventName" : this._arrivedMessageHandler,
                "value" : msg.payloadString
            });},0);
    }
    connectionFailure(err){
        console.log("connectionFailure",err);
    }
    subscribeTopic(topic){
        this._client.subscribe(topic);
    }
    unsubscribeTopic(topic){
        this._client.unsubscribe(topic);
    }
    startGetResponse(handler){
        this._arrivedMessageHandler = handler;
    }
    stopGetResponse(){
        this._arrivedMessageHandler = null;
    }
}