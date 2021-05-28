let pole = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]; // dvojrozměrné pole s hodnotami jednotlivých políček

let score = 0; // počítač skore

let leaderboard = [
    ["Kebabláža", 69],
    ["Špízřík", 420],
]; // pole se záznamy z výsledkové listiny, naplněno testovacími daty

let jmeno = "Noname"; // default pro jméno

/**
 * Změní skóre na nové a vypíše jej na dané místo
 * @param noveScore - Celé číslo, nové skóre
 */
const zmenScore = (noveScore) => {
    score = noveScore;
    document.querySelector("#scoreNum").innerHTML = score;
    vykresliVysledky(jmeno, score);
}

// pole [x] [y]

/**
 * Projede všechny políčka a zapíše do nich jejich nové hodnoty z abstraktního hracího pole
 */
const vykresliPole = () => {
    document.querySelectorAll('#container>div').forEach((square, i) => {
        square.innerHTML = pole[Math.floor(i / 4)][Math.floor(i % 4)] == 0 ? "" : pole[Math.floor(i / 4)][Math.floor(i % 4)];
        square.style.backgroundColor = `rgb(255, ${255 - (20 * pole[Math.floor(i / 4)][Math.floor(i % 4)])}, 255)`;
    })
};

/**
 * Nahrané body zapíše do výsledkové listiny, nastaví pole a skóre na nuly a náhodně umístí dvě políčka o hodnotě 2
 */
const novaHra = () => {
    if (score > 0) {
        leaderboard.push([jmeno, score]);
    }
    pole = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    zmenScore(0);
    vykresliVysledky(jmeno, score);

    let random = Math.floor(Math.random() * 16);
    pole[Math.floor(random / 4)][Math.floor(random % 4)] = 2;

    let secRandom = Math.floor(Math.random() * 16);

    while (secRandom == random) secRandom = Math.floor(Math.random() * 16);
    pole[Math.floor(secRandom / 4)][Math.floor(secRandom % 4)] = 2;

    vykresliPole();
}

/**
 * Nejdřív přemaže a pak vypíše výsledkovou listinu
 * @param jmeno - Jméno hráče
 * @param score - Hráčovo skóre
 */
const vykresliVysledky = (jmeno, score) => {
    leaderboard = leaderboard.sort((a, b) => {
        return b[1] - a[1]
    });

    document.querySelector("#leaderboard-content").innerHTML = "";
    leaderboard.forEach(item => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(item[0] + " - " + item[1]));
        document.querySelector("#leaderboard-content").appendChild(li);
    });

    let li = document.createElement("li");
    li.appendChild(document.createTextNode(jmeno + " - " + score));
    document.querySelector("#leaderboard-content").appendChild(li);
};

/**
 * Přidá políčko o hodnotě 2 na náhodné nulové políčko
 */
const pridejCtv = () => {
    let newRand = Math.floor(Math.random() * 16);
    while (pole[Math.floor((newRand % 16) / 4)][Math.floor((newRand % 16) % 4)] != 0) {
        newRand += 1;
    }
    pole[Math.floor((newRand % 16) / 4)][Math.floor((newRand % 16) % 4)] = 2;
}


/**
 * Posune políčko o jedno v daném směru
 * @param x - X-ová souřadnice posouvaného políčka 
 * @param y - Y-ová souřadnice posouvaného políčka
 * @param smer - Směr tahu (NA || DO || VL || VP)
 */
const posunOJeden = (x, y, smer) => {
    if (smer == "nahoru" && x > 0) {
        pole[x - 1][y] = pole[x][y];
        pole[x][y] = 0;
    }
    if (smer == "dolu" && x < 4) {
        pole[x + 1][y] = pole[x][y];
        pole[x][y] = 0;
    }
    if (smer == "vlevo" && y > 0) {
        pole[x][y - 1] = pole[x][y];
        pole[x][y] = 0;
    }
    if (smer == "vpravo" && y < 4) {
        pole[x][y + 1] = pole[x][y];
        pole[x][y] = 0;
    }
}

/**
 * Posune políčko nahoru, po nejblížší nenulové políčko, či okraj
 * @param x - X-ová souřadnice posouvaného políčka 
 * @param y - Y-ová souřadnice posouvaného políčka
 */
