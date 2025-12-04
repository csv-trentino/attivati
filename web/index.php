<?php
$uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

if($uri === 'terms-of-service'){
  $page_title = 'Termini e condizioni';
  include 'terms.php';
  exit;
}

if($uri === 'privacy-policy'){
  $page_title = 'Privacy policy';
  include 'privacy.php';
  exit;
}

include 'home.php';
