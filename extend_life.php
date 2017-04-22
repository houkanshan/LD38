<?php

include "base.php";

header("Access-Control-Allow-Origin: *");

$ip = $_SERVER['REMOTE_ADDR'];

$new_death_time = try_extend_life($ip);
if ($new_death_time) {
  echo $new_death_time;
} else {
  echo '';
}
?>
