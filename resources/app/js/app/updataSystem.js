function parentSave(temp) {
    //一時ファイルを親ファイルへ保存
    let savepath = "./resource/persondata.json"
    let tempdata = JSON.stringify(temp);

    const fs = require('fs');
    try {
        fs.writeFile(savepath, tempdata, (error) => {
            if (error != null) {
                alert("save error.");
                return;
            }
        });
    } catch (e) {
        alert("file error.");
        console.log(e);
    }
}

function ucreatEelement(tabledata, classname) {
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

function ukeikacalc(keikakey) {
    /**
     * 現在時刻から時間経過計算
     * 現在プランの利用期間？当初からの積み上げ期間、後者とする
     * 
     * @ param keikakey string[] 経過年月
     */
    let now = new Date();
    let arr = [];
    let result;
    for (let day of keikakey) {
        let eddate = Date.parse(day);
        //console.log(day + ":" + eddate);
        arr.push(eddate);
    }
    let re = arr.reduce((a, b) => Math.max(a, b));
    let ms = now - re;
    result = Math.floor(ms / (1000 * 60 * 60 * 24));
    return result;
}

function uopentemp() {
    let path = "./resource/temp.json";
    let fs = require('fs');
    let result;
    try {
        result = fs.readFileSync(path, 'utf-8');
    } catch (e) {
        alert("file open error.");
        console.log(e);
    }
    //console.log(result);
    return JSON.parse(result || "null", 'utf-8');
}

function _compareRank(a, b) {
    //systemdata以降の配列を受け取る
    const rankA = a.rank.toUpperCase();
    const rankB = b.rank.toUpperCase();

    let comparison = 0;
    if (rankA > rankB) {
        comparison = 1;
    } else if (rankA < rankB) {
        comparison = -1;
    }
    return comparison;
}
function _compareDate(a, b) {
    //時系列についてのソート追記
    const A = Date.parse(a.date);
    const B = Date.parse(b.date);

    let comparison = 0;
    if (A > B) {
        comparison = 1;
    } else{
        comparison = -1;
    }
    return comparison;
}

function ucreateParentTabledata() {
    /**
     * tableのデータを作成
     * @　return=tabledata object 2次元配列
     */
    let pr = uopentemp(); //temp読込
    const com1 = pr.systemdata.sort(_compareDate);
    const com2 = com1.sort(_compareRank);
    //console.log(com1);
    //console.log(com2);
    let parent = {};
    parent["systemdata"] = com2;

    console.log(parent);
    let parentlen = parent.systemdata.length;
    //console.log(parentlen);
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
        //------------------------------------
        let pk = Object.keys(parent.systemdata[i].keika);
        let kobj = {};
        for (let j of pk) {
            kobj[j] = parent.systemdata[i].keika[j];
        }
        pdatetime.push(`約${Math.floor(ukeikacalc(pk)/30)}ヶ月<br>(${ukeikacalc(pk)}日)`);
        //console.log(kobj);
        pkeika.push(kobj);
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
    parentSave(parent);
    return tabledata;
}

function deleteElement() {
    let path = "./resource/persondata.json";
    let fs = require('fs');
    let result;
    try {
        result = fs.readFileSync(path, 'utf-8');
    } catch (e) {
        alert("file open error.");
        console.log(e);
    }
    //console.log(result);
    let data = JSON.parse(result || "null", 'utf-8');
    let len = data.systemdata.length;

    for (let i = 0; i < len; i++) {
        let pr = document.getElementById(`tbody${i}`);
        pr.remove();
    }
}

//main
function usystemUpdata() {
    console.log("アップデート")
    deleteElement();
    let tabledata = ucreateParentTabledata(); //tabledata作成
    ucreatEelement(tabledata, "table"); //DOM作成
    console.log("update_done");
    let sy = document.getElementById('dataview');
    sy.innerHTML = "DataView:UpdateSystemData"
    document.getElementById('updatetable').style.display = "none";
    alert("システムデータを更新しました")
}
document.getElementById('updatetable').addEventListener('click', function () {
    usystemUpdata();

})