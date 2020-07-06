using System.Threading.Tasks;
using SendGrid;
using Mxstrong.Models;

namespace Mxstrong.Services
{
  public interface IEmailSender
  {
    Task<Response> SendActivationEmail(User recipient, ActivationToken token);
  }
}
