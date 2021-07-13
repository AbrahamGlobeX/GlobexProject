/**
 * WidgetGeoMap::GeoFont
 */

class GeoFont extends GeoStyle {
	
	constructor(properties) {
		super(properties.GeoStyle);console.log("GeoFont::constructor", properties);
		
		let undef = this.getCheckFunction("constructor");
		
		this.texts = [];
		
		this.color = "rgba(0, 0, 0, 1)";
		
		this.size = 10;
		
		this.family = undefined;
			
		this.weight = "normal";	
		
		this.style = "normal";
		
		let optionNames = [
			"color",
			"size",
			"family",
			"weight",
			"style"
		];
		
		if(undef(properties, "properties"))
			return;
		
		this.initOptions(properties, optionNames);
		
		let textIds = properties.texts;
		
		if(textIds != undefined)
			this.setTexts(textIds);
	}
	
	initOptions (properties, names) {
		let undef = this.getCheckFunction("initOptions");
		
		let name, baseName;
		
		for(let i = 0; i < names.length; ++i) {
			if(!Array.isArray(names[i])) {
				name = names[i];
				baseName = name;
			}
			else {
				name = names[i][0];
				baseName = names[i][1];
			}
			
			let option = properties[name];
			
			if(undef(option, name, properties))
				return false;
			
			this[baseName] = option;
		}
		
		return true;
	}
	
	
	setTexts(textIds) {
		if(textIds == undefined)
			return;
		
		let styles = geoManager.styles;
		
		let texts = this.texts;
		
		for(let i = 0; i < textIds.length; ++i) {
			let text = styles[textIds[i]];
			
			if(text == undefined)
				continue;
			
			if(text.font != undefined)
				text.font.removeText(text);
			
			text.font = this;
			
			texts.push(text);
		}
		
		this.update();
	}
	
	update() {
		let texts = this.texts;
		
		for(let i = 0; i < texts.length; ++i)
			texts[i].update();
	}
	
	getNumObjects() {
		return this.texts.length;
	}
	
	hasText(text) {
		return this.texts.indexOf(text) > -1;
	}
	
	addText(text) {
		let undef = this.getCheckFunction("addText");
		
		if(undef(text, "text"))
			return;
		
		if(this.hasText(text))
			return;
		
		this.texts.push(text);
	}
	
	removeText(text) {
		let undef = this.getCheckFunction("removeText");
		
		if(undef(text, "text"))
			return;
		
		if(!this.hasText(text))
			return;
		
		let texts = this.texts;
		
		texts.splice(texts.indexOf(text), 1);
	}
	
	setColor(v) {
		this.setOption("color", v);
	}
	
	setSize(v) {
		this.setOption("size", v);
	}
	
	setFamily(v) {
		this.setOption("family", v);
	}
	
	setWeight(v) {
		this.setOption("weight", v);
	}
	
	setStyle(v) {console.log(v);
		this.setOption("style", v);
	}
	
};
