<?php
include "base.php";


header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$status = array(
    "comment" => get_last_comment(),
    "deathTime" => get_death_time(),
    "is_dead" => is_dead(),
    "life" => get_life(),
);

echo json_encode($status);
?>
