<?php
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;

const SMTP_HOST         = 'XXXXXX';
const SMTP_USERNAME     = 'XXXXXX';
const SMTP_PASSWORD     = 'XXXXXX';
const SMTP_FROM         = 'from@website.com.br';
const SMTP_FROM_NAME    = 'From Name';
const SMTP_PORT         = 465; // 587 para STARTTLS, 465 para SMTPS
const SMTP_SECURE       = PHPMailer::ENCRYPTION_SMTPS;
const MAIL_TO_ADDRESS   = 'to@website.com.br';

const RECAPTCHA_ENABLED = true;
const RECAPTCHA_SECRET  = '6LepAowrAAAAALq04jCr9RDfAhbHSoJ5JxcLbfFB';

function verifyRecaptchaOrExit(): void
{
  if (!RECAPTCHA_ENABLED) return;

  $recaptchaToken = $_POST['recaptcha_token'] ?? '';
  if ($recaptchaToken === '') {
    http_response_code(403);
    exit('Token ausente');
  }

  $recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';
  $response     = file_get_contents($recaptchaUrl . '?secret=' . RECAPTCHA_SECRET . '&response=' . $recaptchaToken);
  $responseKeys = json_decode($response, true);

  if (!$responseKeys['success'] || $responseKeys['score'] < 0.5) {
    http_response_code(403);
    exit('reCAPTCHA inválido');
  }
}

function createConfiguredMailer(): PHPMailer
{
  $mailer = new PHPMailer();
  $mailer->isSMTP();
  $mailer->Host       = SMTP_HOST;
  $mailer->SMTPAuth   = true;
  $mailer->Username   = SMTP_USERNAME;
  $mailer->Password   = SMTP_PASSWORD;
  $mailer->SMTPSecure = SMTP_SECURE;
  $mailer->Port       = SMTP_PORT;
  $mailer->setFrom(SMTP_FROM, SMTP_FROM_NAME);
  $mailer->addAddress(MAIL_TO_ADDRESS);
  return $mailer;
}

verifyRecaptchaOrExit();

$contactName    = $_POST['name']    ?? '';
$contactPhone   = $_POST['phone']   ?? '';
$contactEmail = $_POST['email'] ?? '';

$mailer = createConfiguredMailer();
$mailer->Subject = 'Novo contato recebido no site';
$mailer->Body    = "Nome: {$contactName}\nWhatsApp: {$contactPhone}\nE-mail: {$contactEmail}";

if (!$mailer->send()) {
  http_response_code(500);
  exit('Erro ao enviar: ' . $mailer->ErrorInfo);
}

http_response_code(200);
exit('Enviado com sucesso');
