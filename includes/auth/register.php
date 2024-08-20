<?php

if (!empty(array_filter($_POST))) {
    var_dump($_POST);

    // todo:
    // shorten username to max size as defined in db and input field
    // add link to login page if username/email is already in use and autofill username/email input
    // update h1 header to show current step
    // trigger continue button on enter-key press
}

?>
<div class="auth-page-container">
    <div class="auth-header">Register</div>
    <div class="auth-sub-header" id="register-sub-header">Choose your username</div>

    <form class="auth-form" id="register-form" action="/" method="POST">
        <div class="user-input-area user-input-area-register active" id="register-username">
            <input class="text-input auth-item auth-item-medium" id="register-username-input" type="text" name="username" placeholder="Username" maxlength="16">
            <button class="auth-item auth-btn button-register auth-item-medium" id="register-username-btn" type="button" disabled>Continue</button>
        </div>

        <div class="user-input-area user-input-area-register" id="register-email">
            <input class="text-input auth-item auth-item-large" id="register-email-input" type="email" name="email" placeholder="Email">
            <button class="auth-item auth-btn button-register auth-item-medium" id="register-email-btn" type="button" disabled>Continue</button>
        </div>

        <div class="user-input-area user-input-area-register" id="verify-email">
            <button class="auth-item auth-btn auth-item-medium" id="send-verif-code-btn" type="button">Send Code</button>
            <input class="text-input auth-item auth-item-medium" id="verif-code-input" type="text" name="verif-code" placeholder="Code from Email">
            <button class="auth-item auth-btn button-register auth-item-medium" id="verify-email-btn" type="button">Continue/Skip</button>
        </div>

        <div class="user-input-area user-input-area-register" id="register-password">
            <input class="text-input auth-item auth-item-medium" id="register-password-input" type="password" name="password" placeholder="Password">
            <input class="text-input auth-item auth-item-medium" id="register-password-confirm-input" type="password" name="password-confirm" placeholder="Confirm password">
            <input class="auth-item auth-btn button-register auth-item-medium" id="register-password-btn" type="submit" value="Submit" disabled>
        </div>

        <button class="auth-item auth-btn auth-back-btn auth-item-medium" id="register-back-btn" type="button" title="Back">
            <i class="fas fa-arrow-left"></i>
        </button>
    </form>

    <div class="account-message">
        Already have an account? Log in.
    </div>
</div>