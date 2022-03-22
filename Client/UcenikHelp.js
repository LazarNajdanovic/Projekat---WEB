import { Ucenik } from "./Ucenik.js";
import { kreirajButton, kreirajLabelu,kreirajBox, kreirajDiv, obrisiDecu, updateTable } from "./Pomoc.js";
import { Kurs } from "./Kurs.js";
import { Ocena } from "./Ocena.js";


export class UcenikHelp{

    constructor() {
        this.listaUcenika = [];
        this.listaKurseva = []; 
        this.listaOcena = [];
    }

    crtaj(host){

        this.preuzmiUcenikeBezKursa();

        let divDodaj = document.createElement("div");
        divDodaj.className = "divDodajUcenik";
        host.appendChild(divDodaj);

        this.napraviDodaj(divDodaj);

        let divOpcije = document.createElement("div");
        divOpcije.className = "divOpcijeUcenik";
        host.appendChild(divOpcije);

        this.napraviOpcije(divOpcije);

        this.preuzmiKurseveZaSkolu();

        let divTabela = document.createElement("div");
        divTabela.className = "divTabelaUcenik";
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
        var nizZaglavlja=["Ime", "Prezime", "Ime roditelja","Članska knjižica"];
        nizZaglavlja.forEach(el => {
            th = document.createElement("th");
            th.innerHTML = el;
            tr.appendChild(th);
        })
    }

    preuzmiUcenikeBezKursa(){
        this.listaUcenika.length = 0;
        this.listaOcena.length = 0;
        var skola = document.querySelector(".selectSkola").value;

        fetch("https://localhost:5001/Slusa/PreuzmiUcenikeBezKursaZaSkolu/"+skola).then(s =>{
            if(s.ok){
                //var tabela = this.updateTable();

                s.json().then(ucenici => {
                    if(ucenici.length === 0){
                        let tabela = document.querySelector(".divTabelaUcenik");
                        obrisiDecu(tabela);
                        this.napraviTabelu(tabela);
                    }
                    else{
                        ucenici.forEach(el => {
                            let ucenik = new Ucenik(el.id, el.ime, el.prezime, el.imeRoditelja, el.clanskaKnjizica);
                            this.listaUcenika.push(ucenik);
                            let ocena = new Ocena(el.ocena);
                            console.log(el.ocena);
                            this.listaOcena.push(ocena);
                            let tabela = document.querySelector(".divTabelaUcenik");
                            obrisiDecu(tabela);
                            this.napraviTabelu(tabela);
                            this.azurirajPodatke_NapraviTeloTabele();
                        })
                    }
                })
            }
        })
    }
    
