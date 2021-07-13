let globeXYscript =
{
    "store": {
        "records": [],
        "record": {
            "value": "",
            "enabled": true,
            "id": Date.now()
        },
        // "emptyVal": "",
        "pathVal": "value",
        // "pathVal": "Duplicate key",
        "disabled": false,
        "enabledPath": "enabled",
        "NewTestKey": "NewTestValue",
        "widgets": {

            '0': { children: [] }
        }
    },
    "jsBlocksOIDs": [
        "5fec230bb01255000881ea25",
        "5fec230cb01255000881ea2c",
        "5fec230cb01255000881ea33",
        "5fec230cb01255000881ea3a",
        "5fec230db01255000881ea41",
        "5fec230db01255000881ea48",
        "5fec230eb01255000881ea4f",
        "5fec230eb01255000881ea56",
        "5fec230fb01255000881ea5d",
        "5fec2310b01255000881ea6b",
        "5fec2310b01255000881ea72",
        "5fec2310b01255000881ea79",
        "5fec2311b01255000881ea80",
        "5fec2311b01255000881ea87",
        "5fec2311b01255000881ea8e",
        "5fec2312b01255000881ea95",
        "5fec2312b01255000881ea9c",
        "5fec2312b01255000881eaa3",
        "5fec2313b01255000881eaaa",
        "5fec2313b01255000881eab1",
        "5fec2313b01255000881eab8"],
    "nodes": [
        {
            "type": "Handler",
            "id": 6,
            "x": 59,
            "y": 635,
            "params": [
                {
                    "eventName": "addRecord"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": []
            }
        },
        {
            "type": "HandlerWithParams",
            "id": 11,
            "x": 66,
            "y": 434,
            "params": [
                {
                    "eventName": "updateRecord",
                    "value": ""
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": [
                    "value"
                ]
            }
        },
        {
            "type": "ToStoreElement",
            "id": 12,
            "x": 312,
            "y": 326,
            "params": [
                {
                    "ElementName": "record"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": [
                    "ToStore"
                ]
            },
            "Outputs": {
                "flow": [],
                "data": []
            }
        },
        {
            "name": "arrayAppend",
            "type": "JavaScriptBlock",
            "lib": "std",
            "id": 15,
            "x": 1097,
            "y": 556,
            "params": [
                {
                    "ObjectName": "std",
                    "input0": "arrayAppend"
                }
            ],
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "array",
                    "element"
                ]
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": [
                    "resultArray"
                ]
            }
        },
        {
            "type": "FromStoreElement",
            "id": 16,
            "x": 795,
            "y": 786,
            "params": [
                {
                    "ElementName": "records"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "type": "FromStoreElement",
            "id": 17,
            "x": 801,
            "y": 903,
            "params": [
                {
                    "ElementName": "record"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "type": "ToStoreElement",
            "id": 18,
            "x": 1331,
            "y": 539,
            "params": [
                {
                    "ElementName": "records"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": [
                    "ToStore"
                ]
            },
            "Outputs": {
                "flow": [],
                "data": []
            }
        },
        {
            "name": "log",
            "type": "JavaScriptBlock",
            "id": 19,
            "x": 646,
            "y": 1013,
            "params": [
                {
                    "ObjectName": "jspart",
                    "input0": "log"
                }
            ],
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "value"
                ]
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": []
            }
        },
        // {
        //     "type": "FromStoreElement",
        //     "id": 24,
        //     "x": 1361,
        //     "y": 752,
        //     "params": [
        //         {
        //             "ElementName": "emptyVal"
        //         }
        //     ],
        //     "Inputs": {
        //         "flow": [],
        //         "data": []
        //     },
        //     "Outputs": {
        //         "flow": [],
        //         "data": [
        //             "FromStore"
        //         ]
        //     }
        // },
        {
            "type": "FromStoreElement",
            "id": 25,
            "x": 1361,
            "y": 843,
            "params": [
                {
                    "ElementName": "record"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "type": "SetValue",
            "id": 26,
            "x": 1665,
            "y": 674,
            "Defaults": {
                "Inputs": [
                    {
                        "index": 0,
                        "value": ""
                    }
                ]
            },
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "value",
                    "json",
                    "path"
                ]
            },
            "Outputs": {
                "flow": [
                    "out",
                    "error"
                ],
                "data": [
                    "json"
                ]
            }
        },
        {
            "type": "FromStoreElement",
            "id": 27,
            "x": 1359,
            "y": 938,
            "params": [
                {
                    "ElementName": "pathVal"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "type": "ToStoreElement",
            "id": 28,
            "x": 1927,
            "y": 539,
            "params": [
                {
                    "ElementName": "record"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": [
                    "ToStore"
                ]
            },
            "Outputs": {
                "flow": [],
                "data": []
            }
        },
        {
            "type": "If",
            "id": 29,
            "x": 738,
            "y": 653,
            "Defaults": {
                "Inputs": [
                    {
                        "index": 1,
                        "value": ""
                    }
                ]
            },
            "params": [
                {
                    "condition": "=="
                }
            ],
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "a",
                    "b"
                ]
            },
            "Outputs": {
                "flow": [
                    "then",
                    "else"
                ],
                "data": []
            }
        },
        {
            "type": "FromStoreElement",
            "id": 30,
            "x": 449,
            "y": 785,
            "params": [
                {
                    "ElementName": "emptyVal"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "type": "FromStoreElement",
            "id": 31,
            "x": 146,
            "y": 735,
            "params": [
                {
                    "ElementName": "record"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "type": "GetValue",
            "id": 32,
            "x": 443,
            "y": 653,
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "json",
                    "path"
                ]
            },
            "Outputs": {
                "flow": [
                    "out",
                    "error"
                ],
                "data": [
                    "value"
                ]
            }
        },
        {
            "type": "FromStoreElement",
            "id": 33,
            "x": 146,
            "y": 830,
            "params": [
                {
                    "ElementName": "pathVal"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "type": "HandlerWithParams",
            "id": 34,
            "x": 17,
            "y": 147,
            "params": [
                {
                    "eventName": "strikeOut",
                    "value": ""
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": [
                    "value"
                ]
            }
        },
        {
            "name": "toString",
            "type": "JavaScriptBlock",
            "id": 36,
            "x": 344,
            "y": 171,
            "params": [
                {
                    "ObjectName": "jspart",
                    "input0": "toString"
                }
            ],
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "value"
                ]
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": [
                    "result"
                ]
            }
        },
        {
            "type": "GetValue",
            "id": 37,
            "x": 668,
            "y": 111,
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "json",
                    "path"
                ]
            },
            "Outputs": {
                "flow": [
                    "out",
                    "error"
                ],
                "data": [
                    "value"
                ]
            }
        },
        {
            "type": "FromStoreElement",
            "id": 38,
            "x": 341,
            "y": 8,
            "params": [
                {
                    "ElementName": "records"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "type": "SetValue",
            "id": 39,
            "x": 1544,
            "y": 62,
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "value",
                    "json",
                    "path"
                ]
            },
            "Outputs": {
                "flow": [
                    "out",
                    "error"
                ],
                "data": [
                    "json"
                ]
            }
        },
        {
            "type": "FromStoreElement",
            "id": 41,
            "x": 1248,
            "y": 254,
            "params": [
                {
                    "ElementName": "enabledPath"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "type": "FromStoreElement",
            "id": 42,
            "x": 1617,
            "y": 243,
            "params": [
                {
                    "ElementName": "records"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "type": "SetValue",
            "id": 43,
            "x": 1859,
            "y": 83,
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "value",
                    "json",
                    "path"
                ]
            },
            "Outputs": {
                "flow": [
                    "out",
                    "error"
                ],
                "data": [
                    "json"
                ]
            }
        },
        {
            "type": "ToStoreElement",
            "id": 44,
            "x": 2106,
            "y": 14,
            "params": [
                {
                    "ElementName": "records"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": [
                    "ToStore"
                ]
            },
            "Outputs": {
                "flow": [],
                "data": []
            }
        },
        {
            "name": "inversion",
            "type": "JavaScriptBlock",
            "id": 45,
            "x": 1254,
            "y": 32,
            "params": [
                {
                    "ObjectName": "jspart",
                    "input0": "inversion"
                }
            ],
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "value"
                ]
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": [
                    "result"
                ]
            }
        },
        {
            "type": "GetValue",
            "id": 46,
            "x": 974,
            "y": 5,
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "json",
                    "path"
                ]
            },
            "Outputs": {
                "flow": [
                    "out",
                    "error"
                ],
                "data": [
                    "value"
                ]
            }
        },
        {
            "type": "FromStoreElement",
            "id": 47,
            "x": 671,
            "y": 5,
            "params": [
                {
                    "ElementName": "enabledPath"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        },
        {
            "name": "log",
            "type": "JavaScriptBlock",
            "id": 48,
            "x": 2058,
            "y": 667,
            "params": [
                {
                    "ObjectName": "jspart",
                    "input0": "log"
                }
            ],
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "value"
                ]
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": []
            }
        },
        {
            "type": "Handler",
            "id": 49,
            "x": 59,
            "y": 50,
            "params": [
                {
                    "eventName": "init"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": []
            }
        }
        ,
        {
            "name": "createWidget",
            "type": "JavaScriptBlock",
            "id": 50,
            "x": 500,
            "y": 400,
            "params": [
                {
                    "ObjectName": "jspart",
                    "input0": "createWidget"
                }
            ],
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "value1",
                    "value2",
                    "value3",
                    "value4",
                    "value5"
                ]
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": [
                    "result"
                ]
            }
        }
        ,
        {
            "type": "ToStoreElement",
            "id": 51,
            "x": 800,
            "y": 400,
            "params": [
                {
                    "ElementName": "widgets"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": [
                    "ToStore"
                ]
            },
            "Outputs": {
                "flow": [],
                "data": []
            }
        }
        , {
            "type": "FromStoreElement",
            "id": 52,
            "x": 1000,
            "y": 400,
            "params": [
                {
                    "ElementName": "widgets"
                }
            ],
            "Inputs": {
                "flow": [],
                "data": []
            },
            "Outputs": {
                "flow": [],
                "data": [
                    "FromStore"
                ]
            }
        }
        // ,
        // {
        //     "type": "std",
        //     "id": 53,
        //     "pid": 0,
        //     "x": 1130,
        //     "y": 475,
        //     "Inputs": {
        //         "flow": [
        //             "in",
        //             "break"
        //         ],
        //         "data": [
        //             "begin_index",
        //             "amount"
        //         ]
        //     },
        //     "Outputs": {
        //         "flow": [
        //             "out",
        //             "body"
        //         ],
        //         "data": [
        //             "cur_index"
        //         ]
        //     },
        //     "Defaults": {
        //         "Inputs": [
        //             {
        //                 "index": 0,
        //                 "value": 7
        //             },
        //             {
        //                 "index": 1,
        //                 "value": 5
        //             }
        //         ]
        //     }
        // }
    ],
    "connections": [
        {
            "type": "data",
            "source": {
                "nodeID": 11,
                "index": 0
            },
            "dest": {
                "nodeID": 12,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 16,
                "index": 0
            },
            "dest": {
                "nodeID": 15,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 17,
                "index": 0
            },
            "dest": {
                "nodeID": 15,
                "index": 1
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 15,
                "index": 0
            },
            "dest": {
                "nodeID": 18,
                "index": 0
            }
        },
        {
            "type": "flow",
            "source": {
                "nodeID": 15,
                "index": 0
            },
            "dest": {
                "nodeID": 26,
                "index": 0
            }
        },
        // {
        //     "type": "data",
        //     "source": {
        //         "nodeID": 24,
        //         "index": 0
        //     },
        //     "dest": {
        //         "nodeID": 26,
        //         "index": 0
        //     }
        // },
        {
            "type": "data",
            "source": {
                "nodeID": 25,
                "index": 0
            },
            "dest": {
                "nodeID": 26,
                "index": 1
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 27,
                "index": 0
            },
            "dest": {
                "nodeID": 26,
                "index": 2
            }
        },
        {
            "type": "flow",
            "source": {
                "nodeID": 29,
                "index": 1
            },
            "dest": {
                "nodeID": 15,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 31,
                "index": 0
            },
            "dest": {
                "nodeID": 32,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 33,
                "index": 0
            },
            "dest": {
                "nodeID": 32,
                "index": 1
            }
        },
        {
            "type": "flow",
            "source": {
                "nodeID": 6,
                "index": 0
            },
            "dest": {
                "nodeID": 32,
                "index": 0
            }
        },
        {
            "type": "flow",
            "source": {
                "nodeID": 32,
                "index": 0
            },
            "dest": {
                "nodeID": 29,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 32,
                "index": 0
            },
            "dest": {
                "nodeID": 29,
                "index": 0
            }
        },
        // {
        //     "type": "data",
        //     "source": {
        //         "nodeID": 30,
        //         "index": 0
        //     },
        //     "dest": {
        //         "nodeID": 29,
        //         "index": 1
        //     }
        // },
        {
            "type": "flow",
            "source": {
                "nodeID": 34,
                "index": 0
            },
            "dest": {
                "nodeID": 36,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 34,
                "index": 0
            },
            "dest": {
                "nodeID": 36,
                "index": 0
            }
        },
        {
            "type": "flow",
            "source": {
                "nodeID": 36,
                "index": 0
            },
            "dest": {
                "nodeID": 37,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 36,
                "index": 0
            },
            "dest": {
                "nodeID": 37,
                "index": 1
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 38,
                "index": 0
            },
            "dest": {
                "nodeID": 37,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 37,
                "index": 0
            },
            "dest": {
                "nodeID": 39,
                "index": 1
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 41,
                "index": 0
            },
            "dest": {
                "nodeID": 39,
                "index": 2
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 36,
                "index": 0
            },
            "dest": {
                "nodeID": 43,
                "index": 2
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 42,
                "index": 0
            },
            "dest": {
                "nodeID": 43,
                "index": 1
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 39,
                "index": 0
            },
            "dest": {
                "nodeID": 43,
                "index": 0
            }
        },
        {
            "type": "flow",
            "source": {
                "nodeID": 39,
                "index": 0
            },
            "dest": {
                "nodeID": 43,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 43,
                "index": 0
            },
            "dest": {
                "nodeID": 44,
                "index": 0
            }
        },
        {
            "type": "flow",
            "source": {
                "nodeID": 37,
                "index": 0
            },
            "dest": {
                "nodeID": 46,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 47,
                "index": 0
            },
            "dest": {
                "nodeID": 46,
                "index": 1
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 37,
                "index": 0
            },
            "dest": {
                "nodeID": 46,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 46,
                "index": 0
            },
            "dest": {
                "nodeID": 45,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 45,
                "index": 0
            },
            "dest": {
                "nodeID": 39,
                "index": 0
            }
        },
        {
            "type": "flow",
            "source": {
                "nodeID": 45,
                "index": 0
            },
            "dest": {
                "nodeID": 39,
                "index": 0
            }
        },
        {
            "type": "flow",
            "source": {
                "nodeID": 46,
                "index": 0
            },
            "dest": {
                "nodeID": 45,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 26,
                "index": 0
            },
            "dest": {
                "nodeID": 28,
                "index": 0
            }
        },
        {
            "type": "flow",
            "source": {
                "nodeID": 49,
                "index": 0
            },
            "dest": {
                "nodeID": 50,
                "index": 0
            }
        }
        ,
        // {
        //     "type": "data",
        //     "source": {
        //         "nodeID": 50,
        //         "index": 0
        //     },
        //     "dest": {
        //         "nodeID": 51,
        //         "index": 0
        //     }
        // },
        {
            "type": "data",
            "source": {
                "nodeID": 52,
                "index": 0
            },
            "dest": {
                "nodeID": 50,
                "index": 0
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 52,
                "index": 0
            },
            "dest": {
                "nodeID": 50,
                "index": 1
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 52,
                "index": 0
            },
            "dest": {
                "nodeID": 50,
                "index": 2
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 52,
                "index": 0
            },
            "dest": {
                "nodeID": 50,
                "index": 3
            }
        },
        {
            "type": "data",
            "source": {
                "nodeID": 52,
                "index": 0
            },
            "dest": {
                "nodeID": 50,
                "index": 4
            }
        },
    ]
}