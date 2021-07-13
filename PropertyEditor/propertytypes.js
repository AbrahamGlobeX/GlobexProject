const propertyTypes = {
    "Characteristics": {
        "string": Characteristics_StringType,
        "number": Characteristics_NumberType,
        "boolean": Characteristics_BooleanType,
        "color": Characteristics_ColorType,
        "telephone": Characteristics_TelephoneType,
        "mail": Characteristics_MailType
    },
    "Location": {
        "map": Location_MapType,
        "address": Location_AddressType,
        "additiobally": Location_AdditionallyType
    },
    "Representation": {
        "photo" : Representation_PhotoType
    }
};