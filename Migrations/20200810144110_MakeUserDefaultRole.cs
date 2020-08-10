using Microsoft.EntityFrameworkCore.Migrations;

namespace Mxstrong.Migrations
{
    public partial class MakeUserDefaultRole : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          migrationBuilder.AlterColumn<string>(
            name: "Role",
            table: "Users",
            nullable: false,
            defaultValue: "User",
            oldClrType: typeof(string),
            oldDefaultValue: "Admin");
    }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
          migrationBuilder.AlterColumn<string>(
            name: "Role",
            table: "Users",
            nullable: false,
            defaultValue: "Admin",
            oldClrType: typeof(string));
        }
    }
}
