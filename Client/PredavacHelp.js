import { kreirajButton, kreirajLabelu,kreirajBox, kreirajDiv, updateTable } from "./Pomoc.js";
import { Predavac } from "./Predavac.js"
import { Kurs } from "./Kurs.js"

export class PredavacHelp{

    constructor(){
        this.listaPredavaca = [];
        this.kurs = new Kurs(-1,"/","/","");
        this.listaKurseva = [];
    }

    crtaj(host){

        this.prikazatiPredavace();

        let divDodaj = document.createElement("div");
        divDodaj.className = "divDodajPredavac";
        host.appendChild(divDodaj);
        this.napraviDodaj(divDodaj);

        let divOpcije = document.createElement("div");
        divOpcije.className = "divOpcijePredavac";
        host.appendChild(divOpcije);
        this.napraviOpcije(divOpcije);

        let divTabela = document.createElement("div");
        divTabela.className = "divTabelaPredavac";
        host.appendChild(divTabela);
        this.napraviTabelu(divTabela);

    }

    napraviTabelu(host){
        
        var tabela = document.createElement("table");
        tabela.className="tabela";
        host.appendChild(tabela);

        var thead= document.createElement("thead");
        tabela.appendChild(thead);

        var tr = document.createElement("tr");
        tr.className = "row";
        thead.appendChild(tr);

        var tbody = document.createElement("tbody");
        tbody.className="tabelaBody";
        tabela.appendChild(tbody);

        let th;
        var nizZaglavlja=["Ime", "Prezime", "JMBG","Sertifikat","Naziv"];
        nizZaglavlja.forEach(el => {
            th = document.createElement("th");
            th.innerHTML = el;
            tr.appendChild(th);
        })
    }

    azurirajPodatke_NapraviTeloTabele(){

        var teloTabele = document.querySelector(".tabelaBody");
        var roditeljTabela = teloTabele.parentNode;
        roditeljTabela.removeChild(teloTabele);

        teloTabele = document.createElement("tbody");
        teloTabele.className = "tabelaBody";
        roditeljTabela.appendChild(teloTabele);


        this.listaPredavaca.forEach((el) => {

            var tr = document.createElement("tr");
            tr.className = "red";
            teloTabele.appendChild(tr);
            
            tr.id = el.id;

            tr.addEventListener('click', () => {
                
                tr.className = "selektovan";
                console.log(tr);
            })
            tr.addEventListener('dblclick',() => {
                tr.className = "neselktovan";
                console.log(tr);
            })

            var ime = document.createElement("td");
            ime.innerHTML = el.ime;
            ime.className="ime";
            tr.appendChild(ime);

            var prezime = document.createElement("td");
            prezime.innerHTML = el.prezime;
            prezime.className = "prezime";
            tr.appendChild(prezime);

            var jmbg = document.createElement("td");
            jmbg.innerHTML = el.jmbg;
            jmbg.className = "jmbg";
            tr.appendChild(jmbg);

            var sertifikat = document.createElement("td");
            sertifikat.innerHTML = el.sertifikat;
            sertifikat.className = "sertifikat";
            tr.appendChild(sertifikat);

            var naziv = document.createElement("td");
            naziv.innerHTML = this.kurs.Naziv;
            naziv.className = "naziv";
            tr.appendChild(naziv);
        });
        
    }

