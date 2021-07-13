/**
 * WidgetGeoMap::GeoLineText
 */

class GeoLineText extends GeoStyle {
	
	constructor(properties) {
		super(properties.GeoStyle);
		
		let undef = this.getCheckFunction("constructor");
		
		this.lines = [];
		
		this.text = "";
		
		this.font = undefined;
		
		this.below = false;
		
		this.repeat = false;
		
		this.offset = 0;
		
		this.angle = 0;
		
		if(undef(properties, "properties"))
			return;
		
		let options = [
			"text",
			"below",
			"repeat",
			"offset",
			"angle"
		];
		
		this.initOptions(properties, options);
		
		let fontId = properties.font;
		
		if(fontId != undefined) {
			let font = geoManager.styles[fontId];
			
			if(font != undefined) {
				this.font == font;
				
				font.addText(this);
			}
		}
		
		let lineIds = properties.lines;
		
		if(lineIds != undefined)
			this.setLines(lineIds);
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
	
	setLines(lineIds) {
		if(lineIds == undefined)
			return;
		
		let mapObjects = geoManager.objects;
		
		let lines = this.lines;
		
		for(let i = 0; i < lineIds.length; ++i) {
			let line = mapObjects[lineIds[i]];
			
			if(line == undefined)
				continue;
			
			line.text = this;
			
			lines.push(line);
			
			this.setTextToLine(line);
		}
	}
	
	update() {
		let lines = this.lines;
		
	 	for(let i = 0; i < lines.length; ++i)
			this.setTextToLine(lines[i]);
	}
	
	getNumObjects() {
		return this.lines.length;
	}
	
	hasLine(line) {
		return this.lines.indexOf(line) > -1;
	}
	
	addLine(line) {
		let undef = this.getCheckFunction("addLine");
		
		if(undef(line, "line"))
			return;
		
		if(this.hasLine(line))
			return;
		
		this.lines.push(line);
		
		this.setTextToLine(line);
	}
	
	removeLine(line) {
		let undef = this.getCheckFunction("removeLine");
		
		if(undef(line, "line"))
			return;
		
		if(!this.hasLine(line))
			return;
		
		let lines = this.lines;
		
		lines.splice(lines.indexOf(line), 1);
	}
	
	setText(text) {
		let undef = this.getCheckFunction("setText");
		
		if(undef(text, "text"))
			return;
		
		if(this.text == text)
			return;
		
		this.text = text;
		
		this.update();
	}
	
	setTextToLine(line) {
		let undef = this.getCheckFunction("setTextToLine");
		
		if(undef(line, "line"))
			return;
		
		if(line.text.text != "") {
			for (let mapId in line.maps)
				line.maps[mapId].setText("");
		}
			//line.object.setText("");
		
		let options = {
			below: this.below,
			repeat: this.repeat,
			offset: this.offset,
			orientation: this.angle
		};
		
		let attributes = {};
		 // wind.setText('aaa) ', {repeat: true,
                            // offset: 7,
                            // attributes: {fill: '#007DEF',
                                         // 'font-weight': 'bold',
                                         // 'font-size': '14'}});
		
		this.setFontProperties(attributes);
		
		options.attributes = attributes;
		
		for (let mapId in line.maps)
			line.maps[mapId].setText(this.text, options);
		//line.object.setText(this.text, options);
	}
	
	setFontProperties(attributes) {
		let undef = this.getCheckFunction("setFontProperties");
		
		if(this.font == undefined)
			return;
		
		if(undef(attributes, "attributes"))
			return;
		
		attributes['fill'] = this.font.color;
		attributes['font-size'] = this.font.size;
		attributes['font-family'] = this.font.family;
		attributes['font-weight'] = this.font.weight;
		attributes['font-style'] = this.font.style;
	}
	
	setFont(fontId) {
		let undef = this.getCheckFunction("setFont");
		
		if(undef(fontId, "fontId"))
			return;
		
		if(fontId == undefined)
			return;
		
		let font = geoManager.styles[fontId];
		
		if(undef(font, "font"))
			return;
			
		if(this.font == font)
			return;
		
		if(this.font != undefined)
			this.font.removeText(this);
			
		this.font = font;
				
		font.addText(this);
		
		this.update();
	}
	
	setText(v) {		
		this.setOption("text", v);
	}
	
	setBelow(v) {
		this.setOption("below", v);
	}
	
	setRepeat(v) {
		this.setOption("repeat", v);
	}
	
	setOffset(v) {
		this.setOption("offset", v);
	}
	
	setAngle(v) {		
		this.setOption("angle", v);
	}
	
};
