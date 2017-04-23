<?php
include "base.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LD38</title>
</head>
<body>
  <p> Born in: <?php echo date(DATE_RFC2822, get_brith_time()) ?></p>
  <p> Will die at: <?php echo date(DATE_RFC2822, get_death_time()); ?> </p>

  <p><?php
    if (is_dead()) {
      echo "It's dead.";
    } else {
      echo "It's alive";
    }
  ?></p>

  <p>Last comment is: <?php echo get_last_comment(); ?></p>

  <form action="post_comment.php" method="post">
    <input type="text" name="comment">
    <button type="submit">submit</button>
  </form>

  <form action="extend_life.php" method="post">
    <button type="submit">submit</button>
  </form>

  <?php phpinfo() ?>
</body>
</html>
