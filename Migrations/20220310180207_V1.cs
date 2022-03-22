using Microsoft.EntityFrameworkCore.Migrations;

namespace WEB___NEW.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kurs",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cena = table.Column<int>(name: "Cena(€)", type: "int", nullable: false),
                    Vremetrajanjakursaumesecima = table.Column<int>(name: "Vreme trajanja kursa(u mesecima)", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kurs", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Upravnik",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(name: "E-mail", type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Upravnik", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Škola",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpravnikID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Škola", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Škola_Upravnik_UpravnikID",
                        column: x => x.UpravnikID,
                        principalTable: "Upravnik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Predavač",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    JMBG = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    Sertifikat = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    SkolaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Predavač", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Predavač_Škola_SkolaID",
                        column: x => x.SkolaID,
                        principalTable: "Škola",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Sadrži",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Brojučenika = table.Column<int>(name: "Broj učenika", type: "int", nullable: false),
                    SkolaID = table.Column<int>(type: "int", nullable: true),
                    KursID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sadrži", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Sadrži_Kurs_KursID",
                        column: x => x.KursID,
                        principalTable: "Kurs",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Sadrži_Škola_SkolaID",
                        column: x => x.SkolaID,
                        principalTable: "Škola",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Učenik",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Imeroditelja = table.Column<string>(name: "Ime roditelja", type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Članskaknjižica = table.Column<int>(name: "Članska knjižica", type: "int", nullable: false),
                    SkolaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Učenik", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Učenik_Škola_SkolaID",
                        column: x => x.SkolaID,
                        principalTable: "Škola",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Predaje",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KursID = table.Column<int>(type: "int", nullable: true),
                    PredavacID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Predaje", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Predaje_Kurs_KursID",
                        column: x => x.KursID,
                        principalTable: "Kurs",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Predaje_Predavač_PredavacID",
                        column: x => x.PredavacID,
                        principalTable: "Predavač",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Sluša",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ocena = table.Column<int>(type: "int", nullable: false),
                    KursID = table.Column<int>(type: "int", nullable: true),
                    UcenikID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sluša", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Sluša_Kurs_KursID",
                        column: x => x.KursID,
                        principalTable: "Kurs",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Sluša_Učenik_UcenikID",
                        column: x => x.UcenikID,
                        principalTable: "Učenik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Predaje_KursID",
                table: "Predaje",
                column: "KursID");

            migrationBuilder.CreateIndex(
                name: "IX_Predaje_PredavacID",
                table: "Predaje",
                column: "PredavacID");

            migrationBuilder.CreateIndex(
                name: "IX_Predavač_SkolaID",
                table: "Predavač",
                column: "SkolaID");

            migrationBuilder.CreateIndex(
                name: "IX_Sadrži_KursID",
                table: "Sadrži",
                column: "KursID");

            migrationBuilder.CreateIndex(
                name: "IX_Sadrži_SkolaID",
                table: "Sadrži",
                column: "SkolaID");

            migrationBuilder.CreateIndex(
                name: "IX_Škola_UpravnikID",
                table: "Škola",
                column: "UpravnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Sluša_KursID",
                table: "Sluša",
                column: "KursID");

            migrationBuilder.CreateIndex(
                name: "IX_Sluša_UcenikID",
                table: "Sluša",
                column: "UcenikID");

            migrationBuilder.CreateIndex(
                name: "IX_Učenik_SkolaID",
                table: "Učenik",
                column: "SkolaID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Predaje");

            migrationBuilder.DropTable(
                name: "Sadrži");

            migrationBuilder.DropTable(
                name: "Sluša");

            migrationBuilder.DropTable(
                name: "Predavač");

            migrationBuilder.DropTable(
                name: "Kurs");

            migrationBuilder.DropTable(
                name: "Učenik");

            migrationBuilder.DropTable(
                name: "Škola");

            migrationBuilder.DropTable(
                name: "Upravnik");
        }
    }
}
