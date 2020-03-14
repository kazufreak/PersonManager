var X = XLSX;
global.systemUser = 0;
global.exelUser = 0;
global.appendUser = 0;
global.deleteUser = 0;
global.updateSystemUser = 0;

function _init() {
    systemUser = 0;
    exelUser = 0;
    appendUser = 0;
    deleteUser = 0;
    updateSystemUser = 0;
}
// ファイル選択時のメイン処理
function handleFile(e) {
    createbuckup(); //backup作成
    _init();

    var files = e.target.files;
    var f = files[0];
    console.log(f.name);
    document.getElementsByClassName('custom-file-label').value = f.name;

    var reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;
        var wb;
        var arr = fixdata(data);
        wb = X.read(btoa(arr), {
            type: 'base64',
            cellDates: true,
        });

        var output = "";
        output = to_json(wb);
        //console.log(output);
        editSavefile(output); //システムと比較して保存
        document.getElementById('updatetable').style.display = "block";

    };

    reader.readAsArrayBuffer(f);
}

// ファイルの読み込み
function fixdata(data) {
    var o = "",
        l = 0,
        w = 10240;
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w,
        l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

// ワークブックのデータをjsonに変換
function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function (sheetName) {
        var roa = X.utils.sheet_to_json(
            workbook.Sheets[sheetName], {
                raw: true,
            });
        if (roa.length > 0) {
            result[sheetName] = roa;
        }
    });
    return result;
}

function editSavefile(data) {
    try {
        let parent = openSystemdata(); //プライマリー読込
        let parentlen = parent.systemdata.length;
        //console.log(parentlen);
        let pid = [],
            pname = [],
            pdate = [],
            prank = [],
            pkeika = [],
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
            //console.log(kobj);
            pkeika.push(kobj);
            pmsdata.push(parent.systemdata[i].msdata);
        }
        //console.log(pkeika);

        //読込エクセルデータ
        const keys = ['ユーザーID', 'ユーザー名', '参加プラン', '参加日'];
        const kp = Object.keys(data);
        let len = Object.keys(data[kp]).length;
        let id = [],
            name = [],
            date = [],
            rank = [],
            keika = [];
        for (let i = 0; i < len; i++) {
            if (data[kp][i][keys[0]] != undefined || data[kp][i]['ユーザーＩＤ'] != undefined) {
                id.push(data[kp][i][keys[0]]);
                name.push(data[kp][i][keys[1]]);
                rank.push(data[kp][i][keys[2]]);
                let dateobject = data[kp][i][keys[3]];
                //console.log(typeof dateobject);
                let inputformat = `${dateobject.getFullYear()}/${dateobject.getMonth()+1}/${dateobject.getDate()}`;
                date.push(inputformat);
                let kobj = {};
                kobj[inputformat] = data[kp][i][keys[2]];
                keika.push(kobj);
            } else {
                delete data[kp][i];
            }

        }
        systemUser = pid.length;
        exelUser = id.length;


    //console.log(data);
    let updateData = updata(pid, pname, pdate, prank, pkeika, pmsdata, id, name, date, rank, keika)


    //console.log(JSON.stringify(updateData));
    savetempfile(updateData); //一時ファイル保存
} catch (error) {
    alert("エクセルの読込に失敗しました\nデータ内容を確認し再度お試し下さい。\n" + error);
    //return;
}
}

