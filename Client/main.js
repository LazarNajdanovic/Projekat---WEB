import { UcenikHelp } from "./UcenikHelp.js";
import { Skola } from "./Skola.js";
import { kreirajBox, kreirajButton, kreirajDiv, kreirajLabelu, obrisiDecu } from "./Pomoc.js"
import { Upravnik } from "./Upravnik.js";
import { Kurs } from "./Kurs.js";
import { Ucenik } from "./Ucenik.js";
import { Ocena } from "./Ocena.js"
import { PredavacHelp } from "./PredavacHelp.js";
import { KursHelp } from "./KursHelp.js";

let listaSkola = [];
let listaUpravnika = [];
let listaKurseva = [];
let listaUcenika = [];
let listaOcena = [];
//preuzmiSkole();
pokreniApp();

function kreirajFormu(){
    
    let strana = document.createElement("div");
    strana.className="Strana";
    document.body.appendChild(strana);

    let divUvod = kreirajDiv("Uvod");
    
    //Div Naslov
    let divNaslov = kreirajDiv("divNaslovStrane");
    let lblNaslov = document.createElement("label");
    lblNaslov.innerHTML = "Škole stranih jezika";
    lblNaslov.className = "lblNaslovStrane";
    divNaslov.appendChild(lblNaslov);
    divUvod.appendChild(divNaslov);

    //SELECT SKOLA
    let divSelectSkola = kreirajDiv("SelectSkola");
    divUvod.appendChild(divSelectSkola);
    kreirajSelectSkole(divSelectSkola);
    strana.appendChild(divUvod);

    prviDeo(strana);
    /*
    let divFooter = kreirajDiv("divFooter");
    strana.appendChild(divFooter);
    let lblFooter = kreirajLabelu("Copyright © 2022 Škole stranih jezika","lblFooter");
    divFooter.appendChild(lblFooter);
    */
}

function prviDeo(host){
    let prviDeo = kreirajDiv("prviDeo");
    host.appendChild(prviDeo);

    /*let divProstorDugmica = kreirajDiv("divProstorDugmica");
    prviDeo.appendChild(divProstorDugmica);
    let btnUpravnik = kreirajButton("Upravnik","btnUpravnik");
    btnUpravnik.onclick = (ev) => prikaziLogovanje();
    divProstorDugmica.appendChild(btnUpravnik);

    let btnKlijent = kreirajButton("Klijent","btnKlijent");
    btnKlijent.onclick = (ev) => prikaziPodatke();
    divProstorDugmica.appendChild(btnKlijent);*/
    prikaziLogovanje();


}

function kreirajSelectSkole(host){

    let divZaLabeleSkola = document.createElement("div");
    divZaLabeleSkola.className = "divZaLabeleSkola";
    let lblSkola = document.createElement("label");
    lblSkola.innerHTML = "Škola: ";
    lblSkola.className = "lblSkola";
    divZaLabeleSkola.appendChild(lblSkola);
    host.appendChild(divZaLabeleSkola);

    let divZaSelectSkola = kreirajDiv("divZaSelectSkola")

    let seSkola = document.createElement("select");
    seSkola.className = "selectSkola";
    seSkola.onchange = (ev) => azuriraj();
    divZaSelectSkola.appendChild(seSkola);

    let op;
    console.log(listaSkola);
    listaSkola.forEach(el => {
        op = document.createElement("option");
        op.innerHTML = el.Naziv;
        op.value = el.ID;
        seSkola.appendChild(op);
    })
    host.appendChild(divZaSelectSkola);
}

function pokreniApp(){
    fetch("https://localhost:5001/Skola/PreuzmiSkole").then(s => {
        if(!s.ok){
            alert("Nije moguće učitati škole!");
        }
        else{
            listaSkola.length = 0;
            s.json().then(skole => {
                skole.forEach( el => {
                    let skola = new Skola(el.id, el.naziv);
                    listaSkola.push(skola);
                });
                kreirajFormu();
            })
        }
    })



}

function azuriraj(){
    let deca = document.querySelector(".prviDeo");
    //let drugiDeoSkini = document.querySelector(".drugiDeo");
    obrisiDecu(deca);
    //drugiDeoSkini.appendChild(deca);
    prikaziLogovanje();
}

