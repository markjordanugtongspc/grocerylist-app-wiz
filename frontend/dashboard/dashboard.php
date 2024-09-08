<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    // If not logged in, redirect to the login page with an error message
    header("Location: ../../index.php?error=please%login%first");
    exit();
}
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="../../frontend/dashboard/dashboard_style.css" />
        <title>Dashboard</title>
    </head>
    <body>
        <div class="dashboard">
            <div class="overlap-wrapper">
                <div class="overlap">
                    <div class="overlap-group">
                        <img class="image" src="../../images/dashboard/image-3.png" />
                        <div class="div">
                            <img class="img" src="../../images/dashboard/image-1.png" />
                            <div class="text-wrapper">Grocery List</div>
                            <img class="image-2" src="../../images/dashboard/image.png" />
                            <img class="image-3" src="../../images/dashboard/image-2.png" />
                            <div class="text-wrapper-2">Your List is Empty</div>
                        </div>
                    </div>
                    <div class="overlap-group-2">
                        <img class="image-4" src="../../images/dashboard/image-4.png" />
                        <p class="p">Create list and add them to your trolley for an easier grocery experience</p>
                        <button class="rectangle"><a href="../dashboard/addlist.php" style="text-decoration: none; color: inherit;">Add List</a></button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>