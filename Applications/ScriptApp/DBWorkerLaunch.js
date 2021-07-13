/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
/* global APP */

// eslint-disable-next-line no-unused-vars
class DBWorkerLaunch {

	constructor() {

		this.m_socketRequestAdress = "ws://nbus.0070.ru:48078";
		this.m_socket = null;
		this.m_sesKey = "";
		this.m_long_token = "";
		this.m_short_token = "";
		this.m_inited = false;

		this.m_loadedOID = "";
		this.m_loadedFunc = null;
		
		
		this.m_blockPattent = "602e8135b0125500080c8192";
		this.m_libraryPattent = "602e8108b0125500080c818c";
		
		this.initialize();
		
	}

	initialize() {
		this.connectToWebSocketServer();
		sendPostRequest("/user/status", "", this.onCheckUserStatus.bind(this));
	}

	setLoadObject(oid) {
		this.m_loadedOID = oid;
	}

	setLoadFunc(func) {
		this.m_loadedFunc = func;
	}

	connectToWebSocketServer() {
		// WebSocket connection
		this.m_socket = new WebSocket(this.m_socketRequestAdress);
		this.m_socket.onopen = this.openSocketConnection.bind(this);
		this.m_socket.onmessage = this.socketMessage.bind(this);
		this.m_socket.onclose = this.closeSocketConnection.bind(this);
		this.m_socket.onerror = this.errorSocketConnection.bind(this);
	}

	openSocketConnection() {
		console.log("WS Соединение установлено");
	}

	// eslint-disable-next-line max-lines-per-function
	// eslint-disable-next-line complexity, max-lines-per-function
	socketMessage(event) {
		// Remove 0F0F0F0F
		let dataStr = event.data;
		const indexEnd = dataStr.indexOf("0F0F0F0F");
		if (indexEnd !== -1) {
			dataStr = dataStr.substr(0, indexEnd);
		}

		// Parse JSON
		const dataJson = JSON.parse(dataStr);
		if (!dataJson) {
			console.error("Cant parse socket request to JSON!", dataStr);
		}

		// Check on error
		if (dataJson.error) {
			console.error("Socket error request!", dataStr);
		} else {
			const resultId = dataJson.id;
			const resultJson = dataJson.result;
			if (resultId === "GetNewTokens") {
				this.responseNewTokens(resultJson);
				if (!this.m_inited) {
					this.m_inited = true;
					this.requestGetListApplicationObjects();
					this.requestGetRexScripts();
					this.requestLibrariesEditorLibsList();

					if (this.m_loadedOID.length) {
						this.requestGetApplicationObject(this.m_loadedOID);
					}

				}
			} else if (resultId === "GetListApplicationObjects") {
				this.responseGetListApplicationObjects(resultJson);
			} else if (resultId === "GetApplicationObject") {
				this.responseGetApplicationObject(resultJson);
			 }/* else if (resultId === "GetStandartJSLibraries") {
			 	this.responseGetStandartJSLibraries(resultJson);
			}*/ else if (resultId === "GetStandartJSBlocks") {
				this.responseGetStandartJSBlocks(resultJson);
			} else if (resultId === "GetRexScripts") {
				this.responseGetRexScripts(resultJson);
			} else if (resultId === "GetRexScriptObject") {
				this.responseGetRexScriptObject(resultJson);
			} else if (resultId === "GetOnlyBlocks") {
				this.responseGetOnlyBlocks(resultJson);
			} else if (resultId === "LibrariesEditorLibsList") {
				this.responseLibrariesEditorLibsList(resultJson);
			} else if (resultId === "LibrariesEditorBlocks") {
				this.responseLibrariesEditorBlocks(resultJson);
			} else if (resultId === "GetUserLibraries") {
				this.responseUserLibraries(resultJson);
			} else if (resultId === "LEInsertLib") {
				APP.libraryEditor.onCreateLibEvent(resultJson);
			} else if (resultId === "LEInsertBlock") {
				APP.libraryEditor.onCreateBlockEvent(resultJson);
			} else if (resultId === "DOLMongoRequest") {
				try {
					this.responseDOLMongoRequest(resultJson);
				} catch(e){}
			}
		}
	}

	closeSocketConnection(event) {
		console.log('[close] Соединение прервано');
		this.m_socket = null;
		this.connectToWebSocketServer();
	}

