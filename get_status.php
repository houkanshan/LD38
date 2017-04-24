<?php
include "base.php";

$ip = $_SERVER['REMOTE_ADDR'];

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

try {
    $status = array(
        "comment" => get_last_comment(),
        "deathTime" => get_death_time(),
        "is_dead" => is_dead(),
        "life" => get_life(),
        "can_extend" => can_extend_life($ip),
    );
} catch (Exception $e) {
    write_log(var_dump($e));
    header(':', true, 500);
}

echo json_encode($status);
?>
