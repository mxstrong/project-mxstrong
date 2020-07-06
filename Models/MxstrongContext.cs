using Microsoft.EntityFrameworkCore;

namespace Mxstrong.Models
{
  public class MxstrongContext : DbContext
  {
    public MxstrongContext(DbContextOptions<MxstrongContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<ActivationToken> ActivationTokens { get; set; }
  }
}
