import MailConfig from "../../config/mail";
import NodeMailer, { Transporter } from "nodemailer";
import logger from "../logger/logger";
import { EmailOptions } from "../../types/mail.interface";
import fs from "fs";
import path from "path";
class EmailSender {
  private transporter: Transporter;
  constructor() {
    this.transporter = NodeMailer.createTransport(MailConfig);
  }
  async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: MailConfig.auth.user,
      to,
      subject,
      html,
    });
    logger.info("Email process completed");
  }
  private loadTemplate(templatePath: string): string {
    const templateFilePath = path.resolve(templatePath);
    return fs.readFileSync(templateFilePath, "utf8");
  }

  private replaceVariables(
    template: string,
    variables: Record<string, string>
  ): string {
    let emailContent = template;
    for (const variable in variables) {
      const regex = new RegExp(`{{${variable}}}`, "g");
      emailContent = emailContent.replace(regex, variables[variable]);
    }
    return emailContent;
  }

  async sendResetPasswordEmail(
    firstname: string,
    email: string,
    reset_link: string
  ): Promise<void> {
    const subject = "Account Verification";
    const template = this.loadTemplate(
      path.join(__dirname, "templates/resetPassword.html")
    );
    const variables = {
      firstname,
      reset_link,
    };
    const html = this.replaceVariables(template, variables);
    await this.sendEmail({
      to: email,
      subject,
      html,
    });
    logger.info("Verification email sent successfully!");
  }
}

export default EmailSender;