	errorSocketConnection(event) {
		console.log("Error WS", event.message);
		const closingCode = 3;
		if (this.m_socket.readyState === closingCode) {
			this.m_socket = null;
		}
	}



	onCheckUserStatus(event) {

		const dataJson = JSON.parse(event.target.response);
		console.log('dataJson', dataJson);
		if(dataJson.hasOwnProperty("message")){
			APP.log("error",dataJson.message);
			return;
		}
		const auth = dataJson.authenticated;
		const name = dataJson.user.username;
		const key = dataJson.user.as_user_id;

		if (auth) {
			if (key === "57e39cd0d75c2574ed907e49") {
				APP.auth = false;
				sendPostRequest("/api/agnsk", "", this.setNewSessionKey.bind(this));
				APP.log("warn", "User is not authorized");
			} else {
				APP.auth = true;
				sendPostRequest("/api/ugnsk", "", this.setNewSessionKey.bind(this));
				APP.log("info", "User authorized:\n" + name);
			}
			APP.username = name;
			APP.owner = key;
		}

		this.m_inited = false;
		APP.UI.createTopRightBar();
		APP.UI.usernameDiv.textContent = name;

	}

	sendBaseRCRequest(id, collection, filterDataObject, onlyProjectoin) {

		if (!this.m_socket) {
			console.error("Can`t send ws request! WS is null!");
			return;
		}

		let request =
			'02rc00{' +
			'"v": "1.0",' +
			'"id": "' + id + '",' +
			'"tokens": {' +
			'	"token_long": "' + this.m_long_token + '",' +
			'	"token_short": "' + this.m_short_token + '"' +
			'},' +
			'"cmd": {' +
			'	"find": "' + collection + '",' +
			'	"filter": ' + filterDataObject + ',' +
			'	"batchSize": 1500' +
			'	}';
		if (onlyProjectoin) {
			request +=
				'	,"projection": {' +
				'		"meta": true' +
				'	}';
		}
		request += '}0f0f0f0f';
		console.log('sendBaseRCRequest',request);
		this.m_socket.send(request);

	}

	sendInsertRCRequest(id, objectData) {

		if (!this.m_socket) {
			console.error("Can`t send ws request! WS is null!");
			return;
		}

		const request =
			'02rc00{' +
			'"v": "1.0",' +
			'"id": "' + id + '",' +
			'"tokens": {' +
			'	"token_long": "' + this.m_long_token + '",' +
			'	"token_short": "' + this.m_short_token + '"' +
			'},' +
			'"cmd": {' +
			'	"insert": "objects",' +
			'	"documents": [' + objectData + ']' +
			'	}}0f0f0f0f';
		this.m_socket.send(request);

	}

	sendUpdateRCRequest(id, oid, objectSetsData) {

		if (!this.m_socket) {
			console.error("Can`t send ws request! WS is null!");
			return;
		}

		const request =
			'02rc00{' +
			'"v": "1.0",' +
			'"id": "' + id + '",' +
			'"tokens": {' +
			'	"token_long": "' + this.m_long_token + '",' +
			'	"token_short": "' + this.m_short_token + '"' +
			'},' +
			'"cmd": {' +
			'	"update": "objects",' +
			'	"updates": [{' +
			'				"q": {"_id": { "$oid": "' + oid + '"}},' +
			'				"u": ' + objectSetsData +
			'				}],' +
			'	"batchSize": 1' +
			'	}}0f0f0f0f';

		this.m_socket.send(request);

	}

	setNewSessionKey(postRequestEvent) {
		console.log("===================================setNewSessionKey=============================");
		let dataJSON = null;

		try {
			dataJSON = JSON.parse(postRequestEvent.target.response);
		} catch (e) {
			return;
		}
		console.log('dataJson', dataJSON);
		this.m_sesKey = dataJSON.key;
		
		// ADD TO BROWSER URL
		insertParam("ses_key", this.m_sesKey);
		
		if (!APP.initedSesKey) {
			APP.initedSesKey = this.m_sesKey;
		}
		
		this.requestNewTokens();

	}

	requestNewTokens() {
		if (!this.m_socket) {
			console.error("Cant get new tokens! Socket is null!");
			return;
		}

		const ddd =
			'04auth00{' +
			'	"id": "GetNewTokens",' +
			'	"jsonrpc": "2.0",' +
			'	"method": "GetSession",' +
			'	"params": {' +
			'		"key": "' + this.m_sesKey + '"' +
			'	}' +
			'}0f0f0f0f';
		console.log("seskey",this.m_sesKey);
		this.m_socket.send(ddd);

	}

