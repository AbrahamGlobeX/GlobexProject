function solve(num) {
    let resM = "";

    let draw = function (literal, num) {
        let string = "";
        for (let i = 0; i < num; i++) string += literal;
        return string;
    }

    if ((!Number.isInteger(num)) || (num < 0)) return 'ERROR';
    if (num > 1000) {
        let temp = Math.trunc(num / 1000);
        resM += draw('M', temp);
        num %= 1000;
    }

    let resI = draw('I', num % 10);
    if (resI.length >= 5) { resI = 'V' + resI.substring(5) }

    let resX = draw('X', Math.trunc((num % 100) / 10));
    if (resX.length >= 5) { resX = 'L' + resX.substring(5) }

    let resC = draw('C', Math.trunc(num / 100));
    if (resC.length >= 5) { resC = 'D' + resC.substring(5) }

    return resM + resC + resX + resI;
}

function parseIntToRoman(intNumb, whichError) {
	var romNumb;
	var romNumbFinal = "";
	if ((parseInt(intNumb, 10) != intNumb) || (parseInt(intNumb,10) < 0)) {
		try {		
			if (whichError == 0) {
				createError("InputError", "Cannot create a valid Roman Numeral");
			}
			else {
				createError("InputError", "Ошибка ввода");
			}
		}
		catch(err) {
			romNumbFinal = err.name.toString() + ": " + err.message.toString();
		}
	}
	else {
		intNumb = parseInt(intNumb, 10).toString();
		for (var k=0; k<intNumb.length; k++) {
			var currentI = parseInt(intNumb.charAt(intNumb.length - (k + 1)));
			romNumb = romNumbFinal;
			romNumbFinal = ints(k, currentI) + romNumb;
		}
	}
	return romNumbFinal;
}

//то, что ниже можешь даже не менять, просто перепиши функцию solve()
time = performance.now();
console.log(solve(1425345283)); //среднее время выполнения - 65мс (за 20-30 запусков) 
time = performance.now() - time;
console.log('Время выполнения = ', time);

console.log('------------');

time = performance.now();
console.log(parseIntToRoman(1425345283)); //среднее время выполнения - 65мс (за 20-30 запусков) 
time = performance.now() - time;
console.log('Время выполнения = ', time);