let pole = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

let score = 0;

let leaderboard = [
    ["Bláža", 69],
    ["Martíněk", 420],
];

let jmeno = "Noname";

const zmenScore = (noveScore) => {
    score = noveScore;
    document.querySelector("#scoreNum").innerHTML = score;
    vykresliVysledky(jmeno, score);
}

// pole [x] [y]

const vykresliPole = () => {
    document.querySelectorAll('#container>div').forEach((square, i) => {
        square.innerHTML = pole[Math.floor(i / 4)][Math.floor(i % 4)] == 0 ? "" : pole[Math.floor(i / 4)][Math.floor(i % 4)];
        square.style.backgroundColor = `rgb(255, ${255 - (20 * pole[Math.floor(i / 4)][Math.floor(i % 4)])}, 255)`;
    })
};

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

const pridejCtv = () => {
    let newRand = Math.floor(Math.random() * 16);
    while (pole[Math.floor((newRand % 16) / 4)][Math.floor((newRand % 16) % 4)] != 0) {
        newRand += 1;
    }
    pole[Math.floor((newRand % 16) / 4)][Math.floor((newRand % 16) % 4)] = 2;
}

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

const nahoru = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            posunCtvNahoru(i, j);
        }
    }
    pridejCtv();
    vykresliPole();
};

const dolu = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 3; i >= 0; i--) {
            posunCtvDolu(i, j);
        }
    }
    pridejCtv();
    vykresliPole();
};

const vlevo = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            posunCtvVlevo(j, i);
        }
    }
    pridejCtv();
    vykresliPole();
};

const vpravo = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 3; i >= 0; i--) {
            posunCtvVpravo(j, i);
        }
    }
    pridejCtv();
    vykresliPole();
};

document.querySelector('#Nahoru').addEventListener('click', nahoru);
document.querySelector('#Dolu').addEventListener('click', dolu);
document.querySelector('#Vlevo').addEventListener('click', vlevo);
document.querySelector('#Vpravo').addEventListener('click', vpravo);

document.querySelector('#Nova-hra-btn').addEventListener('click', novaHra);

document.querySelector('#name').addEventListener('change', () => {
    jmeno = document.querySelector('#name').value;
    vykresliVysledky(jmeno, score);
});

novaHra();
vykresliPole();