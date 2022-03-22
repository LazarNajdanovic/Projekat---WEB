
export function kreirajLabelu(naslov,classname){
    let lbl = document.createElement("label");
    lbl.innerHTML = naslov;
    lbl.className = classname;
    return lbl;
}

export function kreirajBox(tip, classname){
    let box = document.createElement("input");
    box.type = tip;
    box.className = classname;
    return box;
}

export function kreirajButton(text,classname){
    let btn = document.createElement("button");
    btn.className = classname;
    btn.innerHTML = text;
    return btn;
}

export function kreirajDiv(classname){
    let div = document.createElement("div");
    div.className = classname;
    return div;
}

export function obrisiDecu(host){
    while (host.firstChild) {
        host.removeChild(host.firstChild);
    }
}

export function updateTable(imeKlase){
    var teloTabele = document.querySelector("."+imeKlase);
        var roditeljTabela = teloTabele.parentNode;
        roditeljTabela.removeChild(teloTabele);

        teloTabele = document.createElement("tbody");
        teloTabele.className = imeKlase;
        roditeljTabela.appendChild(teloTabele);
        return teloTabele;
}

