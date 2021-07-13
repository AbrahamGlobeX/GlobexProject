class JSPart {

    log(value) {
        console.log(value);
    }

    appendElement(array, elem) {

        const arrayCopy = JSON.parse(JSON.stringify(array));
        const newElem = JSON.parse(JSON.stringify(elem));

        arrayCopy.push(newElem);

        return arrayCopy;
    }

    toString(value) {
        return value + "";
    }
    
    inversion(value) {
        return !value;
    }
}

var jspart = new JSPart();