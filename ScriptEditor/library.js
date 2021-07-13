let library =
{
    nodes:
    [
        {
            "type": "Handler",
            "pid": 0,
            "id": 1,
            "x": 1000,
            "y": 100,
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
        },
        {
            "type": "HandlerWithParams",
            "id": 2,
            "pid": 0,
            "x": 1000,
            "y": 200,
            "params": [
                {
                    "eventName": "someEvent",
                    "value": "someValue"
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
            "name": "If",
			"type": "If",
			"lib" : "std",
            "id": 3,
            "pid": 0,
            "x": 1000,
            "y": 300,
            "Inputs": {
                "flow": [
                    "in"
                ],
				"data": [
					"a",
                    "b",
					"condition"
                ]
			},
			"enums": {
				"condition": ["==", "!=", "<", ">", "<=", ">="]
			},
            "Outputs": {
                "flow": [
                    "then",
                    "else"
                ],
                "data": []
            },
            "Defaults": {
                "Inputs": [
                    {
                        "index": 0,
                        "value": "value1"
                    },
                    {
                        "index": 1,
                        "value": "value2"
                    }
                ]
            }
        },
        {
            "name": "For",
			"type": "For",
			"lib": "std",
            "id": 4,
            "pid": 0,
            "x": 1000,
            "y": 400,
            "params": [
            ],
            "Inputs": {
                "flow": [
                    "in",
                    "break"
                ],
                "data": [
                    "begin_index",
                    "amount"
                ]
            },
            "Outputs": {
                "flow": [
                    "out",
                    "body"
                ],
                "data": [
                    "cur_index"
                ]
            },
            "Defaults": {
                "Inputs": [
                    {
                        "index": 0,
                        "value": 7
                    },
                    {
                        "index": 1,
                        "value": 5
                    }
                ]
            }
        },
        {
            "name": "++",
			"type": "Increment",
			"lib": "std",
            "id": 5,
            "pid": 0,
            "x": 1000,
            "y": 500,
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
            },
            "Defaults": {
                "Inputs": [
                    {
                        "index": 0,
                        "value": 42
                    }
                ]
            }
        },
        {
            "name": "--",
			"type": "Decrement",
			"lib": "std",
            "id": 6,
            "pid": 0,
            "x": 1000,
            "y": 600,
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
            },
            "Defaults": {
                "Inputs": [
                    {
                        "index": 0,
                        "value": 42
                    }
                ]
            }
		},
		{
			"name": "Log",
			"type": "JavaScriptBlock",
			"lib": "std",
			"params": [
				{
					"libOid": "jspart",
					"funcName": "log"
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
            "name": "Message",
            "type": "JavaScriptBlock",
            "lib": "std",
            "params": [{
                "libOid": "jspart",
                "funcName": "message"
            }],
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "text"
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
            "name": "inputFile",
            "type": "JavaScriptBlock",
            "lib": "std",
            "params": [{
                "libOid": "jspart",
                "funcName": "inputFile"
            }],
            "Inputs": {
                "flow": [
                    "in"
                ],
                "data": [
                    "layout", 
                    "readHandler"
                ]
            },
            "Outputs": {
                "flow": [
                    "out"
                ],
                "data": []
            }
        }
    ]
}
