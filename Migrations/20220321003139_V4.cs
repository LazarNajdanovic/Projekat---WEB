using Microsoft.EntityFrameworkCore.Migrations;

namespace WEB___NEW.Migrations
{
    public partial class V4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Broj učenika",
                table: "Kurs");

            migrationBuilder.AddColumn<int>(
                name: "Broj učenika",
                table: "Sadrži",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Broj učenika",
                table: "Sadrži");

            migrationBuilder.AddColumn<int>(
                name: "Broj učenika",
                table: "Kurs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