    azurirajPodatke_NapraviTeloTabele(){

        var teloTabele = document.querySelector(".tabelaBody");
        var roditeljTabela = teloTabele.parentNode;
        roditeljTabela.removeChild(teloTabele);

        teloTabele = document.createElement("tbody");
        teloTabele.className = "tabelaBody";
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
            ime.className = "ime";
            tr.appendChild(ime);

            var prezime = document.createElement("td");
            prezime.innerHTML = el.prezime;
            prezime.className = "prezime";
            tr.appendChild(prezime);

            var imeRod = document.createElement("td");
            imeRod.innerHTML = el.imeRoditelja;
            imeRod.className = "imeRod";
            tr.appendChild(imeRod);

            var clanskaKnjiz = document.createElement("td");
            clanskaKnjiz.innerHTML = el.clanskaKnjizica;
            clanskaKnjiz.className = "clanskaKnjiz";
            tr.appendChild(clanskaKnjiz);

        });
        
    }

    napraviDodaj(host){

        let divNaslov = document.createElement("div");
        divNaslov.className = "divNaslov";
        
        let lblNaslov = kreirajLabelu("Podaci o novom učeniku","lblNaslov");
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

        //IME RODITELJA
        let divImeRoditelja = document.createElement("div");
        divImeRoditelja.className = "divImeRoditelja";

        let lblImeRoditelja = kreirajLabelu("Ime roditelja:","lblImeRoditelja");
        divImeRoditelja.appendChild(lblImeRoditelja);
        let tbxImeRoditelja = kreirajBox("text","tbxImeRoditelja");
        divImeRoditelja.appendChild(tbxImeRoditelja);
        host.appendChild(divImeRoditelja);

        //Clanska knjizica
        let divClanskaKnjizica = document.createElement("div");
        divClanskaKnjizica.className = "divClanskaKnjizica";

        let lblClanskaKnjizica = kreirajLabelu("Članska knjizica:","lblClanskaKnjizica");
        divClanskaKnjizica.appendChild(lblClanskaKnjizica);
        let tbxClanskaKnjizica = kreirajBox("number","tbxClanskaKnjizica");
        divClanskaKnjizica.appendChild(tbxClanskaKnjizica);
        host.appendChild(divClanskaKnjizica);

        //DUGME - mozda klasa da bude drugacija, na kraju cemo da vidimo
        let divButton = document.createElement("div");
        divButton.className = "divButton";

        let btnDodaj = kreirajButton("Dodati učenika","btnDodaj");
        btnDodaj.onclick = (ev) =>  this.dodajUcenika();
        divButton.appendChild(btnDodaj);
        host.appendChild(divButton);
    }

    dodajUcenika(){

        let ime = document.querySelector(".tbxIme").value;
        let prezime = document.querySelector(".tbxPrezime").value;
        let imeRoditelja = document.querySelector(".tbxImeRoditelja").value;
        let clanskaKnjizica = document.querySelector(".tbxClanskaKnjizica").value;
        let skola = document.querySelector(".selectSkola").value;
        
        if(!ime){
            alert("Morate uneti ime učenika!");
            return;
        }
        if(ime.length > 30){
            alert("Nevalidan unos za ime učenika!");
            return;
        }
        if(!prezime){
            alert("Morate uneti prezime učenika!");
            return;
        }
        if(prezime.length > 30){
            alert("Nevalidan unos za prezime učenika!");
            return;
        }
        if(!imeRoditelja){
            alert("Morate uneti ime roditelja učenika!");
            return;
        }
        if(imeRoditelja.length > 30){
            alert("Nevalidan unos za ime roditelja učenika!");
            return;
        }
        if(!clanskaKnjizica){
            alert("Morate uneti člansku knjižicu učenika!");
            return;
        }
        if(clanskaKnjizica < 1000 || clanskaKnjizica > 5000){
            alert("Nevalidan unos za člansku knjižicu učenika!");
            return;
        }

        document.querySelector(".tbxIme").value = "";
        document.querySelector(".tbxPrezime").value = "";
        document.querySelector(".tbxImeRoditelja").value = "";
        document.querySelector(".tbxClanskaKnjizica").value = "";
        fetch("https://localhost:5001/Ucenik/DodatiUcenika/"+ ime + "/" + prezime + "/" + imeRoditelja + "/" + clanskaKnjizica + "/" + skola, {
            method: "POST"  
        }).then( s => {
            if(!s.ok){
                alert("Nevalidan unos podataka za novog učenika!");
            }
            else{
                this.preuzmiUcenikeBezKursa();
            }
        })
    }

    napraviOpcije(host){

        //Deo za pretragu po clanskoj knjizici
        let divClanskaKnjizica = kreirajDiv("divClanskaKnjizicaUcenik");

        let lblClanskaKnjizica = kreirajLabelu("Članska knjizica:","lblClanskaKnjizicaUcenik");
        divClanskaKnjizica.appendChild(lblClanskaKnjizica);
        let tbxClanskaKnjizica = kreirajBox("number","tbxClanskaKnjizicaUcenik");
        divClanskaKnjizica.appendChild(tbxClanskaKnjizica);
        host.appendChild(divClanskaKnjizica);

        // Dugme pretrazi
        let divButtonPretrazi = kreirajDiv("divButtonPretraziUcenika")
        let btnPretrazi = kreirajButton("Pretražiti učenika","btnPretrazi");
        btnPretrazi.onclick = (ev) =>  this.pretraziUcenika();
        divButtonPretrazi.appendChild(btnPretrazi);
        host.appendChild(divButtonPretrazi);

        // Dugme prikazati
        let divButtonPrikazi = document.createElement("div");
        divButtonPrikazi.className = "divButtonPrikaziUcenike";
        let btnPrikaz = kreirajButton("Prikazati učenike bez upisanog kursa","btnPrikazUcenik");
        btnPrikaz.onclick = (ev) => this.preuzmiUcenikeBezKursa();
        divButtonPrikazi.appendChild(btnPrikaz);
        host.appendChild(divButtonPrikazi);

        //Deo za select kursa
        let divKursevi = kreirajDiv("divKursUcenik");

        let divZaLabeluKursa = document.createElement("div");
        divZaLabeluKursa.className = "divZaLabeluKursa" 
        let lblKursevi = kreirajLabelu("Kurs:","lblKurseviKursevi");
        divZaLabeluKursa.appendChild(lblKursevi);
        divKursevi.appendChild(divZaLabeluKursa);

        host.appendChild(divKursevi);

        //Dugme upisati
        let divButtonUpisati = kreirajDiv("divButtonUpisatiUcenik");
        
        let btnUpisati = kreirajButton("Upisati učenika","btnUpisatiUcenika");
        btnUpisati.onclick = (ev) => this.upisatiUcenikaNaKurs();
        divButtonUpisati.appendChild(btnUpisati);
        
        let btnPrikaziUcenike = kreirajButton("Prikazati učenike za kurs","btnPrikaziUcenike");
        btnPrikaziUcenike.onclick = (ev) => this.preuzmiUcenikZaKurs();
        divButtonUpisati.appendChild(btnPrikaziUcenike);
        host.appendChild(divButtonUpisati);

        //Dugme obrisati
        let divDvaDugmeta = kreirajDiv("divDvaDugmetaUcenik")

        let divButtonObrisi = kreirajDiv("divButtonObrisiUcenika")
        let btnObrisi = kreirajButton("Ukloni učenika","btnObrisiUcenika");
        btnObrisi.onclick = (ev) => this.obrisatiUcenika();
        divButtonObrisi.appendChild(btnObrisi);
        divDvaDugmeta.appendChild(divButtonObrisi);

        let divButtonIspisi = kreirajDiv("divButtonIspisi")
        let btnIspisi = kreirajButton("Ispiši učenika","btnIspisi");
        btnIspisi.onclick = (ev) => this.ispisiUcenikaSaKursa();
        divButtonIspisi.appendChild(btnIspisi);
        divDvaDugmeta.appendChild(divButtonIspisi);
        host.appendChild(divDvaDugmeta);

    }

    pretraziUcenika(){
        let clanskaKnjizica = document.querySelector(".tbxClanskaKnjizicaUcenik").value;
        if(!clanskaKnjizica){
            alert("Morate uneti broj članske knjižice!");
            return;
        }
        if(clanskaKnjizica < 1000 || clanskaKnjizica > 5000){
            alert("Nevalidan unos za broj članske knjižice!");
            return;
        }
        document.querySelector(".tbxClanskaKnjizicaUcenik").value = "";

        fetch("https://localhost:5001/Ucenik/PreuzmiUcenika/" + clanskaKnjizica)
            .then(s => {
                if(!s.ok){
                    alert("Ne postoji takav učenik sa članskom knjižicom "+clanskaKnjizica+"!");
                    return;
                }
                else{
                    s.json().then( el => {
                        this.listaUcenika.length=0;
                        let ucenik = new Ucenik(el.id,el.ime,el.prezime,el.imeRoditelja,el.clanskaKnjizica);
                        this.listaUcenika.push(ucenik);
                        let tabela = document.querySelector(".divTabelaUcenik");
                        obrisiDecu(tabela);
                        this.napraviTabelu(tabela);
                        this.azurirajPodatke_NapraviTeloTabele();

                    })
                }
            })

    }

    upisatiUcenikaNaKurs(){
        let tr = document.querySelector(".selektovan");
        let ucenik = tr.id;

        if(!ucenik){
            alert("Niste selektovali učenika koga želite upisati na kurs!");
            return;
        }
        
        let kurs = document.querySelector(".selectKurs").value;

        fetch("https://localhost:5001/Slusa/UpisiUcenikaNaKurs/"+ucenik+"/"+kurs,{
            method: "POST"
        }).then(s => {
            if(!s.ok){
                alert("Nije moguće obaviti upis učenika na kurs!");
            }
            else{
                this.preuzmiUcenikZaKurs();
            }
        })
        
    }
    
    preuzmiUcenikZaKurs(){
        let kurs = document.querySelector(".selectKurs").value;
        let skola = document.querySelector(".selectSkola").value;

        fetch("https://localhost:5001/Slusa/PreuzmiUcenikeZaKurs/"+kurs+"/"+skola)
            .then(s => {
                this.listaUcenika.length = 0;
                this.listaOcena.length = 0;
                s.json().then(ucenici => {
                    if(ucenici.length === 0){
                        /*let tabela = document.querySelector(".divTabela");
                        obrisiDecu(tabela);
                        this.napraviTabeluUcenikaZaKurs(tabela);*/
                        updateTable("tbody");
                    }
                    else{
                        ucenici.forEach(el => {
                            let ucenik = new Ucenik(el.id, el.ime, el.prezime, el.imeRoditelja, el.clanskaKnjizica);
                            this.listaUcenika.push(ucenik);
                            let ocena = new Ocena(el.ocena);
                            console.log(el.ocena);
                            this.listaOcena.push(ocena);

                            let tabela = document.querySelector(".divTabelaUcenik");
                            obrisiDecu(tabela);
                            this.napraviTabeluUcenikaZaKurs(tabela);
                            this.azurirajPodatke_NapraviTeloTabeleUcenikaZaKurs();
                        })
                    }
                })
            })
    }

    napraviTabeluUcenikaZaKurs(host){
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

    azurirajPodatke_NapraviTeloTabeleUcenikaZaKurs(){
        var teloTabele = document.querySelector(".tbody");
        var roditeljTabela = teloTabele.parentNode;
        roditeljTabela.removeChild(teloTabele);

        teloTabele = document.createElement("tbody");
        teloTabele.className = "tbody";
        roditeljTabela.appendChild(teloTabele);

        console.log(this.listaOcena);

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
            ime.className = "ime";
            tr.appendChild(ime);

            var prezime = document.createElement("td");
            prezime.innerHTML = el.prezime;
            prezime.className = "prezime"; 
            tr.appendChild(prezime);

            var imeRod = document.createElement("td");
            imeRod.innerHTML = el.imeRoditelja;
            imeRod.className = "imeRod";
            tr.appendChild(imeRod);

            var clanskaKnjiz = document.createElement("td");
            clanskaKnjiz.innerHTML = el.clanskaKnjizica;
            clanskaKnjiz.className = "clanskaKnjiz";
            tr.appendChild(clanskaKnjiz);

            var ocena = document.createElement("td");
            if(this.listaOcena[index].vrednost == 0){
                ocena.innerHTML = "/";
            }
            else{
                ocena.innerHTML = this.listaOcena[index].vrednost;
            }
            ocena.className = "ocena";
            tr.appendChild(ocena);
        });
    }

    preuzmiKurseveZaSkolu(){
        let seSkola = document.querySelector(".selectSkola").value;

        fetch("https://localhost:5001/Sadrzi/PreuzmiKurseveZaSkolu/" + seSkola)
            .then(s => {
                this.listaKurseva.length=0;
                s.json().then(kursevi => {
                    kursevi.forEach(k => {
                        let kurs = new Kurs(k.id, k.naziv, k.cena, k.vreme);
                        this.listaKurseva.push(kurs);
                    });
                    let divZaSelectKursa = document.createElement("div");
                    divZaSelectKursa.className = "divZaSelectKursa";

                    let seKurs = document.createElement("select");
                    seKurs.className = "selectKurs";
                    divZaSelectKursa.appendChild(seKurs);

                    let op;
                    this.listaKurseva.forEach(el => {
                        op = document.createElement("option");
                        op.innerHTML = el.Naziv;
                        op.value = el.ID;
                        seKurs.appendChild(op);
                    });

                    let ubaci = document.querySelector(".divKursUcenik");
                    ubaci.appendChild(divZaSelectKursa);
                })
        });
    }

    obrisatiUcenika(){
        if(confirm("Da li želiš da izbrišeš učenika!")){

            let tr = document.querySelector(".selektovan");
            let ucenik = tr.id;

            if(!ucenik){
                alert("Niste selektovali učenika koga želite obrisati!");
                return;
            }
            fetch("https://localhost:5001/Ucenik/IzbrisatiUcenika/"+ucenik,{
                method: "DELETE"
            }).then(s => {
                if(!s.ok){
                    alert("Nije moguće obrisati učenika!");
                }
                else{
                    this.preuzmiUcenikeBezKursa();
                }
            })
        }
    }

    ispisiUcenikaSaKursa(){
        if(confirm("Da li želiš da ispišeš učenika!")){
            let tr = document.querySelector(".selektovan");
            let ucenik = tr.id;
            
            let kurs = document.querySelector(".selectKurs").value;

            if(!ucenik){
                alert("Niste selektovali učenika koga želite ispisati sa kursa!");
                return;
            }

            fetch("https://localhost:5001/Slusa/ObrisatiUcenikaSaKursa/"+ucenik+"/"+kurs,{
                method: "DELETE"
            }).then(s => {
                if(!s.ok){
                    alert("Nije moguće ispisati učenika zbog ocene!")
                }
                else{
                    this.preuzmiUcenikZaKurs();
                }
            })
        }
    }
}