function updata(pid, pname, pdate, prank, pkeika, pmsdata, id, name, date, rank, keika) {
    //idのチェック　新規があれば追記、既存は更新
    for (let i = 0; i < id.length; i++) {
        //新規が親になければ追加 >> その逆も作成
        if (!pid.includes(id[i])) {
            pid.push(id[i]);
            pname.push(name[i]);
            pdate.push(date[i]);
            prank.push(rank[i]);
            pkeika.push(keika[i]);
            pmsdata.push("");
            appendUser += 1;

            //console.log("追記");
            //console.log(pid.length + ":" + Object.keys(pkeika).length);
        }
    }
    console.log("追加後parent:" + pid.length);
    //console.log("追加後のＩＤ:"+pid);

    //親データから除外
    let delid = [];
    for (let v of pid) {
        if (id.indexOf(v) < 0) {
            deleteUser += 1;
            delid.push(v);
        }
    }
    console.log("deleteId: " + delid.length);

    for (let delkey of delid) {
        let xi;
        xi = pid.indexOf(delkey);

        pid.splice(xi, 1);
        pname.splice(xi, 1);
        pdate.splice(xi, 1);
        prank.splice(xi, 1);
        pkeika.splice(xi, 1);
        pmsdata.splice(xi, 1);
    }
    console.log("削除後parent:" + pid.length);
    //console.log("削除後のＩＤ:" + pid);
    //console.log("child1:" + id);
    for (let i = 0; i < id.length; i++) {
        //更新処理
        if (pid.some(item => item === id[i])) {
            //日付を確認し更新されていればkeikaへ追記
            let pn = pid.indexOf(id[i]);
            if (pdate[pn] != date[i]) {
                pdate[pn] = date[i];
                prank[pn] = rank[i];
                let k = Object.keys(keika[i]);
                //console.log(keika[i][k]);
                pkeika[pn][k] = keika[i][k];
                //console.log("更新");
                //console.log(pid.length + ":" + Object.keys(pkeika).length);
                if (pmsdata[pn] == "") {
                    pmsdata[pn] = pmsdata[i];
                }
            }
        }

    }


    //console.log(pid);
    //更新データ作成
    let updateData = {};
    let array = [];
    for (let i = 0; i < pid.length; i++) {
        let obj = {
            ["id"]: pid[i],
            ["name"]: pname[i],
            ["date"]: pdate[i],
            ["rank"]: prank[i],
            ["keika"]: pkeika[i],
            ["msdata"]: pmsdata[i]
        };

        //console.log(obj);
        array.push(obj);

    }

    updateSystemUser = pid.length;
    updateData["systemdata"] = array;
    return updateData;
}

function savetempfile(content) {
    //一時ファイル保存
    let savePath = "./resource/temp.json";
    let fs = require('fs');
    let data = JSON.stringify(content);
    fs.writeFile(savePath, data, (error) => {
        if (error != null) {
            alert("save error.");
            return;
        }
    });
    alert(`エクセルデータを読込みました。\n更新するには「データ更新」ボタンを押して下さい\nSystemData:${systemUser}\nReadUser:${exelUser}\nAppendUser:${appendUser}\nDeleteUser:${deleteUser}\nUpdateSystemUser:${updateSystemUser}`);
    console.log("Done");

}

function createbuckup() {
    const parentdata = openSystemdata();
    let now = new Date();
    let pathplus = `${now.getFullYear()}${now.getMonth()+1}${now.getDate()}${now.getHours()}${now.getMinutes()}`
    const savePath = `./backup/backup_${pathplus}.json`;
    const fs = require('fs');
    let data = JSON.stringify(parentdata);
    fs.writeFile(savePath, data, (error) => {
        if (error != null) {
            alert("buckup error.");
            return;
        }
    });
    console.log("create: Backupfile");
    /*
    let fs2 = require("fs");
        const dir = './backup';
        fs2.readdir(dir, (err, files) => {
            let len = files.length;
            num = [];
            for(let i = 0; i< len;i++){
                //ファイル名を確認してファイルを直近５個とする
                num.push(files[i].replace(/(backup_)(\d+)(.json))/g,'$2'));
            }
            let result = num.sort((a, b) => {
                if (a > b) {
                    return 1;
                } else {
                    return -1;
                }
                
            });
        });*/

}


function openSystemdata() {
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
    return JSON.parse(result, 'utf-8');
}


// ファイル選択欄 選択イベント
// http://cccabinet.jpn.org/bootstrap4/javascript/forms/file-browser
document.getElementById('customFile').addEventListener('change', function (e) {
    handleFile(e);
    _init();
})