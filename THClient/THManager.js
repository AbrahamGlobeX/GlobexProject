var thManager = null;
class THManager{
    constructor()
    {
        thManager = this;
        /*this._url = properties.url;
        this._port = properties.port;*/
        this._url = "nbus.tzkmp";
        this._port = "48077";
        this._socket = null;
        this._requestID = 0;

        this._requestList = [];
        this._requestIDAnswers = [];
        this._bindsTopicHandler = [];
        this._clientID = null;
        this._directListener = null;
        this.connectToWebSocket();
        
    }
    connectToWebSocket()
    {
        const url = "ws://"+this._url + ":" + this._port;
        this._socket = new WebSocket(url);
        this._socket.binaryType = "arraybuffer";
        this._socket.onopen = this.openSocket.bind(this);
        this._socket.onmessage = this.messageSocket.bind(this);
        this._socket.onclose = this.closeSocket.bind(this);
        this._socket.onerror = this.errorSocket.bind(this);
    }
    openSocket(event)
    {
        console.log('THClient openSocket',event);
        while(this._requestList.length != 0)
        {
            const request = this._requestList.shift();
            this._socket.send(request);
        }

    }
    closeSocket(event)
    {
        console.log('THClient closeSocket',event);

    }
    messageSocket(event)
    {
        let data = new Uint8Array(event.data);
        if(data[data.length-1] === 255 && data[data.length-2] === 255) // answer from topic server (different clients)
        {
            data = data.slice(0,data.length-4); // id server answer
            const senderClientID = this.parseFromUint8ToHexString(data.slice(data.length-4).reverse()); 
            data = data.slice(0,data.length-4);
            const topicLength = data[data.length-1] + data[data.length-2]; // check topic length
            data = data.slice(0, data.length-2);
            let str = this.ABToStr(data);
   
            if(topicLength === 0) // direct
            {
                if(this._directListener === null) return;
                const msg = this.ABToStr(data);
                const Obj = {
                    type: 'direct',
                    msg: msg,
                    senderClientID: senderClientID
                }
                Module.Store.dispatch({
                    'eventName' : this._directListener,
                    'value' : Obj
                });
                return;
            }
            else // send
            {
                const topicName = str.slice(-topicLength);
                str = str.slice(0,str.length-topicLength);
                const flag = str[str.length-1];
                str = str.slice(0,str.length-1);
                const msg = str;
                const Obj = {
                    type: 'send',
                    topic: topicName,
                    flag: flag,
                    msg: msg,
                    senderClientID: senderClientID
                }
                const eventName = this._bindsTopicHandler[topicName];
                if(typeof eventName !== "string")
                {
                    console.error("THClient ERROR #4");
                    return;
                }
                Module.Store.dispatch({
                    'eventName' : eventName,
                    'value' : Obj
                });
                return;
            }
        }
        const request = this._requestIDAnswers[data[data.length-1]];
        delete this._requestIDAnswers[data[data.length-1]];
        //debugger;
        if(typeof request.type === 'undefined') 
        {
            console.error("THClient ERROR #1");
            return;
        }
        switch(request.type)
        {
            case "reg": 
            {
                //
                this._clientID = this.parseFromUint8ToHexString(data.slice(0,4).reverse());
               
                Module.Store.dispatch({
                    'eventName' : request.handler,
                    'value' : this._clientID
                });
                return;
            }
            case "sub": 
            {
                break;
            }
            case "unsub":
            {
                break;
            }
            case "send":
            {
                // data = data.slice(0,data.length-4); // id client request
                // console.log('send answer',this.ABToStr(data));
                break;
            }
            case "list":
            {
                data = data.slice(0,data.length-4); // id client request
                let clients = [];
                while(data.length != 0)
                {
                    clients.push(this.parseFromUint8ToHexString(data.slice(-4).reverse()));
                    data = data.slice(0, data.length-4);
                }
                Module.Store.dispatch({
                    'eventName' : request.handler,
                    'value' : clients
                });
                return;
            }
            case "direct":
            {
                // data = data.slice(0,data.length-4); // id client request
                // console.log('direct answer',this.ABToStr(data));
                break;
            }
            default:
                {
                    console.error("THClient ERROR #2");
                    return;
                }
        }
    }
    errorSocket(event)
    {
        console.log('THClient errorSocket',event);
    }
    request(handler,type, topic, msg, directID)
    {
        if(this._socket === null) return;
        
        this._requestID++;
        if(this._requestID > 255) this._requestID = 0;

        let typeLength = 0;
        let topicLength = 0;
        let requestMSG = null;
        let directArrayID = null;
        switch(type)
        {
            case "reg": 
            {
                typeLength = 3;
                break;
            }
            case "sub": 
            {
                this._bindsTopicHandler[topic] = handler;
                typeLength = 3;
                requestMSG = new Uint8Array(this.strToAB(topic));
                break;
            }
            case "unsub": 
            {
                delete this._bindsTopicHandler[topic];
                typeLength = 5;
                
                requestMSG = new Uint8Array(this.strToAB(topic));
                break;
            }
            case "list" : 
            {
                typeLength = 4;
                requestMSG = new Uint8Array(this.strToAB(topic));
                break;
            }
            case "send": 
            {
                typeLength = 4;
                topicLength = topic.length;
                requestMSG = new Uint8Array(this.strToAB(msg+""+topic));
                break;
            }
            case "direct": 
            {
                typeLength = 6;
                requestMSG = new Uint8Array(this.strToAB(msg));
                if(typeof directID === 'string')
                {
                    directArrayID = this.parseFromHexStringToUint8Array(directID).reverse();
                }
                break;
            }
            default:
                {
                    typeLength = -1;
                }
        }
        if(typeLength === -1)
        {
            console.error("THClient ERROR #3");
            return;
        }
        let typeArray = new Uint8Array(this.strToAB(type));
        let totalLength = 1 + typeLength + 1 + 4;
        if(requestMSG !== null) 
        {
            totalLength += requestMSG.length;
            if(type === "send") totalLength += 2;
        }
        if(directArrayID !== null) totalLength += directArrayID.length;

        let offset = 0;
        let request = new Uint8Array(new ArrayBuffer(totalLength));
        request[offset++] = typeLength;
        request.set(typeArray,offset);
        offset += typeArray.length;
        request[offset++] = 0;
        if(requestMSG !== null)
        {
            request.set(requestMSG,offset);
            offset += requestMSG.length;
        }  
        if(topicLength !== 0) 
        {

            request[offset++] = topicLength << 28 >> 28;
            request[offset++] = topicLength >> 8;
        }
        if(directArrayID !== null) 
        {
            request.set(directArrayID,offset);
            offset += directArrayID.length;
        }
        request.set(this.getRequestID(),offset);

        this._requestIDAnswers[this._requestID] = {'type':type,'handler':handler};
        

        if(this._socket.readyState === WebSocket.OPEN)
            this._socket.send(request);
        else this._requestList.push(request);
    }
    setDirectListener(handler)
    {
        this._directListener = handler;
    }
    getRequestID()
    {
        return new Uint8Array([0,0,0,this._requestID]);
    }
    parseFromHexStringToUint8Array(string)
    {
        
        if(string.length & 8 != 0) return null;   
        const size = string.length / 2;  
        let array = new Uint8Array(new ArrayBuffer(size));
        for(let i = 0, j = 0; i < string.length; j++, i+=2)
        {
            array[j] = parseInt(string.slice(i,i+2),16);
        }
        return array;
    }
    parseFromUint8ToHexString(arraybuffer)
    {
        let resultstring = "";
        let res = 0;
        for(let i = 0; i < arraybuffer.length; i++)
        {
            res = res << 8;
            res += arraybuffer[i];
        }
        resultstring = ('00000000' + res.toString(16)).slice(-8);
        return resultstring;
    }
    strToAB(str) {
        return new Uint8Array(str.split('')
            .map(c => c.charCodeAt(0))).buffer;
    }
    ABToStr(ab)
    {
        return new Uint8Array(ab).reduce((p, c) =>
        p + String.fromCharCode(c), '');
    } 
    closeWebSocket()
    {
        this._socket.close(1000);
    }

}