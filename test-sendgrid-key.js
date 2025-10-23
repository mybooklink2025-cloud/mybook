import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_API_KEY) {
  console.error("❌ No hay SendGrid API Key configurada en el .env");
  process.exit(1);
}

sgMail.setApiKey(SENDGRID_API_KEY);

async function testSendGrid() {
  try {
    // No enviamos correo real, solo pedimos la información de la cuenta
    const response = await sgMail.client.request({
      method: "GET",
      url: "/v3/user/account",
    });
    console.log("✅ API Key válida. Información de la cuenta SendGrid:");
    console.log(response.body);
  } catch (error) {
    console.error("❌ Error al validar API Key:");
    console.error(error);
  }
}

testSendGrid();