function prikaziLogovanje(){
    let prikaz = document.querySelector(".prviDeo");
    obrisiDecu(prikaz);

    let divDeoLogovanje = kreirajDiv("divDeoLogovanje");
    prikaz.appendChild(divDeoLogovanje);

    let divLogovanje = kreirajDiv("divLogovanje");
    divDeoLogovanje.appendChild(divLogovanje);

    let divNaslovLogovanje = kreirajDiv("divNaslovLogovanje");
    let lblNaslov = kreirajLabelu("Logovanje","lblNaslov");
    divNaslovLogovanje.appendChild(lblNaslov);
    divLogovanje.appendChild(divNaslovLogovanje);

    let divEmail = kreirajDiv("divEmail");
    let tbxEmail = kreirajBox("text","tbxEmail");
    tbxEmail.placeholder = "E-mail";
    divEmail.appendChild(tbxEmail);
    divLogovanje.appendChild(divEmail);

    let divPassword = kreirajDiv("divPassword");
    let tbxPassword = kreirajBox("password","tbxPassword");
    tbxPassword.placeholder = "Password";
    divPassword.appendChild(tbxPassword);
    divLogovanje.appendChild(divPassword);

    let divPrijaviSe = kreirajDiv("divPrijaviSe");
    let btnPrijaviSe = kreirajButton("Prijavi se","btnPrijaviSe");
    
    btnPrijaviSe.onclick = (ev) => otvorioLogovanje();
    divPrijaviSe.appendChild(btnPrijaviSe);
    divLogovanje.appendChild(divPrijaviSe); 

}

function otvorioLogovanje(){
    let skola = document.querySelector(".selectSkola").value;
    let mail = document.querySelector(".tbxEmail").value;
    let pass = document.querySelector(".tbxPassword").value;
    if(!mail ){
        alert("Morate uneti e-mail!");
        return;
    }
    if(!/^[a-zA-Z0-9+_.-]+@[a-z]+[.]+[c]+[o]+[m]$/.test(mail)){
        alert("Nevalidan unos za e-mail!");
        return;
    }
    if(!pass){
        alert("Morate uneti password!");
        return;
    }
    fetch("https://localhost:5001/Upravnik/PreuzmiUpravnika/"+skola).then(s => {
        if(!s.ok){
            alert("Nije moguće preuzeti upravnika za školu!");
        }
        else{
            s.json().then(el => { 
                console.log(el);
                console.log(mail,pass);               
                if(mail != el.email || pass != el.password){
                    alert("Neispravan mejl ili lozinka!");
                    document.querySelector(".tbxEmail").value = "";
                    document.querySelector(".tbxPassword").value = "";
                    return;
                }
                else{
                    prikaziOdeljakUpravniku();
                }

            })
            
        }
    })
}

function prikaziOdeljakUpravniku(){
    let prikaz = document.querySelector(".prviDeo");
    obrisiDecu(prikaz);

    let strana = document.querySelector(".Strana");
    /*let drugiDeo = kreirajDiv("drugiDeo");
    strana.appendChild(drugiDeo);*/

    let divZaDrugiDeo = kreirajDiv("divDrugiDeo")
    prikaz.appendChild(divZaDrugiDeo);

    let divDeoUpravnik = kreirajDiv("divDeoUpravnik");
    divZaDrugiDeo.appendChild(divDeoUpravnik)
    praviDeoZaUpravnika(divDeoUpravnik);

}

function praviDeoZaUpravnika(host){

    let grupa = kreirajDiv("grupa");

    let divRadioButton = kreirajDiv("divRButton");
    let niz = ["Učenici", "Predavači", "Kursevi"];
    let rbDiv;
    let rb;
    let lbl;
    niz.forEach((el,index) => {
            rbDiv = document.createElement("div");
            rb = document.createElement("input");
            rb.setAttribute("name","rb");
            rb.className = "rButton";
            rb.type = "radio";
            rb.onclick = () => prikazati() ;
            
            rb.value = index;
            rbDiv.appendChild(rb);

            lbl = document.createElement("label");
            lbl.innerHTML = el;
            rbDiv.appendChild(lbl);
            divRadioButton.appendChild(rbDiv);
    });
    grupa.appendChild(divRadioButton);



    grupa.appendChild(divRadioButton);
    host.appendChild(grupa);

    let divGrupa = kreirajDiv("divGrupa");
    host.appendChild(divGrupa);

}

function prikazati(){

    let checkID = document.querySelectorAll("input[type='radio']:checked"); 
    if( checkID === null ||  checkID.length != 1 ){
        alert("Morate izabrati samo jedan deo za prikaz!");
        return;
    }
    let  check = checkID[0].value;
    if(check == 0){
        prikaziUcenike();
    }
    else if( check == 1){
        prikaziPredavace();
    }
    else if( check == 2 ){
        prikaziKurseve();
    }
}

function prikaziUcenike(){

    let prikaz = document.querySelector(".divGrupa");
    obrisiDecu(prikaz);

    console.log(prikaz);
    let ucenik = new UcenikHelp();
    ucenik.crtaj(prikaz);
}

function prikaziPredavace(){
    let prikaz = document.querySelector(".divGrupa");
    obrisiDecu(prikaz);

    let predavac = new PredavacHelp();
    predavac.crtaj(prikaz);
}

function prikaziKurseve(){
    let prikaz = document.querySelector(".divGrupa");
    obrisiDecu(prikaz);

    let kurs = new KursHelp();
    kurs.crtaj(prikaz);
}