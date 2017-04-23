<?php
include "base.php";


header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

try {
    $status = array(
        "comment" => get_last_comment(),
        "deathTime" => get_death_time(),
        "is_dead" => is_dead(),
        "life" => get_life(),
    );
} catch (Exception $e) {
    header(':', true, 500);
}

echo json_encode($status);
?>
