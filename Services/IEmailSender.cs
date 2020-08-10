using Mxstrong.Models;
using SendGrid;
using System.Threading.Tasks;

namespace Mxstrong.Services
{
  public interface IEmailSender
  {
    Task<Response> SendActivationEmail(User recipient, ActivationToken token);
  }
}