    napraviDodaj(host){

        let divNaslov = document.createElement("div");
        divNaslov.className = "divNaslovPredavac";
        
        let lblNaslov = kreirajLabelu("Podaci o novom predavaču","lblNaslovPredavac");
        divNaslov.appendChild(lblNaslov);
        host.appendChild(divNaslov);

        //IME
        let divIme = document.createElement("div");
        divIme.className = "divIme";

        let lblIme = kreirajLabelu("Ime:","lblIme");
        divIme.appendChild(lblIme);
        let tbxIme = kreirajBox("text","tbxIme");
        divIme.appendChild(tbxIme);
        host.appendChild(divIme);


        //PREZIME
        let divPrezime = document.createElement("div");
        divPrezime.className = "divPrezime";

        let lblPrezime = kreirajLabelu("Prezime:","lblPrezime");
        divPrezime.appendChild(lblPrezime);
        let tbxPrezime = kreirajBox("text","tbxPrezime");
        divPrezime.appendChild(tbxPrezime);
        host.appendChild(divPrezime);


        //JMBG
        let divJMBG = document.createElement("div");
        divJMBG.className = "divJMBG";

        let lblJMBG = kreirajLabelu("JMBG:","lblJMBG");
        divJMBG.appendChild(lblJMBG);
        let tbxJMBG = kreirajBox("number","tbxJMBG");
        divJMBG.appendChild(tbxJMBG);
        host.appendChild(divJMBG);

        //Sertifikat
        let divSertifikat = document.createElement("div");
        divSertifikat.className = "divSertifikat";

        let lblSertifikat = kreirajLabelu("Sertifikat:","lblSertifikat");
        divSertifikat.appendChild(lblSertifikat);
        
        let divRadioButton = document.createElement("div");
        divRadioButton.className = "divRadioButton";
        let niz = ["DA","NE"];
        let rbDiv;
        let rb;
        let lbl;
        niz.forEach((el) => {
            rbDiv = document.createElement("div");
            rb = document.createElement("input");
            rb.setAttribute("name","rb");
            rb.type = "radio";
            rb.className = "rbSertifikat";
            rb.value = el;
            rbDiv.appendChild(rb);
            lbl = document.createElement("label");
            lbl.innerHTML = el;
            rbDiv.appendChild(lbl);
            divRadioButton.appendChild(rbDiv);
        });
        divSertifikat.appendChild(divRadioButton);
        host.appendChild(divSertifikat);

        //Dugme - DODATI
        let divButton = document.createElement("div");
        divButton.className = "divButton";

        let btnDodaj = kreirajButton("Dodati predavača","btnDodaj");
        btnDodaj.onclick = (ev) =>  this.dodajPredavaca();
        divButton.appendChild(btnDodaj);
        host.appendChild(divButton);

    }
    
    dodajPredavaca(){
        let skola = document.querySelector(".selectSkola").value;
        let ime = document.querySelector(".tbxIme").value;
        let prezime = document.querySelector(".tbxPrezime").value;
        let jmbg = document.querySelector(".tbxJMBG").value;
        let preuzmi = document.querySelector("input[type='radio']:checked");
        let sertifikat = preuzmi.value;

        if(!ime){
            alert("Niste uneli ime predavača!");
            return;
        }
        if(ime.length > 30){
            alert("Nevalidan unos za ime predavača!");
            return;
        }
        if(!prezime){
            alert("Niste uneli prezime predavača!");
            return;
        }
        if(prezime.length > 30){
            alert("Nevalidan unos za prezime predavača!");
            return;
        }
        if(!jmbg){
            alert("Niste uneli JMBG predavača!");
            return;
        }
        if(jmbg.length != 13){
            alert("Nevalidan unos za jmbg predavača!");
            return;
        }
        if(!sertifikat){
            alert("Niste označili sertifikat predavača!");
            return;
        }

        console.log(sertifikat);
        document.querySelector(".tbxIme").value = "";
        document.querySelector(".tbxPrezime").value = "";
        document.querySelector(".tbxJMBG").value = "";
        document.querySelector("input[type='radio']:checked").checked = false;
        
        fetch("https://localhost:5001/Predavac/DodatiPredavaca/"+ime+"/"+prezime+"/"+jmbg+"/"+sertifikat+"/"+skola,{
            method:"POST"
        }).then(s => {
            if(!s.ok){
                alert("Nije moguće dodati predavača!");
            }
            else{
                this.prikazatiPredavace();
            }
        })
    }

