<?php include "base.php"; ?>

<?php
$is_dead = is_dead();
$brith_time = get_brith_time();
$death_time = get_death_time();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LD38</title>
  <link rel="stylesheet" href="dist/css/index.css">
</head>
<body data-state="<?php echo $is_dead ? "dead" : "title" ?>">
<div id="screen">
  <div id="stage-title" class="stage">
    <a class="btn-start" href="javascript:;">- click to start -</a>
  </div>
  <div id="stage-main" class="stage">
    <p>Last comment: <span id="last-comment"><?php echo get_last_comment() ?></span></p>
    <input type="text" name="comment" placeholder="Leave your comments">
  </div>
  <div id="stage-dead" class="stage">
  </div>
</div>

<script>
  var Data = {
    brithTime: <?php echo $brith_time ?>
  , deathTime: <?php echo $death_time ?>
  }
</script>

<?php if (!$is_dead) { ?>
<script src="dist/js/index.js"></script>
<?php } ?>
</body>
</html>
