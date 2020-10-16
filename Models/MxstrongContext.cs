using Microsoft.EntityFrameworkCore;
using Mxstrong.Models;

namespace Mxstrong.Models
{
  public class MxstrongContext : DbContext
  {
    public MxstrongContext(DbContextOptions<MxstrongContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<ActivationToken> ActivationTokens { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<ProgressBar> ProgressBars { get; set; }
    public DbSet<CheckBox> CheckBoxes { get; set; }
    public DbSet<DayCounter> DayCounters { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Goal>().ToTable("Goals");
    }
  }
}
