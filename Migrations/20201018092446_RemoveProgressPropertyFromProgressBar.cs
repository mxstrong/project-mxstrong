using Microsoft.EntityFrameworkCore.Migrations;

namespace Mxstrong.Migrations
{
    public partial class RemoveProgressPropertyFromProgressBar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Progress",
                table: "Goals");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Progress",
                table: "Goals",
                type: "integer",
                nullable: true);
        }
    }
}
