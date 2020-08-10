using Microsoft.Extensions.Configuration;
using Mxstrong.Models;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

namespace Mxstrong.Services
{
  public class EmailSender : IEmailSender
  {
    public EmailSender(IConfiguration configuration)
    {
      Configuration = configuration;
    }
    public IConfiguration Configuration { get; }
    public async Task<Response> SendActivationEmail(User recipient, ActivationToken token)
    {
      var apiKey = Configuration["SendGridApiKey"];
      var client = new SendGridClient(apiKey);
      var from = new EmailAddress("noreply@mxstrong.azurewebsites.net", "Mxstrong");
      var subject = "Activate your Mxstrong account";
      var to = new EmailAddress(recipient.Email);
      var plainTextContent = $"Hello, {recipient.FullName}," +
          " To complete your registration click on a link below." +
          " If you did not intend to create Mxstrong account, ignore this letter";
      var htmlContent = $"<html><body><h2 style=\"font-size: 36\">Hello, {recipient.FullName},</h2><br>" +
          "<div style=\"font-size: 20;\">To complete your registration " +
          $"<a style=\"color: blue\" href=\"https://localhost:5001/api/auth/activate/{token.Id}\">click here</a><br><br>" +
          "If you did not intend to create Mxstrong account, ignore this letter.</div></body></html>";
      var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
      var response = await client.SendEmailAsync(msg);
      return response;
    }
  }
}
