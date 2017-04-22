<?php

include "base.php";

header("Access-Control-Allow-Origin: *");

$ip = $_SERVER['REMOTE_ADDR'];
$id = get_id_by_ip($ip);

$comment = str_replace("\n", " ", $_POST["comment"]);

echo $id."\n";
echo $comment."\n";

if ($id && $comment) {
  file_put_contents(FILE_COMMENTS, $id.",".$comment.PHP_EOL, FILE_APPEND | LOCK_EX);
} else {
  http_response_code(400);
}

?>
