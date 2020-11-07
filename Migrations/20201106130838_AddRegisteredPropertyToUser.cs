using Microsoft.EntityFrameworkCore.Migrations;

namespace Mxstrong.Migrations
{
    public partial class AddRegisteredPropertyToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Registered",
                table: "Users",
                nullable: false,
                defaultValue: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Registered",
                table: "Users");
        }
    }
}
