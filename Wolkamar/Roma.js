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
//то, что ниже можешь даже не менять, просто перепиши функцию solve()
time = performance.now();
console.log(solve(1425345283)); //среднее время выполнения - 65мс (за 20-30 запусков) 
time = performance.now() - time;
console.log('Время выполнения = ', time);