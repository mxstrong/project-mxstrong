namespace Mxstrong.Models
{
  public class Post
  {
    public string PostId { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public string TopicId { get; set; }
    public Topic Topic { get; set; }
  }
}
