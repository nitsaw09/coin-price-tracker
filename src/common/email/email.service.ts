import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailModuleOptions } from './email.module';
import { IMail } from './email.interfaces';



@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject('EMAIL_CONFIG')
    private readonly emailConfig: EmailModuleOptions,
  ) {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    });
  }

  async sendMail(mail: IMail): Promise<void> {
    await this.transporter.sendMail({
      from: this.emailConfig.user,
      to: mail?.to,
      subject: mail?.subject,
      text: mail?.message
    });
  }
}
