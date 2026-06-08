 import { Resend } from "resend";   
    import dotenv from "dotenv";
    dotenv.config();
    const resend = new Resend(process.env.RESEND_API_KEY);

    interface EmailParams {
      to: string;
      subject: string;
      htmlContent: string;
    }

    interface MagicLinkEmailParams {
      to: string;
      magicLink: string;
    }

     export const sendEmail = async (to: string, subject: string, htmlContent: string): Promise<void> => {
      try {
        const response = await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
            to: [to],
          subject: subject,
          html: htmlContent,
        });
        if (response.error) {
          throw new Error(response.error.message);
        }
        console.log("Email sent:", response.data);
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    };
   export const magicLinkEmail = async (to: string, magicLink: string): Promise<void> => {
      const subject = "Votre login pour le projet Taekna";
      const htmlContent = `<p>Bonjour,</p><p>Cliquez sur le lien suivant pour accéder au projet Taekna : <a href="${magicLink}">Accéder au projet Taekna</a></p><p>Cordialement,<br/>L'équipe Taekna</p>`;
      await sendEmail(to, subject, htmlContent);
    }