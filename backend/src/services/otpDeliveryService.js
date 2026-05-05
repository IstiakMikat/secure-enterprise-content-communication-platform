const nodemailer = require("nodemailer");
const twilio = require("twilio");
const env = require("../config/env");

class OtpDeliveryService {
  constructor() {
    this.mailTransporter = null;
    this.twilioClient = null;
  }

  getMaskedEmail(email) {
    const [localPart, domain] = String(email || "").split("@");
    if (!localPart || !domain) {
      return "configured email";
    }
    const visible = localPart.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(localPart.length - 2, 1))}@${domain}`;
  }

  getMaskedPhone(phone) {
    const normalized = String(phone || "");
    if (normalized.length < 4) {
      return "configured phone";
    }
    return `${"*".repeat(Math.max(normalized.length - 4, 1))}${normalized.slice(-4)}`;
  }

  getMailTransporter() {
    if (this.mailTransporter) {
      return this.mailTransporter;
    }

    if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
      return null;
    }

    this.mailTransporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });

    return this.mailTransporter;
  }

  async sendEmailOtp({ toEmail, code, purpose }) {
    const transporter = this.getMailTransporter();
    if (!transporter) {
      console.log(`DEMO OTP for ${purpose}: ${code} sent to ${toEmail}`);
      return {
        channel: "email",
        destination: this.getMaskedEmail(toEmail),
        providerStatus: "demo_logged",
        previewCode: code,
      };
    }

    await transporter.sendMail({
      from: env.smtp.from,
      to: toEmail,
      subject: `Secure Enterprise OTP for ${purpose}`,
      text: `Your secure verification code is ${code}. It expires in ${env.otpTtlMinutes} minutes.`,
      html: `<p>Your secure verification code is <strong>${code}</strong>.</p><p>It expires in ${env.otpTtlMinutes} minutes.</p>`,
    });

    return {
      channel: "email",
      destination: this.getMaskedEmail(toEmail),
      providerStatus: "sent",
    };
  }

  async sendPhoneOtp({ toPhone, code, purpose }) {
    if (
      env.smsProvider === "twilio" &&
      env.twilio.accountSid &&
      env.twilio.authToken &&
      env.twilio.phoneNumber
    ) {
      if (!this.twilioClient) {
        this.twilioClient = twilio(env.twilio.accountSid, env.twilio.authToken);
      }

      await this.twilioClient.messages.create({
        body: `Your Secure Enterprise verification code for ${purpose} is ${code}. It expires in ${env.otpTtlMinutes} minutes.`,
        from: env.twilio.phoneNumber,
        to: toPhone,
      });

      return {
        channel: "phone",
        destination: this.getMaskedPhone(toPhone),
        providerStatus: "sent",
      };
    }

    // For demo purposes, log the OTP code
    console.log(`DEMO SMS OTP for ${purpose}: ${code} sent to ${toPhone}`);
    return {
      channel: "phone",
      destination: this.getMaskedPhone(toPhone),
      providerStatus: "demo_logged",
      previewCode: code,
    };
  }

  async sendOtp({ userProfile, code, purpose, requestedChannel }) {
    const channel = String(requestedChannel || env.otpDeliveryMode || "email").toLowerCase();

    if (channel === "phone") {
      try {
        return await this.sendPhoneOtp({
          toPhone: userProfile.phone,
          code,
          purpose,
        });
      } catch (error) {
        if (!env.otpFallbackToPreview) {
          throw error;
        }
        return {
          channel: "phone",
          destination: this.getMaskedPhone(userProfile.phone),
          providerStatus: "preview",
          previewCode: code,
        };
      }
    }

    try {
      return await this.sendEmailOtp({
        toEmail: userProfile.email,
        code,
        purpose,
      });
    } catch (error) {
      if (!env.otpFallbackToPreview) {
        throw error;
      }
      return {
        channel: "email",
        destination: this.getMaskedEmail(userProfile.email),
        providerStatus: "preview",
        previewCode: code,
      };
    }
  }

  getUnavailableDelivery(channel, userProfile, error) {
    return {
      channel,
      destination:
        channel === "phone"
          ? this.getMaskedPhone(userProfile.phone)
          : this.getMaskedEmail(userProfile.email),
      providerStatus: "failed",
      errorMessage:
        error?.message ||
        (channel === "phone"
          ? "Phone OTP delivery is unavailable."
          : "Email OTP delivery is unavailable."),
    };
  }
}

module.exports = new OtpDeliveryService();