const posunCtvNahoru = (x, y) => {
    if (pole[x][y] != 0 && x > 0) {
        while (x > 0 && pole[x - 1][y] == 0) {
            posunOJeden(x, y, "nahoru");
            x--;
        }
        if (x > 0 && pole[x - 1][y] == pole[x][y]) {
            pole[x][y] += pole[x][y];
            zmenScore(score + pole[x][y]);
            posunOJeden(x, y, "nahoru");
        }
    }
};

/**
 * Posune políčko dolů, po nejblížší nenulové políčko, či okraj
 * @param x - X-ová souřadnice posouvaného políčka 
 * @param y - Y-ová souřadnice posouvaného políčka
 */
const posunCtvDolu = (x, y) => {
    if (pole[x][y] != 0 && x < 3) {
        while (x < 3 && pole[x + 1][y] == 0) {
            posunOJeden(x, y, "dolu");
            x++;
        }
        if (x < 3 && pole[x + 1][y] == pole[x][y]) {
            pole[x][y] += pole[x][y];
            zmenScore(score + pole[x][y]);
            posunOJeden(x, y, "dolu");
        }
    }
};

/**
 * Posune políčko vlevo, po nejblížší nenulové políčko, či okraj
 * @param x - X-ová souřadnice posouvaného políčka 
 * @param y - Y-ová souřadnice posouvaného políčka
 */
const posunCtvVlevo = (x, y) => {
    if (pole[x][y] != 0 && y > 0) {
        while (y > 0 && pole[x][y - 1] == 0) {
            posunOJeden(x, y, "vlevo");
            y--;
        }
        if (y > 0 && pole[x][y - 1] == pole[x][y]) {
            pole[x][y] += pole[x][y];
            zmenScore(score + pole[x][y]);
            posunOJeden(x, y, "vlevo");
        }
    }
};

/**
 * Posune políčko vpravo, po nejblížší nenulové políčko, či okraj
 * @param x - X-ová souřadnice posouvaného políčka 
 * @param y - Y-ová souřadnice posouvaného políčka
 */
const posunCtvVpravo = (x, y) => {
    if (pole[x][y] != 0 && y < 3) {
        while (y < 3 && pole[x][y + 1] == 0) {
            posunOJeden(x, y, "vpravo");
            y++;
        }
        if (y < 3 && pole[x][y + 1] == pole[x][y]) {
            pole[x][y] += pole[x][y];
            zmenScore(score + pole[x][y]);
            posunOJeden(x, y, "vpravo");
        }
    }
};

/**
 * Pro všecha políčka provede posunutí nahoru
 */
const nahoru = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            posunCtvNahoru(i, j);
        }
    }
    pridejCtv();
    vykresliPole();
};

/**
 * Pro všecha políčka provede posunutí dolů
 */
const dolu = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 3; i >= 0; i--) {
            posunCtvDolu(i, j);
        }
    }
    pridejCtv();
    vykresliPole();
};

/**
 * Pro všecha políčka provede posunutí vlevo
 */
const vlevo = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            posunCtvVlevo(j, i);
        }
    }
    pridejCtv();
    vykresliPole();
};

/**
 * Pro všecha políčka provede posunutí vpravo
 */
const vpravo = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 3; i >= 0; i--) {
            posunCtvVpravo(j, i);
        }
    }
    pridejCtv();
    vykresliPole();
};

// Posluchače na kliknutí na herní tlačítka
document.querySelector('#Nahoru').addEventListener('click', nahoru);
document.querySelector('#Dolu').addEventListener('click', dolu);
document.querySelector('#Vlevo').addEventListener('click', vlevo);
document.querySelector('#Vpravo').addEventListener('click', vpravo);

// Posluchače na kliknutí na tlačítko nové hry
document.querySelector('#Nova-hra-btn').addEventListener('click', novaHra);

// Posluchač na změnu vstupu pro jméno
document.querySelector('#name').addEventListener('change', () => {
    jmeno = document.querySelector('#name').value;
    vykresliVysledky(jmeno, score);
});

// počátek první hry a vykreslení abstraktního pole
novaHra();
vykresliPole();