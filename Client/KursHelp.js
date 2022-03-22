import { Kurs } from "./Kurs.js";
import { Ocena } from "./Ocena.js";
import { kreirajButton, kreirajLabelu,kreirajBox,kreirajDiv, obrisiDecu, updateTable } from "./Pomoc.js";
import { Predavac } from "./Predavac.js";
import { Ucenik } from "./Ucenik.js";

export class KursHelp{

    constructor(){
        this.listaKurseva = [];
        this.predavac = new Predavac(-1,"","","", false);
        this.listaPredavaca = [];
        this.listaUcenika = [];
        this.kurs = new Kurs(-1,"","","");
        this.listaOcena = [];
    }

    crtaj(host){

        let divPodaci = document.createElement("div");
        divPodaci.className = "divPodaci";
        host.appendChild(divPodaci);
        this.napraviPodatke(divPodaci);

        this.preuzmiKurseve();

        let divOpcije = kreirajDiv("divOpcije");
        host.appendChild(divOpcije);
        this.napraviOpcije(divOpcije);

        this.preuzmiSveKurseve();

        let divTabela = kreirajDiv("divTabela")
        host.appendChild(divTabela);
        
        this.napraviStatistiku();

    }

    napraviPodatke(host){

        let divKursevi = kreirajDiv("divKursevi")

        let divZaLabeluKursa = kreirajDiv("divZaLabeluKursaKursevi");
        let lblKursevi = kreirajLabelu("Kurs:","lblKurseviKurs");
        divZaLabeluKursa.appendChild(lblKursevi);
        divKursevi.appendChild(divZaLabeluKursa);

        let divZaSelectKursa = kreirajDiv("divZaSelectKursa")

        let seKurs = document.createElement("select");
        seKurs.className = "selectKursa";
        seKurs.onchange = (ev) => this.azurirajKurs();
        divZaSelectKursa.appendChild(seKurs);
        divKursevi.appendChild(divZaSelectKursa);

        host.appendChild(divKursevi);

        let divCenaKursa = kreirajDiv("divCenaKursa")
        let lblCena = kreirajLabelu("Cena(€):","lblCena");
        divCenaKursa.appendChild(lblCena);
        host.appendChild(divCenaKursa);

        let divVreme = kreirajDiv("divVremeKursa")
        let lblVreme = kreirajLabelu("Vreme trajanja (meseci):","lblVremeKursa");
        divVreme.appendChild(lblVreme);
        host.appendChild(divVreme);

        let divTrenutniBrojUcenika = kreirajDiv("divTrenutniBrojUcenika");
        let lblTrenutniBrojUcenika = kreirajLabelu("Slobodna mesta:","lblTrenutniBrojUcenika");
        divTrenutniBrojUcenika.appendChild(lblTrenutniBrojUcenika);
        host.appendChild(divTrenutniBrojUcenika);

        let divIzbor = kreirajDiv("divIzbor");
        let lblIzbor = kreirajLabelu("Izaberi prikaz","lblIzbor");
        divIzbor.appendChild(lblIzbor);
        host.appendChild(divIzbor);

        let divRadioButton = kreirajDiv("divRB");
        let niz = ["Učenici","Predavači"];
        let rbDiv;
        let rb;
        let lbl;
        niz.forEach((el,index) => {
            rbDiv = document.createElement("div");
            rb = document.createElement("input");
            rb.setAttribute("name","rb");
            rb.type = "radio";
            rb.className = "rbIzbor";
            rb.value = index;
            rb.onclick = (ev) => this.izaberi();
            rbDiv.appendChild(rb);
            lbl = document.createElement("label");
            lbl.innerHTML = el;
            rbDiv.appendChild(lbl);
            divRadioButton.appendChild(rbDiv);
        });
        host.appendChild(divRadioButton);
    }

    preuzmiKurseve(){
        let seSkola = document.querySelector(".selectSkola").value;

        fetch("https://localhost:5001/Sadrzi/PreuzmiKurseveZaSkolu/" + seSkola)
            .then(s => {
                s.json().then(kursevi => {
                    this.listaKurseva.length = 0;
                    kursevi.forEach(k => {
                        let kurs = new Kurs(k.id, k.naziv, k.cena, k.vremeTrajanja, k.brojUcenika);
                        this.listaKurseva.push(kurs);
                    });
                    let se = document.querySelector(".selectKursa");
                    obrisiDecu(se);
                    let op;
                    this.listaKurseva.forEach(el => {
                        op = document.createElement("option");
                        op.innerHTML = el.Naziv;
                        op.value = el.ID;
                        se.appendChild(op);
                    });
                    this.azurirajKurs();
                })
        });
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
        tbody.className="tbody";
        tabela.appendChild(tbody);

        let th;
        var nizZaglavlja=["Ime", "Prezime", "Ime roditelja","Članska knjižica","Ocena"];
        nizZaglavlja.forEach(el => {
            th = document.createElement("th");
            th.innerHTML = el;
            tr.appendChild(th);
        })
    }

