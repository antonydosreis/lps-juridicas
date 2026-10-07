<?php
declare(strict_types=1);
ini_set('display_errors', '0');
error_reporting(0);
header('Content-Type: application/json; charset=UTF-8');

$webAppUrl = 'https://script.google.com/macros/s/AKfycby5XHjP2iH-mj6p_jUKq7CEz7KgmqhHkFwXJXSQj5YZAr3-gQ8p6iEV2GSGZ-hk31Go/exec';
$sheetName = 'Sheet1'; // TROQUE AQUI SE A ABA NÃO FOR "Sheet1"

$name  = trim($_POST['name']  ?? '');
$phone = trim($_POST['phone'] ?? '');
$email = trim($_POST['email'] ?? '');

if ($name === '' || $email === '') {
  echo json_encode(['ok' => false, 'where' => 'php', 'error' => 'missing_fields']); exit;
}

$payload = [
  'sheet' => $sheetName,
  'rows'  => [[date('Y-m-d H:i:s'), $name, $phone, $email]]
];

if (!function_exists('curl_init')) {
  echo json_encode(['ok' => false, 'where' => 'php', 'error' => 'curl_extension_missing']); exit;
}

$ch = curl_init($webAppUrl);
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
  CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 20,
]);

$response = curl_exec($ch);
$curlErr  = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($curlErr) {
  echo json_encode(['ok' => false, 'where' => 'curl', 'error' => $curlErr]); exit;
}

$body = json_decode((string)$response, true);
if (!is_array($body)) {
  // hospedagem retornou HTML/erro do servidor
  echo json_encode(['ok' => false, 'where' => 'apps_script', 'status' => $httpCode, 'raw' => $response]); exit;
}

echo json_encode(['ok' => ($body['ok'] ?? false) === true, 'apps_script' => $body], JSON_UNESCAPED_UNICODE);
