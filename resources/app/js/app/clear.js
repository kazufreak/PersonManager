/**
function _init() {
    let tabledata = _createParentTabledata(); //tabledata作成
    _creatEelement(tabledata, "table"); //DOM作成
    _innsertnowData();
    console.log("Init_done");
}
*/
function _creatEelement(tabledata, classname) {
    /**
     * DOM操作　table以下要素の作成
     * @ param tabledata  object (2次元)creatParentTablrdata()の戻り値
     * @ param classname DOM table要素のクラスname
     */
    let tablename = document.getElementsByClassName(classname)[0];
    for (let i = 0; i < tabledata.length; i++) {
        let tbody = document.createElement('tbody');
        tbody.setAttribute('id', `tbody${i}`);
        let tr = document.createElement('tr');
        tbody.appendChild(tr);
        for (let j = 0; j < tabledata[0].length; j++) {
            let td = document.createElement('td');
            //console.log(tabledata[i][j] instanceof Object);
            if (tabledata[i][j] instanceof HTMLElement) {
                td.appendChild(tabledata[i][j]);
            } else if (tabledata[i][j] instanceof Object && tabledata[i][j] instanceof HTMLElement == false) {
                let div1 = document.createElement('select');
                div1.setAttribute('class', "dropdown-btn");
                for (let n = 0; n < Object.keys(tabledata[i][j]).length; n++) {
                    let key = Object.keys(tabledata[i][j])
                    let a = document.createElement('option');
                    a.setAttribute('class', "dropdown-val");
                    a.setAttribute('value', `${tabledata[i][j][key[n]]} : ${key[n]}`);
                    a.innerHTML = `${tabledata[i][j][key[n]]} : ${key[n]}`;
                    div1.appendChild(a);
                }
                //div.appendChild(div1);
                td.appendChild(div1);
            } else {
                td.innerHTML = tabledata[i][j];
            }
            tr.appendChild(td);
        }
        tablename.appendChild(tbody);
    }

}

function _createParentTabledata() {
    /**
     * tableのデータを作成
     * @　return=tabledata object 2次元配列
     */
    let parent = _openSystemdata(); //プライマリー読込
    let parentlen = 1;
    console.log(parent);
    let pid = [],
        pname = [],
        pdate = [],
        prank = [],
        pkeika = [],
        pdatetime = [],
        pmsdata = [];
    for (let i = 0; i < parentlen; i++) {
        pid.push(parent.systemdata[i].id);
        pname.push(parent.systemdata[i].name);
        let strdate = parent.systemdata[i].date;
        pdate.push(strdate);
        prank.push(parent.systemdata[i].rank);
        pdatetime.push(`null`);
        //console.log(kobj);
        pkeika.push("null");
        pmsdata.push(parent.systemdata[i].msdata);
    }
    let tabledata = [];
    //console.log(pid.length);
    for (let i = 0; i < pid.length; i++) {
        let rowdata = [];
        rowdata.push(pid[i]);
        rowdata.push(pname[i]);
        rowdata.push(pdate[i]);
        rowdata.push(prank[i]);
        rowdata.push(pkeika[i]);
        rowdata.push(pdatetime[i]);
        rowdata.push(pmsdata[i]);
        let div = document.createElement("div");
        let select = document.createElement("select");
        select.setAttribute('class', "dropdown-btn");
        select.setAttribute('id', `selecttemp${i}`);
        for (let n = 1; n < 4; n++) {
            let a = document.createElement('option');
            a.setAttribute('class', "dropdown-val");
            a.setAttribute('value', `Template${n}`);
            a.innerHTML = `Template${n}`;
            select.appendChild(a);
        }
        let b = document.createElement('option');
        b.setAttribute('class', "dropdown-val");
        b.setAttribute('value', `Normal`);
        b.innerHTML = `Normal`;
        select.appendChild(b);
        let c = document.createElement('option');
        c.setAttribute('class', "dropdown-val");
        c.setAttribute('value', `VIP`);
        c.innerHTML = `VIP`;
        select.appendChild(c);
        let d = document.createElement('option');
        d.setAttribute('class', "dropdown-val");
        d.setAttribute('value', `Other`);
        d.innerHTML = `Other`;
        select.appendChild(d);

        let btn = document.createElement("button");
        btn.setAttribute('type', "button");
        btn.setAttribute('class', "btn btn-primary");
        btn.setAttribute('id', `msbtn${i}`);
        btn.setAttribute('onclick', "getElementId(event)");
        btn.innerHTML = "作成";
        div.appendChild(select);
        div.appendChild(btn);
        rowdata.push(div);

        tabledata.push(rowdata);
    }
    //console.log(tabledata);
    let sy = document.getElementById('dataview');
    sy.innerHTML = "DataView:SystemData"
    return tabledata;
}

function _openSystemdata() {
    let path = "./resource/persondata.json";
    let fs = require('fs');
    let result;
    try {
        result = fs.readFileSync(path, 'utf-8');
    } catch (e) {
        alert("file open error.");
        console.log(e);
    }
    console.log(result);
    return JSON.parse(result || "null", 'utf-8');
}

function _innsertnowData() {
    let d = new Date();
    console.log(d);
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let timedata = [year, month, day];
    let timeString = `現在日付：${year}/${month}/${day}`;
    console.log(timeString);
    let ti = document.getElementById('nowdate');
    ti.innerHTML = timeString;
}

const inidata = {
    "systemdata": [{
        "id": "Null",
        "name": "Null",
        "date": "Null",
        "rank": "Null",
        "keika": {
            "Null": "Null"
        },
        "msdata": "Null"
    }]
};

function clear() {
    return new Promise((resolve) => {
        const crearJson = JSON.stringify(inidata);
        const fs = require('fs');
        let path = "./resource/persondata.json";
        fs.writeFile(path, crearJson, (error) => {
            if (error != null) {
                alert("ClearError");
                return;
            } else {
                resolve();
            }
        });
        let table = document.getElementsByClassName('table')[0];
        let len = table.childElementCount -1;//theadは除外
        for (let i = 0; i < len; i++) {
            let body = document.getElementById(`tbody${i}`);
            body.remove();
        }
        alert("データを初期化しました");
    })

}
/*
document.getElementById('clearbtn').addEventListener('click', async () => {
    await clear();
    _init();
});*/