	responseNewTokens(jsonTokens) {
		if ("token_long" in jsonTokens && "token_short" in jsonTokens) {
			this.m_long_token = jsonTokens.token_long;
			this.m_short_token = jsonTokens.token_short;
			console.log("NEW TOKENS: ", this.m_long_token, this.m_short_token);
		}
	}



	requestGetListApplicationObjects() {
		const request = '{"meta.pattern": {"$oid": "' + APP.pattern + '"}}';
		this.sendBaseRCRequest("GetListApplicationObjects", "objects", request, true);
	}

	responseGetListApplicationObjects(resultJson) {
		if ("cursor" in resultJson) {
			const cursorJson = resultJson.cursor;
			if (cursorJson.firstBatch.length > 0) {
				APP.scriptsList = cursorJson.firstBatch;
			}
		}
	}



	requestGetApplicationObject(oid) {

		const standartOIDLength = 24;
		if (oid.length !== standartOIDLength) {
			console.error(" OID size !== 24!");
			return;
		}

		const filterRequest = '{"_id": {"$oid": "' + oid + '"}}';
		this.sendBaseRCRequest("GetApplicationObject", "objects", filterRequest, false);
	}

	// eslint-disable-next-line max-lines-per-function
	responseGetApplicationObject(resultJson) {

		if ("cursor" in resultJson) {
			const cursorJson = resultJson.cursor;
			const jsonObj = cursorJson.firstBatch[0];
			
			if (!jsonObj) {
				console.error("Can`t load object!");
				return;
			}
			
			let firstOjb = jsonObj.object;
			try {
				if (firstOjb[0] !== "{") {
					firstOjb = JSON.parse(b64DecodeUnicode(jsonObj.object));
				}
			} catch (e) {
				// console.log(console.warn("Error parse base64!"));
				APP.log("error", "Error parse base64!");
					
				const decodeStrTest = decode_base64_experimental(firstOjb);
				console.warn("EXPERIMENTAL BASE64 DECODE");
				try {
					firstOjb = JSON.parse(decodeStrTest);
				} catch (e2) {
					APP.log("warn", "Error parse JSON! Check experimental parse!");
					console.error(e2.message);
						
					let badSymbolPos = '';
					const index1 = e2.message.indexOf("position"); // Unexpected token   in JSON at position 143768
					const index2 = e2.message.indexOf("column"); // SyntaxError: JSON.parse: bad control character in string literal at line 1 column 143769 of the JSON data
					if (index1 !== -1) {
						badSymbolPos = parseInt(e2.message.substr(index1 + 9));
					} else if (index2 !== -1) {
						badSymbolPos = parseInt(e2.message.substr(index2 + 7)) - 1;
					}

					const badSymbol = decodeStrTest[badSymbolPos];

					// Remove bad symbols
					const fixStr = decodeStrTest.split(badSymbol).join("");

					try {
						firstOjb = JSON.parse(fixStr);
						APP.log("info", "SUCCESFUL EXPERIMENTAL BASE64 DECODE!");
					} catch (e3) {
						APP.log("error", "Finnaly Error parse object!");
						return;
					}
				}
			}
			
			APP.Logic.clearScript();
			
			APP.oid = jsonObj._id.$oid;
			APP.name = jsonObj.meta.name;
			APP.description = jsonObj.meta.description;
			APP.wiki = jsonObj.additional.wiki_ref;
			APP.image = jsonObj.additional.image;
			APP.category = jsonObj.additional.category;
			
			insertParam("obj_id", APP.oid);

			const script = firstOjb.script_data;
			APP.script = script;
			
			APP.Logic.fixNodeSemicolon();
			APP.form = firstOjb.form_data;
			
			

			if(Object.values(APP.form).length === 0)
			{
				APP.form.widgets = {"formRoot": {
					"children": []
				}};
			}
			
			APP.log("info", "Application Loaded:\n" + APP.name);
			APP.Logic.load();
			
			// CONVERT LOGIC TO SCRIPT:
			APP.script = LogicController.prototype.fillingScript(script);
			
			if (this.m_loadedFunc) {
				this.m_loadedFunc();
			}

			APP.UI.divObjectName.textContent = APP.name + " (" + APP.oid + ")";
			this.requestGetJavaScriptLibraries(script.jsLibsOIDs);

		}
	}


