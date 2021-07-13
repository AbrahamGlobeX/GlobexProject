/**
 * GeoMapChecker
 */

class GeoMapChecker {
	constructor(callerObject) {
		this.caller = callerObject;
		
		if(callerObject == undefined)
			this.caller = this;
	}
	
	undefinedTest(method, object, objectInfo, container) {
		//let errorColor = "color: red";
		//let errorMessage = "%c" + "Error! " + method;
		
		//if (object == undefined) {
		//	if (container != undefined) {
		//		errorMessage += " Can't find '" + objectInfo + "' in:";
		//		console.log(errorMessage, errorColor, container);
		//	} else {
		//		errorMessage += "'" + objectInfo + "' is undefined";
		//		console.log(errorMessage, errorColor);
		//	}
		//	return true;
		//}
		//
		//if(objectInfo == undefined) {
		//	errorMessage += " " + object;
		//	console.log(errorMessage, errorColor);
		//	return true;
		//}
		
		return false;
	}
	
	getUndefinedTestFunction(method) {
		let methodName = this.caller.constructor.name + "::" + method + "()";
		
		let self = this;
		
		return function (object, objectInfo, container) {
			return self.undefinedTest(methodName, object, objectInfo, container);
		}
	}
};