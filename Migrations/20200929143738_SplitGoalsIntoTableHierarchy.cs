using Microsoft.EntityFrameworkCore.Migrations;

namespace Mxstrong.Migrations
{
    public partial class SplitGoalsIntoTableHierarchy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Goals");

            migrationBuilder.AlterColumn<int>(
                name: "Progress",
                table: "Goals",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<bool>(
                name: "Checked",
                table: "Goals",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Goals",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Goals",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Checked",
                table: "Goals");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Goals");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Goals");

            migrationBuilder.AlterColumn<int>(
                name: "Progress",
                table: "Goals",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Goals",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
