// eslint-disable-next-line no-unused-vars
class TranslateManager {
	
	constructor() {
		
		this.langs = ["en", "ru"];
		this.lang = "en";
		this.fillData();
		
	}
	
	changeLanguageEvent(event) {
		const newLang = event.target.value;
		console.log('this.lang=', APP.TM.lang);
		if (newLang === this.lang) {
		
			return;
		}
		
		this.lang = newLang;
		
		for (const key in this.dictionary) {
			if (!key) {
				continue;
			}
			
			const keyObj = this.dictionary[key];
			if (!keyObj) {
				continue;
			}
			
			const value = keyObj[this.lang];
			
			if (key[0] === ".") {
				// class
				const htmls = document.getElementsByClassName(key.slice(1));
				for (const html of htmls) {
					if (!html) {
						continue;
					}
					html.textContent = value;
				}
			} else {
				// id
				const html = document.getElementById(key);
				if (!html) {
					continue;
				}
				html.textContent = value;
			}
		}
	}

	getDicText(id, defValue) {
		try {
			return this.dictionary[id][this.lang];
		} catch (e) { }
		return defValue;
	}
	
	
	// "key" -> fing textContent by id
	// ".key" -> find textContent by class
	// "|key" -> find title by id
	
	// eslint-disable-next-line max-lines-per-function
	fillData() {
		
		this.dictionary = {
			"TopMenuBtn": {
				"ru": "МЕНЮ",
				"en": "MENU"
			},
			"TopSaveBtn": {
				"ru": "СОХРАНИТЬ",
				"en": "SAVE"
			},
			"TopViewBtn": {
				"ru": "ПРОСМОТР",
				"en": "VIEW"
			},
			"TopStoreBtn": {
				"ru": "ХРАНИЛИЩЕ",
				"en": "STORE"
			},
			"TopRunBtn": {
				"ru": "ЗАПУСК",
				"en": "RUN"
			},
			"TopLibsBtn": {
				"ru": "БИБЛИОТЕКИ",
				"en": "LIBS"
			},
			"TopFormBtn": {
				"ru": "ФОРМА",
				"en": "FORM"
			},
			"MenuNewAppBtn": {
				"ru": "Содать новое приложение",
				"en": "Create New Application"
			},
			"MenuOpenDBAppBtn": {
				"ru": "Открыть приложение из БД",
				"en": "Open Application from DB"
			},
			"MenuSaveDBBtn": {
				"ru": "Сохранить приложение в БД",
				"en": "Save Application to DB"
			},
			"MenuOpenFIleAppBtn": {
				"ru": "Открыть файл",
				"en": "Open Application File"
			},
			"MenuSaveFileBtn": {
				"ru": "Сохранить файл",
				"en": "Save Application File"
			},
			"MenuExportBtn": {
				"ru": "Импорт старых скриптов",
				"en": "Import Old Scripts"
			},
			"ExpandDefsBtn": {
				"ru": "Открыть все",
				"en": "EXPAND DEFAULTS"
			},
			"LibraresBtnCollapse": {
				"ru": "Свернуть все",
				"en": "COLLAPS DEFAULTS"
			},
			"LibraresBtnLoadLib": {
				"ru": "Загрузить",
				"en": "Load"
			},
			"m_btnControlHtml": {
				"ru": "Показать",
				"en": "Show"
			},
			"m_btnControlHtml": {
				"ru": "Скрыть",
				"en": "Hide"
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			},
			"": {
				"ru": "",
				"en": ""
			}
			
		};
	}

	
}