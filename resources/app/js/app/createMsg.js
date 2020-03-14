function createmsg(ind) {
    //temp読込
    path1 = "./msg/template1.txt"
    path2 = "./msg/template2.txt"
    path3 = "./msg/template3.txt"
    path4 = "./msg/normal.txt"
    path5 = "./msg/VIP.txt"
    path6 = "./msg/Other.txt"
    let {
        temp1,
        temp2,
        temp3,
        temp4,
        temp5,
        temp6,

    } = openMsgTemp(path1, path2, path3, path4, path5, path6);

    //domへメッセージ作成時間記録\
    //console.log(ind);
    let tbody = document.getElementById(`tbody${ind}`);
    let tr = tbody.children[0];
    let name = tr.children[1].textContent;
    let time = tr.children[5].textContent;
    //let num = tr.children[7].children.children.selectedIndex;
    let selectTemp = document.getElementById(`selecttemp${ind}`).value;
    console.log(selectTemp);
    let timeString = nowData();
    console.log(timeString);
    tr.children[6].innerHTML = timeString; //作成日時書き込み

    //MSG作成
    let resultmsg = "";
    switch (selectTemp) {
        case "Template1":
            resultmsg = temp1.replace(/\[name\]/g, name);
            break;
        case "Template2":
            resultmsg = temp2.replace(/\[name\]/g, name);
            break;
        case "Template3":
            resultmsg = temp3.replace(/\[name\]/g, name);
            break;
        case "Normal":
            resultmsg = temp4.replace(/\[name\]/g, name);
            break;
        case "VIP":
            resultmsg = temp5.replace(/\[name\]/g, name);
            break;
        case "Other":
            resultmsg = temp6.replace(/\[name\]/g, name);
            break;
    }
    resultmsg = resultmsg.replace(/\[keika\]/g, time.replace(/(^約)(\d+ヶ月)(\(\d+日\)$)/g, '$2'));
    console.log(resultmsg);

    var text = document.createElement('textarea');
    var parentNode = document.getElementById('footer');
    parentNode.appendChild(text);
    text.value = resultmsg;
    text.select();
    document.execCommand("copy");
    text.remove();
    alert(`以下のメッセージをクリップボードへコピーしました\n${resultmsg}`);

    //書き込みpersondata.json
    let id = tr.children[0].textContent;
    parentUpdata(id, timeString);

}

function openMsgTemp(path1, path2, path3, path4, path5, path6) {
    let fs = require('fs');
    let temp1;
    let temp2;
    let temp3;
    let temp4;
    let temp5;
    let temp6;
    try {
        temp1 = fs.readFileSync(path1, 'utf-8');
        temp2 = fs.readFileSync(path2, 'utf-8');
        temp3 = fs.readFileSync(path3, 'utf-8');
        temp4 = fs.readFileSync(path4, 'utf-8');
        temp5 = fs.readFileSync(path5, 'utf-8');
        temp6 = fs.readFileSync(path6, 'utf-8');
    } catch (e) {
        alert("file open error.");
        console.log(e);
    }
    return {
        temp1,
        temp2,
        temp3,
        temp4,
        temp5,
        temp6
    };
}

function nowData() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let timeString = `${year}/${month}/${day}`;

    return timeString;
}

function parentUpdata(msid, msgdate) {
    let parent = opendata(); //プライマリー読込
    let parentlen = parent.systemdata.length;
    //console.log(parentlen);
    for (let i = 0; i < parentlen; i++) {
        if (parent.systemdata[i].id == msid) {
            parent.systemdata[i].msdata = msgdate;
        }
    }
    console.log(JSON.stringify(parent));
    saveParentfile(parent); //保存
}

function saveParentfile(content) {
    //一時ファイル保存
    let savePath = "./resource/persondata.json";
    let fs = require('fs');
    let data = JSON.stringify(content);
    fs.writeFile(savePath, data, (error) => {
        if (error != null) {
            alert("save error.");
            return;
        }
    });
    console.log("Done");


}


function opendata() {
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

//main関数
function getElementId(e) {
    //index取得
    let ind = e.target.id;
    ind = ind.replace('msbtn', '');
    createmsg(ind);
}