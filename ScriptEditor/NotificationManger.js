/* eslint-disable no-magic-numbers */
/* eslint-disable no-unused-vars */

class NotificationManager {

	constructor() {
		this.sleep = 1;
		this.interval = 10;
		this.messages = [];
		this.animOffset = 0;
		this.timeInterval = 0;
		this.messagesManager = new NotificationIdMessages();
	}

	animate() {
		if (this.animOffset > 0) {
			this.animOffset = this.animOffset - 1;
		}
		this.sendMessage();
	}

	message(data, type) {
		
		const newMess = new Message(data, type, this);
		this.messages.push(newMess);
		
		this.animOffset = 120;
		
		setTimeout(function f() {
			this.runfade();
		}.bind(newMess), 3500);
		for (let i = 0; i < this.animOffset; ++i) {
			setTimeout(function f() {
				this.animate();
			}.bind(this), this.sleep * i);
		}
		
	}

	sendMessage() {
		for (let i = this.messages.length - 1; i >= 0; --i) {
			let offset = (this.messages[i].height + this.interval) * (this.messages.length - 1 - i);
			this.messages[i].draw(offset - this.animOffset);
		}
	}

}



class NotificationIdMessages {
	
	constructor() {
		this.messageId = 0;
	}
	
	getMessageId() {
		return "message" + this.messageId++;
	}
	
}



class Message {
	
	constructor(Data, type, manager) {
		this.data = Data;
		this.type = type;
		
		this.width = 300;
		this.height = 100;
		this.padding = [25, 125];
		this.timeInterval = 0;
		this.manager = manager;
		this.color = (this.type == "error") ? [150, 0, 0, 125] : (this.type == "info") ? [0, 150, 0, 125] : [240, 200, 0, 125];
		this.fontcolor = [255, 255, 255, 255];
		
		this.htmlID = manager.messagesManager.getMessageId();
		
	}

	get htmlElement() {
		const html = document.getElementById(this.htmlID);
		return html != undefined ? html : undefined;
	}

	draw(offset) {
		
		const paddingLeft = 25;
		const paddingRight = 25;
		const rightOffset = 25;
		
		const x = window.innerWidth - (this.width + this.padding[0]);
		const y = window.innerHeight - this.padding[1] - offset;
		
		if (this.htmlElement === undefined) {
			const temp = document.createElement("div");
			temp.id = this.htmlID;
			temp.className = "Message";
			temp.style.top = y + "px";
			temp.style.left = (x - paddingLeft - rightOffset) + "px";
			temp.style.width = (this.width + paddingRight + paddingLeft - rightOffset / 2) + "px";
			temp.style.height = this.height + "px";
			temp.style.background = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + "," + this.color[3] + ")";
			temp.style.color = "rgba(" + this.fontcolor[0] + "," + this.fontcolor[1] + "," + this.fontcolor[2] + "," + this.fontcolor[3] + ")";
			
			temp.innerText = this.data;
			console.log("MESSAGE:", this.data);
			
			const parent = document.body;
			parent.appendChild(temp);
			setTimeout(function f() {
				const html = this.htmlElement;
				if (html !== undefined) this.htmlElement.remove();
			}.bind(this), 5000);
		} else {
			const temp = this.htmlElement;
			if (temp === undefined) return;
			temp.style.top = y + "px";
			temp.style.background = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + "," + this.color[3] + ")";
			temp.style.color = "rgba(" + this.fontcolor[0] + "," + this.fontcolor[1] + "," + this.fontcolor[2] + "," + this.fontcolor[3] + ")";
		}
	}

	runfade() {
		for (let i = 0; i < 10; ++i) {
			setTimeout(function f() {
				this.clear();
			}.bind(this), 50 * i);
		}
	}

	clear() {
		
		if (this.color[3] > 10) {
			this.color = [
				Math.round(this.color[0] * (65 / 100)),
				Math.round(this.color[1] * (65 / 100)),
				Math.round(this.color[2] * (65 / 100)),
				Math.round(this.color[3] * (65 / 100)) / 255
			];
			this.fontcolor = [
				Math.round(this.fontcolor[0] * (65 / 100)),
				Math.round(this.fontcolor[1] * (65 / 100)),
				Math.round(this.fontcolor[2] * (65 / 100)),
				Math.round(this.fontcolor[3] * (65 / 100)) / 255
			];
			
			this.manager.sendMessage();
			
			return;
		}
		
		if (this === this.manager.messages[0])
			this.manager.messages.shift();
		
		this.manager.sendMessage();
		
	}
}