<?php

define("FILE_GLOBAL_ID", "data/global_id.txt");
define("DIR_USERS", "data/users/");
define("FILE_COMMENTS", "data/comments.txt");

function read_last_line($f) {
  $line = '';
  $cursor = -1;
  fseek($f, $cursor, SEEK_END);
  $char = fgetc($f);
  while ($char === "\n" || $char === "\r") {
    fseek($f, $cursor--, SEEK_END);
    $char = fgetc($f);
  }
  while ($char !== false && $char !== "\n" && $char !== "\r") {
    $line = $char . $line;
    fseek($f, $cursor--, SEEK_END);
    $char = fgetc($f);
  }

  return $line;
}

$comments_file = fopen(FILE_COMMENTS, "r");

header("Access-Control-Allow-Origin: *");

echo read_last_line($comments_file);

fclose($comments_file);
?>
