class JSBlockFunctionLoader {

    constructor() {

        this.loadedJSBLocksOIDs = null;

        this.enabled = false;
    }

    static JSFunctionsHtmlId;

    checkFunctionBody(functionBody) {

        try {

            eval('const ' + functionBody);

        } catch (e) {

            return false;
        }

        return true;
    }

    checkBlock(blockData) {

        if (typeof blockData == 'undefined')
            return false;


        if (typeof blockData.func == 'undefined')
            return false;

        const lib = blockData.lib;

        if (typeof lib == 'undefined' || typeof lib['$oid'] == 'undefined')
            return false;

        return true;
    }

    parseFunctionBodies(jsBlocks) {

        if (typeof jsBlocks == 'undefined')
            return;

        const functionsBodies = {};

        for (let block of jsBlocks) {

            const objectData = block.object;

            if (!this.checkBlock(objectData))
                continue;

            const lib = objectData.lib['$oid'];

            functionsBodies[lib] = functionsBodies[lib] || [];

            functionsBodies[lib].push(objectData.func);
        }

        return functionsBodies;
    }

    fixFunctionBody(functionBody) {

        const startNameIndex = functionBody.indexOf('function') + 'function'.length;

        const endNameIndex = functionBody.indexOf('(');

        const fixedFunctionBody = functionBody.substring(startNameIndex, endNameIndex).replace(/\s/g, '') + ' = function' + functionBody.substring(endNameIndex);

        console.log('fixedFunctionBody', fixedFunctionBody);

        return fixedFunctionBody;
    }

    createFunctions(functionsBodies) {

        const id = JSBlockFunctionLoader.jsFunctionsHtmlId;

        let scriptHtml = document.getElementById(id);
        
        if(scriptHtml == null) {

            scriptHtml = document.createElement('script');

            scriptHtml.id = id;
        }

        const libTypeFunction = ' = function(){}';

        const libTypePrefix = 'Type_';

        let scriptBody = '';

        for (let libName in functionsBodies) {

            const libTypeName = libTypePrefix + libName;

            if(typeof window[libTypeName + libTypeFunction] === 'undefined') {
                scriptBody += `window.${libTypeName}${libTypeFunction};\n`;
                scriptBody += `window.${JSBlockFunctionLoader.jsBlockLibPrefix}${libName} = new window.${libTypeName}();\n`;
            }

            for (let functionBody of functionsBodies[libName]) {

                if (!this.checkFunctionBody(functionBody))
                    continue;

                scriptBody += `window.${libTypeName}.prototype.${functionBody};\n`;
            }
            
            scriptBody += '\n';
        }

        scriptHtml.text = scriptBody;
        document.head.appendChild(scriptHtml);

    }

    loadFunctionsBodies(jsBlocksOIDs, nextSyncFunction) {

        let jsBlocksOIDsToLoad;

        const loadedJSBLocksOIDs = this.loadedJSBLocksOIDs;

        if (typeof jsBlocksOIDs != 'undefined') {

            if (loadedJSBLocksOIDs === null) {

                jsBlocksOIDsToLoad = jsBlocksOIDs;

                this.loadedJSBLocksOIDs = new Set([...jsBlocksOIDs]);

            } else {

                jsBlocksOIDsToLoad = [];

                for (let oid of jsBlocksOIDs)
                    if (!loadedJSBLocksOIDs.has(oid)) {

                        loadedJSBLocksOIDs.add(oid);

                        jsBlocksOIDsToLoad.push(oid);
                    }
            }

            if (jsBlocksOIDsToLoad.length != 0) {

                const that = this;

                APP.dbWorker.responseGetOnlyBlocks = function (resp) {

                    APP.dbWorker.responseGetOnlyBlocks = null;

                    const jsBlocks = resp.cursor.firstBatch;

                    that.createFunctions(that.parseFunctionBodies(jsBlocks));

                    if (typeof nextSyncFunction != 'undefined') {

                        nextSyncFunction();
                    }
                };

                APP.dbWorker.requestGetOnlyBlocks(jsBlocksOIDsToLoad);

                return;
            }
        }

        if (typeof nextSyncFunction != 'undefined')
            nextSyncFunction();
    }

    load(script, nextSyncFunction) {

        //if (this.enabled) return;

        //this.enabled = true;


        this.loadFunctionsBodies(script[JSBlockFunctionLoader.jsBlockScriptFieldName], nextSyncFunction);
    }

};

JSBlockFunctionLoader.jsFunctionsHtmlId = 'JSBlocksFunctions';
JSBlockFunctionLoader.jsBlockScriptFieldName = 'jsBlocksOIDs';
JSBlockFunctionLoader.jsBlockLibPrefix = '_';

const jsBlockFunctionLoader = new JSBlockFunctionLoader();
