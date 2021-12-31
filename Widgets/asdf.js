createFile2(fileIn){//пример создания прототипа
    const created = function(result){
        console.log("result", result);
    }

    const file = {
        "_id": {
            "$oid": "60faa7ffb0125500090d346c"
        },
        "meta": {
            "name": "Цепи",
            "name_t": {},
            "owner": {
                "$oid": "60222cadb4a8ca0008411e04"
            },
            "description": "",
            "description_t": {}
        },
        "additional": {
            "image": "",
            "wiki_ref_t": {
                "en": "None"
            },
            "category": [
                "2cee3b0f0000000000000000.2cee3b0f00000000000000cb.2cee3b0f00000000000000e5.2cee3b0f00000000000000ea.2cee3b0f00000000000000ee.2cee3b0f000000000000082a.60faa60be27e7e10e4ee8b52"
            ],
            "wiki_ref": {
                "en": "None"
            }
        },
        "schema": {
            "type": "object",
            "properties": {
                "DIN": {
                    "average_default": 0,
                    "category": "Characteristics",
                    "count_uses": 0,
                    "description": "DIN ",
                    "lang": "ru",
                    "themes": [
                        "Basic"
                    ],
                    "type_value": "string",
                    "current_system": "SI",
                    "wiki": "https://ru.wikipedia.org/wiki/%D0%9D%D0%B5%D0%BC%D0%B5%D1%86%D0%BA%D0%B8%D0%B9_%D0%B8%D0%BD%D1%81%D1%82%D0%B8%D1%82%D1%83%D1%82_%D0%BF%D0%BE_%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8"
                },
                "EN ISO": {
                    "average_default": 0,
                    "category": "Characteristics",
                    "count_uses": 0,
                    "description": "EN ISO",
                    "lang": "ru",
                    "themes": [
                        "Basic"
                    ],
                    "type_value": "string",
                    "current_system": "SI",
                    "wiki": "https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%B6%D0%B4%D1%83%D0%BD%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D0%B0%D1%8F_%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D0%BF%D0%BE_%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8"
                },
                "ISO": {
                    "average_default": 0,
                    "category": "Characteristics",
                    "count_uses": 0,
                    "description": "ISO",
                    "lang": "ru",
                    "themes": [
                        "Basic"
                    ],
                    "type_value": "string",
                    "current_system": "SI",
                    "wiki": "https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%B6%D0%B4%D1%83%D0%BD%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D0%B0%D1%8F_%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D0%BF%D0%BE_%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8"
                },
                "ГОСТ": {
                    "average_default": 0,
                    "category": "Characteristics",
                    "count_uses": 0,
                    "description": "ГОСТ",
                    "lang": "ru",
                    "themes": [
                        "Basic"
                    ],
                    "type_value": "string",
                    "current_system": "SI",
                    "wiki": "https://ru.wikipedia.org/wiki/Межгосударственный_стандарт"
                },
                "Диаметр": {
                    "average_default": 0,
                    "category": "Characteristics",
                    "count_uses": 0,
                    "description": "Диаметр",
                    "lang": "ru",
                    "themes": [
                        "Basic"
                    ],
                    "type_value": "string",
                    "current_system": "SI",
                    "wiki": "https://ru.wikipedia.org/wiki/%D0%94%D0%B8%D0%B0%D0%BC%D0%B5%D1%82%D1%80"
                },
                "Звенья": {
                    "average_default": 0,
                    "category": "Characteristics",
                    "count_uses": 0,
                    "description": "Звенья",
                    "lang": "ru",
                    "themes": [
                        "Basic"
                    ],
                    "type_value": "string",
                    "current_system": "SI",
                    "wiki": "https://ru.wikipedia.org/wiki/%D0%97%D0%B2%D0%B5%D0%BD%D0%BE"
                },
                "Материал": {
                    "average_default": 0,
                    "category": "Characteristics",
                    "count_uses": 0,
                    "description": "Материал",
                    "lang": "ru",
                    "themes": [
                        "Basic"
                    ],
                    "type_value": "string",
                    "current_system": "SI",
                    "wiki": "https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%B0%D0%BB"
                },
                "Назначение": {
                    "average_default": 0,
                    "category": "Characteristics",
                    "count_uses": 0,
                    "description": "Назначение",
                    "lang": "ru",
                    "themes": [
                        "Basic"
                    ],
                    "type_value": "string",
                    "current_system": "SI",
                    "wiki": "https://ru.wikipedia.org/wiki/%D0%A6%D0%B5%D0%BF%D1%8C"
                },
                "Оцинкованная": {
                    "average_default": 0,
                    "category": "Characteristics",
                    "count_uses": 0,
                    "description": "Оцинкованная",
                    "lang": "ru",
                    "themes": [
                        "Basic"
                    ],
                    "type_value": "boolean",
                    "current_system": "SI",
                    "wiki": "https://ru.wikipedia.org/wiki/%D0%A6%D0%B8%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5"
                },
                
                
                "Тип": {
                    "average_default": 0,
                    "category": "Characteristics",
                    "count_uses": 0,
                    "description": "Тип",
                    "lang": "ru",
                    "themes": [
                        "Basic"
                    ],
                    "type_value": "string",
                    "current_system": "SI",
                    "wiki": "https://ru.wikipedia.org/wiki/%D0%A2%D0%B8%D0%BF"
                }
            },
            "unverified": {},
            "required": []
        }
    };


    
    APP.dbWorker.responseDOLMongoRequest = created.bind(this);
    APP.dbWorker.sendInsertRCRequest("DOLMongoRequest",JSON.stringify(file),"objects");
}

}