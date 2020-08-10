using Microsoft.EntityFrameworkCore.Migrations;

namespace Mxstrong.Migrations
{
  public partial class AddUserActivation : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.AddColumn<bool>(
          name: "Activated",
          table: "Users",
          nullable: false,
          defaultValue: true);

      migrationBuilder.CreateTable(
          name: "ActivationTokens",
          columns: table => new
          {
            Id = table.Column<string>(nullable: false),
            UserId = table.Column<string>(nullable: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_ActivationTokens", x => x.Id);
          });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "ActivationTokens");

      migrationBuilder.DropColumn(
          name: "Activated",
          table: "Users");
    }
  }
}
