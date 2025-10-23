import dotenv from "dotenv";
dotenv.config();

const testSendGridMultiple = async () => {
  try {
    const sgMail = await import("@sendgrid/mail");
    sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);

    const destinatarios = process.env.EMAIL_TO
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    if (!destinatarios.length) {
      console.error("❌ No hay destinatarios en EMAIL_TO");
      return;
    }

    const msg = {
      to: destinatarios,
      from: process.env.EMAIL_FROM,
      subject: "Prueba SendGrid MyBook ✅",
      text: "Este es un correo de prueba enviado desde tu backend MyBook usando SendGrid a todos los destinatarios.",
      html: "<p>Este es un correo de prueba enviado desde tu backend MyBook usando <strong>SendGrid</strong> a todos los destinatarios.</p>",
    };

    await sgMail.default.send(msg);
    console.log("✅ Correo de prueba enviado correctamente a todos los destinatarios!");
  } catch (err) {
    console.error("❌ Error en envío de prueba:", err);
  }
};

testSendGridMultiple();