    napraviTabeluPredavac(host){
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

        var teloTabele = document.querySelector(".tbody");
        var roditeljTabela = teloTabele.parentNode;
        roditeljTabela.removeChild(teloTabele);

        teloTabele = document.createElement("tbody");
        teloTabele.className = "tbody";
        roditeljTabela.appendChild(teloTabele);


        this.listaUcenika.forEach((el,index) => {

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
            tr.appendChild(ime);

            var prezime = document.createElement("td");
            prezime.innerHTML = el.prezime;
            tr.appendChild(prezime);

            var imeRod = document.createElement("td");
            imeRod.innerHTML = el.imeRoditelja;
            tr.appendChild(imeRod);

            var clanskaKnjiz = document.createElement("td");
            clanskaKnjiz.innerHTML = el.clanskaKnjizica;
            tr.appendChild(clanskaKnjiz);

            var ocena = document.createElement("td");
            if(this.listaOcena[index].vrednost == 0){
                ocena.innerHTML = "/";
            }
            else{
                ocena.innerHTML = this.listaOcena[index].vrednost;
            }
            //ocena.innerHTML = this.listaOcena[index].vrednost;
            ocena.className = "ocena";
            tr.appendChild(ocena);
        });
        
    }

    azurirajPodatke_NapraviTeloTabelePredavac(){
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
            tr.appendChild(ime);

            var prezime = document.createElement("td");
            prezime.innerHTML = el.prezime;
            tr.appendChild(prezime);

            var jmbg = document.createElement("td");
            jmbg.innerHTML = el.jmbg;
            tr.appendChild(jmbg);

            var sertifikat = document.createElement("td");
            sertifikat.innerHTML = el.sertifikat;
            tr.appendChild(sertifikat);

            var naziv = document.createElement("td");
            naziv.innerHTML = this.kurs.Naziv;
            tr.appendChild(naziv);
        });
    }

    preuzmiUcenike(){
        let kurs = document.querySelector(".selectKursa").value;
        let skola = document.querySelector(".selectSkola").value;

        fetch("https://localhost:5001/Slusa/PreuzmiUcenikeZaKurs/"+kurs+"/"+skola).then(s => {
            if(!s.ok){
                alert("Nije moguće učitati učenike!");
            }
            else{
                this.listaUcenika.length = 0;
                this.listaOcena.length = 0;
                s.json().then(ucenici => {
                    if(ucenici.length===0){
                        let tabela = document.querySelector(".divTabela");
                        obrisiDecu(tabela);
                        this.napraviTabelu(tabela);
                    }
                    else{
                        ucenici.forEach(el => {
                                let ucenik = new Ucenik(el.id, el.ime, el.prezime, el.imeRoditelja, el.clanskaKnjizica);
                                this.listaUcenika.push(ucenik);
                                let vrednostOcena = new Ocena(el.ocena);
                                this.listaOcena.push(vrednostOcena);
                                let tabela = document.querySelector(".divTabela");
                                obrisiDecu(tabela);
                                this.napraviTabelu(tabela);
                                this.azurirajPodatke_NapraviTeloTabele();
                        })
                    }
                })
                
            }
        })
    }

    azurirajPredavaca(){
        let ime = document.querySelector(".lblIme");
        ime.innerHTML = "Ime: "+this.predavac.ime;

        let prezime = document.querySelector(".lblPrezime");
        prezime.innerHTML = "Prezime: " +this.predavac.prezime;

        let jmbg = document.querySelector(".lblJMBG");
        jmbg.innerHTML = "JMBG: "+this.predavac.jmbg;

        let sertifikat = document.querySelector(".lblSert");
        sertifikat.innerHTML = "Sertifikat: " + this.predavac.sertifikat;
    }

    preuzmiPredavaceZaKurs(){
        let kurs = document.querySelector(".selectKursa").value;
        
        let skola = document.querySelector(".selectSkola").value;
        

        fetch("https://localhost:5001/Predaje/PreuzmiPredavaceZaKurs/"+kurs+"/"+skola).then(s => {
            if(!s.ok){
                alert("Nije moguće učitati predavača za izabrani kurs!");
            }
            else{
                this.listaPredavaca.length=0;
                s.json().then(predavaci => {
                    if(predavaci.length===0){
                        /*let tabela = document.querySelector(".divTabela");
                        obrisiDecu(tabela);
                        this.napraviTabeluPredavac(tabela);*/
                        updateTable("tabelaBody");
                    }
                    else{
                        predavaci.forEach(p => {
                            
                            let predavac = new Predavac(p.id,p.ime,p.prezime,p.jmbg,p.sertifikat);
                            this.listaPredavaca.push(predavac);
                            this.kurs.Naziv = p.naziv;
                            let tabela = document.querySelector(".divTabela");
                            obrisiDecu(tabela);
                            this.napraviTabeluPredavac(tabela);
                            this.azurirajPodatke_NapraviTeloTabelePredavac();
                        })
                    }
                })
            }
        })
    }

    azurirajKurs(){
        
        let seKurs = document.querySelector(".selectKursa").value;

        fetch("https://localhost:5001/Kurs/PreuzmiKurs/"+seKurs).then(s => {
            if(!s.ok){
                alert("Nije moguće preuzite podatke o tom kursu!");
            }
            else{
                s.json().then(el => {
                    console.log(el);
                    let cena = document.querySelector(".lblCena");
                    cena.innerHTML = "Cena(€):"+ el.cena;
                    
                    let vreme = document.querySelector(".lblVremeKursa");
                    vreme.innerHTML = "Vreme trajanja(meseci):" + el.vremeTrajanja;

                    let mesto = document.querySelector(".lblTrenutniBrojUcenika");
                    mesto.innerHTML = "Slobodna mesta na kursu:" + el.brojUcenika;
                })
            }
        })
        this.izaberi();
    }

    azurirajKurseve(){
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
                    let se = document.querySelector(".selectKursa");
                    obrisiDecu(se);
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

    napraviOpcije(host){
        let divDodaj = kreirajDiv("divDodaj");
        host.appendChild(divDodaj);
        
        //Div broj Ucenika
        let divBrojUcenika = kreirajDiv("divBrojUcenika");
        let lblBrojUcenika = kreirajLabelu("Broj učenika","lblBrojUcenika");
        let tbxBrojUcenika = kreirajBox("number","tbxBrojUcenika")
        divBrojUcenika.appendChild(lblBrojUcenika);
        divBrojUcenika.appendChild(tbxBrojUcenika);
        divDodaj.appendChild(divBrojUcenika);


        //Select predavaca
        let divSelectKurs = kreirajDiv("divSelectKurs");
        let lblSelect = kreirajLabelu("Kurs:","lblSelect");
        divSelectKurs.appendChild(lblSelect);

        let seKursNov = document.createElement("select");
        seKursNov.className = "selectKursNov";
        divSelectKurs.appendChild(seKursNov);
        divDodaj.appendChild(divSelectKurs);

        //Dugme Dodati kurs skoli
        let divButtonDodatiKurs = kreirajDiv("divButtonDodatiKurs");
        let btnDodatiKurs = kreirajButton("Dodati kurs školi","btnDodatiKurs");
        btnDodatiKurs.onclick = (ev) => this.dodatiKursSkoli();
        divButtonDodatiKurs.appendChild(btnDodatiKurs);
        divDodaj.appendChild(divButtonDodatiKurs);

        //Ocena
        let divOcena = kreirajDiv("divOcena");
        let lblOcena = kreirajLabelu("Ocena","lblOcena");
        divOcena.appendChild(lblOcena);
        let tbxOcena = kreirajBox("number","tbxOcena");
        divOcena.appendChild(tbxOcena);
        divDodaj.appendChild(divOcena);

        //Dugme dodaj ocenu
        let divButtonOcena = kreirajDiv("divButtonOcena");
        let btnOcena = kreirajButton("Dodaj ocenu","btnOcena");
        btnOcena.onclick = (ev) => this.dodajOcenu();
        divButtonOcena.appendChild(btnOcena);
        divDodaj.appendChild(divButtonOcena); 

        //Dugme statistika
        let divStatistika = kreirajDiv("divStatistika");
        let btnStatistika = kreirajButton("Statistika","btnStatistika");
        btnStatistika.onclick = (ev) => this.napraviStatistiku();
        divStatistika.appendChild(btnStatistika);
        divDodaj.appendChild(divStatistika);

    }

    preuzmiSveKurseve(){
        this.listaKurseva.length=0;
        fetch("https://localhost:5001/Kurs/PreuzmiKurseve")
            .then(s => {
                s.json().then(kursevi => {
                    this.listaKurseva.length=0;
                    kursevi.forEach(k => {
                        let kurs = new Kurs(k.id, k.naziv,k.cena, k.vremeTrajanja, k.brUcenika);
                        this.listaKurseva.push(kurs);
                    });
                    console.log(this.listaKurseva);
                    let se = document.querySelector(".selectKursNov");
                    obrisiDecu(se);
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

    dodatiKursSkoli(){
        let skola = document.querySelector(".selectSkola").value;
        let kurs = document.querySelector(".selectKursNov").value;
        let brojUcenika = document.querySelector(".tbxBrojUcenika").value;
        if(brojUcenika < 5 || brojUcenika > 50){
            alert("Nevalidan unos za broj učenika!");
            return;
        }

        document.querySelector(".tbxBrojUcenika").value = "";


        fetch("https://localhost:5001/Sadrzi/DodatiKursSkoli/" + skola + "/" + kurs + "/" + brojUcenika,{
            method: "POST"
        }).then(s => {
            if(!s.ok){
                alert("Kurs već postoji u školi!");
            }
            else{
                this.azurirajKurseve();
            }
        })
    }

    dodajOcenu(){
        
        let tr = document.querySelector(".selektovan");
        let ucenik = tr.id;

        let kurs = document.querySelector(".selectKursa").value;

        let ocena = document.querySelector(".tbxOcena").value;

        if(!ucenik){
            alert("Morate selektovati učenika!");
            return;
        }
        if(!ocena){
            alert("Morate uneti ocenu učeniku!");
            return;
        }
        if(ocena <= 0 || ocena > 5){
            alert("Nevalidan unos za ocenu!");
            return;
        }
        document.querySelector(".tbxOcena").value = "";
        fetch("https://localhost:5001/Slusa/UpisiOcenuUceniku/"+ucenik+"/"+kurs+"/"+ocena,{
            method: "PUT"
        }).then(s => {
            if(!s.ok){
                alert("Nije moguće upisati ocenu učeniku!");
            }
            else{
                this.preuzmiUcenike();
            }
        })
    }

    izaberi(){
        let preuzmi = document.querySelector("input[type='radio']:checked");
        let broj = preuzmi.value;
        
        if( broj === null || broj.length != 1 ){
            alert("Morate izabrati deo za prikaz!");
            return;
        }
        if(broj == 0){
            let tabela = document.querySelector(".divTabela");
            obrisiDecu(tabela);
            this.preuzmiUcenike();
        }
        if(broj == 1)
        {
            let tabela = document.querySelector(".divTabela");
            obrisiDecu(tabela);
            this.preuzmiPredavaceZaKurs()
        }
    }

    napraviStatistiku(){
        let tabela = document.querySelector(".divTabela");
        obrisiDecu(tabela);
        let seSkola = document.querySelector(".selectSkola").value;
        fetch("https://localhost:5001/Sadrzi/PreuzmiKurseveZaSkolu/" + seSkola)
            .then(s => {
                s.json().then(kursevi => {
                    this.listaKurseva.length = 0;
                    kursevi.forEach(k => {
                        let kurs = new Kurs(k.id, k.naziv, k.cena, k.vremeTrajanja, k.brojUcenika);
                        this.listaKurseva.push(kurs);
                    });
                    let divGlavni = kreirajDiv("divGlavni");
                    tabela.appendChild(divGlavni);
                    this.listaKurseva.forEach(i => {
                        let div_kurs = kreirajDiv("div_kurs");
                        divGlavni.appendChild(div_kurs);

                        let divText = kreirajDiv("divText");
                        div_kurs.appendChild(divText);

                        let divGrafik = kreirajDiv("divGrafik");
                        div_kurs.appendChild(divGrafik);
                        
                        let counter = 0;
                        let divCounter;
                        fetch("https://localhost:5001/Slusa/PreuzmiUcenikeZaKurs/"+i.ID+"/"+seSkola).then(s => {
                            if(!s.ok){
                                alert("Nije moguće učitati učenike!");
                            }
                            else{
                                this.listaUcenika.length = 0;
                                s.json().then(ucenici => {
                                    ucenici.forEach(el => {
                                        let ucenik = new Ucenik(el.id, el.ime, el.prezime, el.imeRoditelja, el.clanskaKnjizica);
                                        this.listaUcenika.push(ucenik);
                                        divCounter = kreirajDiv("divCounter");
                                        counter++;
                                        divGrafik.appendChild(divCounter);
                                    })
                                    console.log(counter);
                                    let txtNaziv = document.createTextNode(i.Naziv);
                                    let br = document.createElement("br");
                                    let txtBroj = document.createTextNode("Broj učenika:"+counter);
                                    divText.appendChild(txtNaziv);
                                    divText.appendChild(br);
                                    divText.appendChild(txtBroj);
                                })
                            }
                        });
                    })
                })
        });
    }

}