    napraviOpcije(host){

        //Dugme prikazi
        let divButtonPrikazati = kreirajDiv("divButtonPrikazati");
        let btnPrikazati = kreirajButton("Prikazati predavače bez kursa","btnPrikazati");
        btnPrikazati.onclick = (ev) => this.prikazatiPredavace();
        divButtonPrikazati.appendChild(btnPrikazati);
        host.appendChild(divButtonPrikazati);

        //Select kursa
        let divSelectKursa = kreirajDiv("divSelectKursa");
        let lblSelectKursa = kreirajLabelu("Kurs:","lblSelectKursa");
        divSelectKursa.appendChild(lblSelectKursa);
        host.appendChild(divSelectKursa);

        let seKurs = document.createElement("select");
        seKurs.className = "seKurs";
        divSelectKursa.appendChild(seKurs);

        this.preuzmiKurseve();

        //Dugme prikazi predavace za kurs
        let divButtonPrikaz = kreirajDiv("divButtonPrikaz");
        let btnPrikazi = kreirajButton("Prikazati predavače","btnPrikazi");
        btnPrikazi.onclick = (ev) => this.preuzmiPredavaceZaKurs();
        divButtonPrikaz.appendChild(btnPrikazi);
        host.appendChild(divButtonPrikaz);

        //Dugme dodajPredavacaKursu
        let divButtonDodati = kreirajDiv("divButtonDodati");
        let btnDodati = kreirajButton("Dodati predavača na kurs","btnDodati");
        btnDodati.onclick = (ev) => this.dodatiPredavacaKursu();
        divButtonDodati.appendChild(btnDodati);
        host.appendChild(divButtonDodati);

        //Dugme izmeni
        let divButtonIzmeni = kreirajDiv("divButtonIzmeni");
        let btnIzmeni = kreirajButton("Dodaj sertifikat","btnIzmeni");
        /*btnIzmeni.onclick = (ev) => this.ukloniPredavaca();*/
        /*btnIzmeni.onclick = (ev) => this.izmeniKurs();*/
        btnIzmeni.onclick = (ev) => this.dodajSertifikat();
        divButtonIzmeni.appendChild(btnIzmeni);
        host.appendChild(divButtonIzmeni);

         //Dugme obrisati
        let divButtonObrisi = kreirajDiv("divButtonObrisi");
        let btnObrisi = kreirajButton("Ukloni predavača","btnObrisi");
        /*btnObrisi.onclick = (ev) => this.obrisatiPredavaca();*/
        btnObrisi.onclick = (ev) => this.ukloni();
        divButtonObrisi.appendChild(btnObrisi);
        host.appendChild(divButtonObrisi);
 
    }

    prikazatiPredavace(){
        let skola = document.querySelector(".selectSkola").value;

        fetch("https://localhost:5001/Predavac/PreuzmiPredavaceBezKursaZaSkolu/"+skola).then(s => {
            if(!s.ok){
                alert("Nije moguće pribaviti predavače!");
            }
            else{
                console.log(skola);
                this.listaPredavaca.length=0;
                s.json().then(predavaci => {
                    predavaci.forEach(p => {
                        let predavac = new Predavac(p.id,p.ime,p.prezime,p.jmbg,p.sertifikat);
                        this.kurs.Naziv = "/";
                        this.listaPredavaca.push(predavac);
                    })
                    this.azurirajPodatke_NapraviTeloTabele();
                })
            }
        })
    }

    preuzmiKurseve(){
        let seSkola = document.querySelector(".selectSkola").value;

        fetch("https://localhost:5001/Sadrzi/PreuzmiKurseveZaSkolu/" + seSkola)
            .then(s => {
                this.listaKurseva.length=0;
                s.json().then(kursevi => {
                    kursevi.forEach(k => {
                        let kurs = new Kurs(k.id, k.naziv, k.cena, k.broj);
                        this.listaKurseva.push(kurs);
                    });
                    //console.log(this.listaKurseva);
                    let se = document.querySelector(".seKurs")
                    let op;
                    this.listaKurseva.forEach(el => {
                        op = document.createElement("option");
                        op.innerHTML = el.Naziv;
                        op.value = el.ID;
                        se.appendChild(op);
                    });
                })
        });
    }

