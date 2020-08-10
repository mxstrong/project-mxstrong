using Microsoft.EntityFrameworkCore.Migrations;

namespace Mxstrong.Migrations
{
  public partial class AddFullNamePropertyToUser : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.AddColumn<string>(
          name: "FullName",
          table: "Users",
          nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropColumn(
          name: "FullName",
          table: "Users");
    }
  }
}
