class WidgetFrame extends BaseWidget {
	
	constructor() {
		super();
		
		this.src = "";
		this.external = false;
		
	}
	
	onCreate() {
		
		this.referenceBlock = document.createElement("iframe");
		this.referenceBlock.classList.add("frameWidgetFrame");
		this.referenceBlock.style.display = "none";
		// this.referenceBlock.addEventListener("onload", this.onLoad.bind(this));
		this.referenceBlock.onload = function f() {
			this.onLoad();
		}.bind(this);
		
		this.sourseBlock = document.createElement("div");
		this.sourseBlock.classList.add("frameWidgetFrame");
		this.sourseBlock.style.display = "none";
		// this.sourseBlock.addEventListener("onload", this.onLoad.bind(this));
		this.sourseBlock.onload = function f() {
			this.onLoad();
		}.bind(this);
		
		this.htmlElement.classList.add("WidgetFrame");
		this.htmlElement.appendChild(this.referenceBlock);
		this.htmlElement.appendChild(this.sourseBlock);
		
		window.addEventListener("message", this.onCrossFrameMessage.bind(this));
		
	}

	setSource(src, external) {
		
		this.src = src;
		this.external = external;
		
		if (this.external) {
			this.referenceBlock.setAttribute("src", this.src);
			this.referenceBlock.style.display = "";
			this.sourseBlock.style.display = "none";
		} else {
			this.sourseBlock.innerHTML = this.src;
			this.sourseBlock.style.display = "";
			this.referenceBlock.style.display = "none";
		}
		
	}
	
	addOnLoadFrameHandler(handler) {
		
		this.onLoadHandler = handler;
		
	}
	
	setOnFrameMsgHandler(handler) {
		this.onMsgHandler = handler;
	}
	
	
	sendMessage(message) {
		
		// данные о месте отправки сообщения
		let messageInfo = {};
		try {
			messageInfo = JSON.parse(JSON.stringify(location));
		} catch (e) { }

		const w = this.referenceBlock.contentWindow;
		const localSK = getLocationSesKey(w.location);

		// отправка сообщения в блок фрейма
		w.postMessage({
			"data": message,
			messageInfo,
			localSK
		}, "*");
		// w.postMessage(message, "*");
	}

	onCrossFrameMessage(event) {
		
		// получение данных сообщения
		let {data} = event;
		if (typeof data === "string") {
			data = JSON.parse(data);
		}
		
		const thisLocSK = getLocationSesKey(location); // ses_key текущего положения
		const blockLocSK = getLocationSesKey(this.referenceBlock.contentWindow.location); // ses_key блока фрема
		const senderLocSK = getLocationSesKey(data.messageInfo); // ses_key отправителя
		
		// Если текущее и требуемое значение ses_key или отправитель и блок данного фрема не одинаковые - это сообщение необрабатывается
		if (thisLocSK !== data.localSK ||
			blockLocSK !== senderLocSK) {
			return;
		}
		if (this.onMsgHandler) {
			Module.Store.dispatch({
				"eventName": this.onMsgHandler,
				"value": JSON.stringify(data.data)
			});
		}
	}
	
	onLoad() {
		
		if (this.onLoadHandler) {
			
			Module.Store.dispatch({
				"eventName": this.onLoadHandler,
				"value": true
			});
			
		}
		
	}
	
}



function getLocationSesKey(loc) {
	let locationSesKey = null;
	let tmp = [];

	function searchFunc(item) {
		tmp = item.split("=");
		if (tmp[0] === "ses_key") {
			locationSesKey = decodeURIComponent(tmp[1]);
		}
	}
	if (!loc) {
		loc = location;
	}

	try {
		loc.search.substr(1).split("&").forEach(searchFunc.bind(this));
	} catch (e) {
		//
	}
	return locationSesKey;
}



class FrameMessageController {
	constructor() {
		window.addEventListener('message', this.getMessage.bind(this));
	}

	/**
	 * метод отправки сообщения в самый верхний и в родительский фрейм
	 * @param {?} data - то, что передаем
	 */
	// eslint-disable-next-line class-methods-use-this
	sendMessage(data) {
		
		// данные о месте отправки сообщения
		let messageInfo = {};
		try {
			messageInfo = JSON.parse(JSON.stringify(location));
		} catch (e) {}
		
		const wT = window.top;
		const wP = window.parent;
		
		// ses_key того, кому сообщение предназначено
		const localSK_T = getLocationSesKey(wT.location);
		const localSK_P = getLocationSesKey(wP.location);
		
		if (wT === wP) {
			window.top.postMessage({
				data,
				messageInfo,
				"localSK": localSK_T
			}, "*");
		} else {
			window.top.postMessage({
				data,
				messageInfo,
				"localSK": localSK_T
			}, "*");
			window.parent.postMessage({
				data,
				messageInfo,
				"localSK": localSK_P
			}, "*");
		}
		
	}

	/**
	 * метод, который примет сигнал от браузера в самом верхнем фрейме, и презвратит в сигнал
	 * @param {object} e - сообщение
	 * @private
	 */
	// eslint-disable-next-line class-methods-use-this
	getMessage(e) {
		
		if (this.handler) {
			
			Module.Store.dispatch({
				"eventName": this.handler,
				"value": e.data.data
			});
			
		}
			
		// console.log("ON GET MESSAGE", e);
		
		// Rex.callRpcFunction("RexEngine", "crossFrameMessage", [e.data.data]);
		// this.run(data.eventName, data); // ??? ALLekSSSanDR 17.09.20
	}
	
	setHandler(handler) {
		this.handler = handler;
	}

	
}

// eslint-disable-next-line no-new
APP.frameAPI = new FrameMessageController();