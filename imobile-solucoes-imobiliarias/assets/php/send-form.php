<?php
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;

const SMTP_HOST = 'smtp.kinghost.net';
const SMTP_USERNAME = 'smtp@bernardi.adv.br';
const SMTP_PASSWORD = 'Be@33933000';
const SMTP_FROM = 'smtp@bernardi.adv.br';
const SMTP_FROM_NAME = 'Manure Marketing';
const SMTP_PORT = 465; // 587 para TLS, 465 para SSL
const SMTP_SECURE = PHPMailer::ENCRYPTION_STARTTLS;
const MAIL_TO_ADDRESS = 'lucasantonydosreis@gmail.com';

const RECAPTCHA_ENABLED = true;
const RECAPTCHA_SECRET = '6LdWZ5srAAAAAPK87_GafPeV5oK96ZhvYlQqZx0f';

if (RECAPTCHA_ENABLED) {
  $recaptchaToken = $_POST['recaptcha_token'] ?? '';
  if (!$recaptchaToken) {
    http_response_code(403);
    exit('Token ausente');
  }
  $recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';
  $response = file_get_contents($recaptchaUrl . '?secret=' . RECAPTCHA_SECRET . '&response=' . $recaptchaToken);
  $responseKeys = json_decode($response, true);
  if (!$responseKeys['success'] || $responseKeys['score'] < 0.5) {
    http_response_code(403);
    exit('reCAPTCHA inválido');
  }
}

$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';

$mail = new PHPMailer();
$mail->isSMTP();
$mail->Host = SMTP_HOST;
$mail->SMTPAuth = true;
$mail->Username = SMTP_USERNAME;
$mail->Password = SMTP_PASSWORD;
$mail->SMTPSecure = SMTP_SECURE;
$mail->Port = SMTP_PORT;
$mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
$mail->addAddress(MAIL_TO_ADDRESS);
$mail->Subject = 'Novo contato recebido no site';
$mail->Body = "Nome: $name\nWhatsApp: $phone";

if (!$mail->send()) {
  http_response_code(500);
  exit('Erro ao enviar: ' . $mail->ErrorInfo);
}

http_response_code(200);
exit('Enviado com sucesso');
