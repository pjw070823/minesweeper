var n, k, remain;
var map, state; // state: 0 - closed / 1 - opened / 2 - mine

// function that makes mines filling table
function Minesweeper(a, b) {
    // Make Mine
    for (var i=0; i<k; i++) {
        var y = Math.floor(Math.random() * n);
        var x = Math.floor(Math.random() * n);
        if (Math.abs(a-y) <= 1 && Math.abs(b-x) <= 1) { i--; continue; }
        if (map[y][x] < 0) { i--; continue; }
        else map[y][x] = -10;
    }
    
    // Make Number around Mine 
    for (var i=0; i<n; i++) {
        for (var j=0; j<n; j++) {
            if (map[i][j] < 0) {
                if (j-1 >= 0) var l = true; else var l = false;
                if (j+1 < n) var r = true; else var r = false;
                if (i-1 >= 0) {
                    if (l) map[i-1][j-1]++;
                    if (r)map[i-1][j+1]++;
                    map[i-1][j]++;
                }
                if (l) map[i][j-1]++;
                if (r) map[i][j+1]++;
                if (i+1 < n) {
                    if (l) map[i+1][j-1]++;
                    if (r) map[i+1][j+1]++;
                    map[i+1][j]++;
                } 
            }
        }
    }

    // arrange mines (set mines to -1)
    for (var i=0; i<n; i++) {
        for (var j=0; j<n; j++) {
            if (map[i][j] < 0) map[i][j] = -1;
        }
    }
}

// funtion that makes empty table with black background
function MakeTable() {
    n = Number(document.getElementById("size").value);
    k = Number(document.getElementById("cnt").value);
    var div = document.getElementById("table");
    var table = document.createElement("table");
    remain = n * n;
    
    // Initalize
    map = Array(n);
    state = Array(n);
    for (var i=0; i<n; i++) {
        map[i] = Array(n);
        state[i] = Array(n);
        for (var j=0; j<n; j++) { map[i][j] = 0; state[i][j] = 0; }
    }

    for (var i=0; i<n; i++) {
        var tr = document.createElement("tr");
        for (var j=0; j<n; j++) {
            var td = document.createElement("td");
            td.setAttribute("onclick", "onClick(" + i + ", " + j + ")");
            td.setAttribute("ondblclick", "onDbClick(" + i + ", " + j + ")");
            td.setAttribute("oncontextmenu", "onrightclick(" + i + ", " + j + "); return false;");
            td.style.backgroundColor = "black";
            td.style.cursor = "default";
            td.id = i + "-" + j;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    if (div.hasChildNodes()) div.innerHTML = "";
    div.appendChild(table);
}

function onClick(a, b) {
    if (remain == n*n) Minesweeper(a, b);
    if (state[a][b] == 2) return;
    if (state[a][b] == 1) {
        onDbClick(a,b);
        return;
    }
    OpenCell(a, b);
}

function onDbClick(a, b) {
    if (state[a][b] != 1) return;

    var e = document.getElementById(a+"-"+b);
    var top, down, left, right;
    var cnt = 0;
    
    top = a>=1?true:false;
    down = a<=n-2?true:false;
    left = b>=1?true:false;
    right = b<=n-2?true:false;
    
    if (top) {
        cnt += state[a-1][b]==2;
        if (left) cnt += state[a-1][b-1]==2;
        if (right) cnt += state[a-1][b+1]==2;
    }
    if (down) {
        cnt += state[a+1][b]==2;
        if (left) cnt += state[a+1][b-1]==2;
        if (right) cnt += state[a+1][b+1]==2;
    }
    if (left) cnt += state[a][b-1]==2;
    if (right) cnt += state[a][b+1]==2;

    if (Number(e.innerText) != cnt) return;

    if (top) {
        OpenCell(a-1, b);
        if (left) OpenCell(a-1, b-1)
        if (right) cnt += OpenCell(a-1, b+1);
    }
    if (down) {
        OpenCell(a+1, b);
        if (left) OpenCell(a+1, b-1);
        if (right) OpenCell(a+1, b+1);
    }
    if (left) OpenCell(a, b-1);
    if (right) OpenCell(a, b+1);
}

function onrightclick(a, b) {
    var e = document.getElementById(a+"-"+b);
    if (state[a][b] == 0) {
        state[a][b] = 2;
        e.style.backgroundColor = "green";
    }
    else if (state[a][b] == 2) {
        state[a][b] = 0;
        e.style.backgroundColor = "black";
    }
}

function OpenCell(a, b) {
    if (state[a][b] == 2) return;
    if (map[a][b] < 0) { alert("You Lose!"); document.getElementById("table").innerHTML = ""; return; }
    var e = document.getElementById(a+"-"+b);
    if (state[a][b] == 0) {
        e.style.backgroundColor = "white";
        state[a][b] = 1;
    }
    else return;
    e.innerText = map[a][b]?map[a][b]:"";
    if (map[a][b] == 0) {
        var t = a-1 >= 0?true:false;
        var d = a+1 < n?true:false;
        var l = b-1 >= 0?true:false;
        var r = b+1 < n?true:false;
        if (t) {
            if (l) OpenCell(a-1, b-1);
                   OpenCell(a-1, b);
            if (r) OpenCell(a-1, b+1);
        }
        if (l)     OpenCell(a, b-1);
        if (r)     OpenCell(a, b+1);
        if (d) {
            if (l) OpenCell(a+1, b-1);
                   OpenCell(a+1, b);
            if (r) OpenCell(a+1, b+1);
        }
    }
    // start new game when done
    if (--remain == k) MakeTable();
}
