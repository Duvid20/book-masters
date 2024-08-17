<?php

$errors = [];

?>
<div class="auth-page-container">

    <h1>Register</h1>

    <?php

    if (!empty(array_filter($_POST))) {
        $username = sanitizeInput($_POST['username']);
        $email = sanitizeInput($_POST['email']);
        $password = sanitizeInput($_POST['password']);
        $revisePassword = sanitizeInput($_POST['revise-password']);

        var_dump($_POST);
    } else {
        $errors[] = "All fields are required.";
    }

    ?>

    <form class="auth-form" action="/" method="POST">
        <input class="text-input" type="text" name="username" placeholder="Username">
        <input class="text-input" type="text" name="email" placeholder="Email">
        <input class="text-input" type="password" name="password" placeholder="Password">
        <input class="text-input" type="password" name="revise-password" placeholder="Revise password">
        <input class="text-input" type="submit" value="Continue">
    </form>

    <div class="account-message">
        Already have an account? Log in.
    </div>

</div>