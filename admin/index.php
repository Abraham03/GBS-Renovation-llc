<?php
session_start();
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true) {
    header('Location: panel.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // IMPORTANTE: Cambia esta contraseña por una segura
    $password = 'GBS_Admin_2025!'; 
    if (isset($_POST['password']) && $_POST['password'] == $password) {
        $_SESSION['loggedin'] = true;
        header('Location: panel.php');
        exit;
    } else {
        $error = 'Contraseña incorrecta';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <h2>Admin GBS Renovations</h2>
        <form method="post" action="index.php">
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Entrar</button>
            <?php if($error): ?>
                <p class="error"><?php echo $error; ?></p>
            <?php endif; ?>
        </form>
    </div>
</body>
</html>