    dodatiPredavacaKursu(){
        let tr = document.querySelector(".selektovan");
        let predavac = tr.id;

        let kurs = document.querySelector(".seKurs").value;
        
        if(!predavac){
            alert("Niste selektovali predavača!");
            return;
        }

        fetch("https://localhost:5001/Predaje/DodatiPredavacaKursu/"+predavac+"/"+kurs,{
            method: "POST"
        }).then(s => {
            if(!s.ok){
                alert("Nije moguće dodati predavača na izabrani kurs!");
            }
            else{
                this.preuzmiPredavaceZaKurs();
            }
        })
    }

    preuzmiPredavaceZaKurs(){
        let se = document.querySelector(".seKurs");
        let kurs = se.value;

        let skola = document.querySelector(".selectSkola").value;

        this.listaPredavaca.length=0;
        fetch("https://localhost:5001/Predaje/PreuzmiPredavaceZaKurs/"+kurs+"/"+skola).then(s => {
            if(!s.ok){
                alert("Nije moguće preuzeti predavače za izabrani kurs!");
            }
            else{
                s.json().then(pred => {
                    if(pred.length === 0){
                        updateTable("tabelaBody");
                    }
                    else{
                            pred.forEach(p => {
                        
                                let predavac = new Predavac(p.id,p.ime,p.prezime,p.jmbg,p.sertifikat);
                                this.listaPredavaca.push(predavac);
                                this.kurs.Naziv = p.naziv;
                                this.azurirajPodatke_NapraviTeloTabele();
                            })
                        }    
                });
            }
        })
    }

    ukloni(){
        if(confirm("Da li želiš da ukloniš predavača!")){
            let tr = document.querySelector(".selektovan");
            let predavac = tr.id;

            if(!predavac){
                alert("Niste selektovali predavača!");
                return;
            }

            let kurs = document.querySelector(".seKurs").value;

            fetch("https://localhost:5001/Predaje/UkloniPredavacaSaKursa/"+predavac+"/"+kurs,{
                method: "DELETE"
            }).then(s => {
                if(!s.ok){
                    alert("Nije moguće ukloniti predavača sa kursa!");
                }
                else{
                    //this.preuzmiPredavaceZaKurs(); 
                    fetch("https://localhost:5001/Predavac/IzbrisiPredavaca/"+predavac,{
                        method: "DELETE"
                    }).then(s => {
                        if(!s.ok){
                            alert("Nije moguće izbrisati predavača!");
                        }
                        else{
                            this.preuzmiPredavaceZaKurs();
                        }
                    })
                }
            })


        }
    }

    izmeniKurs(){
        let tr = document.querySelector(".selektovan");
        let predavac = tr.id;

        if(!predavac){
            alert("Niste selektovali predavača!");
            return;
        }

        let kurs = document.querySelector(".seKurs").value;

        fetch("https://localhost:5001/Predaje/ZameniKursPredavacu/"+predavac+"/"+kurs,{
            method: "PUT"
        }).then(s => {
            if(!s.ok){
                alert("Nije moguće zameniti kurs predavaču!");
                return;
            }
            else{
                this.preuzmiPredavaceZaKurs();
            }
        })
    }

    dodajSertifikat(){
        let tr = document.querySelector(".selektovan");
        let predavac = tr.id;

        if(!predavac){
            alert("Niste selektovali predavača!");
            return;
        }

        fetch("https://localhost:5001/Predavac/DodajSertifikat/"+predavac,{
            method: "PUT"
        }).then( s => {
            if(!s.ok){
                alert("Nije moguće dodati sertifikat predavaču!");
                return;
            }
            else{
                this.prikazatiPredavace();
            }
        })
    }
}