	requestGetJavaScriptLibraries(oidArray) {
		
		if (!oidArray.length) {
			return;
		}

		let request = '{"_id": {"$in": [';
		for (const oid of oidArray) {
			request += '{"$oid": "' + oid + '"},';
		}
		if (request[request.length - 1] === ",") {
			request = request.substr(0, request.length - 1);
		}
		request += ']}}';

		this.sendBaseRCRequest("GetStandartJSLibraries", "objects", request, false);

	}

	responseGetStandartJSLibraries(resultJson) {
		console.log("Base Libs LOADED:", resultJson);
		if ("cursor" in resultJson) {
			APP.libraryController.parseJavaScriptLibraries(resultJson);
		}
	}



	requestGetStandartJSBlocks(oidsArray) {
		let strOIDs = "";
		for (const oid of oidsArray) {
			if (strOIDs.length) {
				strOIDs += ',{"$oid":"' + oid + '"}';
			} else {
				strOIDs += '{"$oid":"' + oid + '"}';
			}
		}
		const filterData = '{"_id": {"$in": [' + strOIDs + ']}}';
		this.sendBaseRCRequest("GetStandartJSBlocks", "objects", filterData, false);
	}

	responseGetStandartJSBlocks(resultJson) {
		if ("cursor" in resultJson) {
			const cursorJson = resultJson.cursor;
			const array = cursorJson.firstBatch;
			APP.libraryController.parseJavaScriptNodes(array);
		}
	}



	requestGetRexScripts() {
		const filterData = '{"meta.pattern": {"$oid": "58b528a3dcfd030dc81b84a1"}}';
		this.sendBaseRCRequest("GetRexScripts", "objects", filterData, true);
	}

	responseGetRexScripts(resultJson) {
		if ("cursor" in resultJson) {
			const cursorJson = resultJson.cursor;
			const array = cursorJson.firstBatch;
			APP.RexScripts = array;
		}
	}



	requestGetRexScriptObject(oid) {

		const standartOIDLength = 24;
		if (oid.length !== standartOIDLength) {
			console.error(" OID size !== 24!");
			return;
		}

		const filterRequest = '{"_id": {"$oid": "' + oid + '"}}';
		this.sendBaseRCRequest("GetRexScriptObject", "objects", filterRequest, false);

	}

	responseGetRexScriptObject(resultJson) {
		if ("cursor" in resultJson) {
			const cursorJson = resultJson.cursor;
			const array = cursorJson.firstBatch;
			const object = array[0];

			APP.Logic.exportScript(object);

		}
	}



	// oidArray: ["oid1","oid2","oid3"....]
	requestGetOnlyBlocks(oidArray) {

		let strOIDs = "";
		for (const oid of oidArray) {
			if (strOIDs.length) {
				strOIDs += ',{"$oid":"' + oid + '"}';
			} else {
				strOIDs += '{"$oid":"' + oid + '"}';
			}
		}

		const filterData = '{"_id": {"$in": [' + strOIDs + ']}}';
		this.sendBaseRCRequest("GetOnlyBlocks", "objects", filterData, false);

	}
	responseGetOnlyBlocks(resultJson) {
		debugger;
	}



	requestLibrariesEditorLibsList() {
		const request = '{"meta.pattern": {"$oid": "' + this.m_libraryPattent + '"}}';
		this.sendBaseRCRequest("LibrariesEditorLibsList", "objects", request, false);
	}

	responseLibrariesEditorLibsList(resultJson) {
		APP.libraryEditor.parseLibraries(resultJson);
	}

	responseLibrariesEditorBlocks(resultJson) {
		APP.libraryEditor.parseBlocks(resultJson);
	}

	responseUserLibraries(resultJson) {
		APP.libraryController.parseUserLibraries(resultJson);
	}

}

function sendPostRequest(api, data, callbackFunc) {
	const request = new XMLHttpRequest();
	//request.open("POST", "http://192.168.10.71" + api, true);
	request.open("POST", "https://guni.0070.ru" + api, true);
	request.withCredentials = true;
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.onload = callbackFunc;
	request.send(data);
}


// eslint-disable-next-line no-multiple-empty-lines
