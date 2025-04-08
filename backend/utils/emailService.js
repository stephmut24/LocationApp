import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config()
// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
console.log('EMAIL CONFIG =>', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  user: process.env.EMAIL_USER
});


// Fonction pour générer un mot de passe aléatoire
export const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

// Fonction pour envoyer un email d'invitation à un hôpital
export const sendHospitalInvitation = async (hospitalEmail, password) => {
  const mailOptions = {
    from: `"Service d'Urgence" <${process.env.EMAIL_FROM}>`,
    to: hospitalEmail,
    subject: "Invitation à rejoindre notre système d'urgence médicale",
    html: `
      <h1>Bienvenue au système d'urgence médicale</h1>
      <p>Votre établissement a été ajouté à notre plateforme de gestion des urgences médicales.</p>
      <p>Veuillez utiliser les identifiants suivants pour vous connecter:</p>
      <ul>
        <li><strong>Email:</strong> ${hospitalEmail}</li>
        <li><strong>Mot de passe temporaire:</strong> ${password}</li>
      </ul>
      <p>Vous serez invité à changer votre mot de passe lors de votre première connexion.</p>
      <p>Lien de connexion: <a href="${process.env.FRONTEND_URL}/login">Se connecter</a></p>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

// Fonction pour envoyer un email d'invitation à un ambulancier
export const sendAmbulanceInvitation = async (ambulanceUserEmail, password, ambulanceNumber, hospitalName) => {
  const mailOptions = {
    from: `"Service d'Urgence" <${process.env.EMAIL_FROM}>`,
    to: ambulanceUserEmail,
    subject: "Vos identifiants pour le système d'urgence médicale",
    html: `
      <h1>Bienvenue au système d'urgence médicale</h1>
      <p>Vous avez été assigné(e) à l'ambulance ${ambulanceNumber} de l'hôpital ${hospitalName}.</p>
      <p>Veuillez utiliser les identifiants suivants pour vous connecter:</p>
      <ul>
        <li><strong>Email:</strong> ${ambulanceUserEmail}</li>
        <li><strong>Mot de passe temporaire:</strong> ${password}</li>
      </ul>
      <p>Vous serez invité à changer votre mot de passe lors de votre première connexion.</p>
      <p>Lien de connexion: <a href="${process.env.FRONTEND_URL}/login">Se connecter</a></p>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};