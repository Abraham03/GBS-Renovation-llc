<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    die("Acceso no autorizado.");
}

$projects_file = '../projects.json';
$images_base_dir = '../images/projects/';

// Crear el directorio de proyectos si no existe
if (!is_dir($images_base_dir)) {
    mkdir($images_base_dir, 0755, true);
}

// Cargar proyectos existentes o inicializar un array vacío
$projects = file_exists($projects_file) ? json_decode(file_get_contents($projects_file), true) : [];

$action = $_POST['action'] ?? '';

try {
    if ($action == 'new') {
        // --- CREAR NUEVO PROYECTO ---
        $title = trim($_POST['title'] ?? '');
        if (empty($title)) throw new Exception("El título es obligatorio.");

        $new_project_id = empty($projects) ? 1 : max(array_column($projects, 'id')) + 1;
        $folder_name = preg_replace('/[^a-z0-9]+/', '-', strtolower($title));
        $project_dir = $images_base_dir . $folder_name;

        if (!is_dir($project_dir)) {
            mkdir($project_dir, 0755, true);
        }

        $new_project = [
            'id' => $new_project_id,
            'title' => $title,
            'category' => $_POST['category'] ?? 'General',
            'description' => $_POST['description'] ?? '',
            'thumbnailUrl' => '',
            'media' => []
        ];

        $uploaded_files = upload_files($project_dir, $folder_name);
        
        if (empty($uploaded_files)) throw new Exception("Debes subir al menos una imagen.");

        $new_project['media'] = $uploaded_files;
        $new_project['thumbnailUrl'] = $uploaded_files[count($uploaded_files) - 1]['url']; // Usar la última imagen como thumbnail
        
        array_unshift($projects, $new_project);

    } elseif ($action == 'existing') {
        // --- AÑADIR A PROYECTO EXISTENTE ---
        $project_id = (int)($_POST['project_id'] ?? 0);
        if ($project_id <= 0) throw new Exception("ID de proyecto no válido.");

        $project_index = -1;
        foreach ($projects as $index => $p) {
            if ($p['id'] == $project_id) {
                $project_index = $index;
                break;
            }
        }
        if ($project_index === -1) throw new Exception("Proyecto no encontrado.");
        
        $folder_name = preg_replace('/[^a-z0-9]+/', '-', strtolower($projects[$project_index]['title']));
        $project_dir = $images_base_dir . $folder_name;

        if (!is_dir($project_dir)) {
            mkdir($project_dir, 0755, true);
        }

        $uploaded_files = upload_files($project_dir, $folder_name);
        if (empty($uploaded_files)) throw new Exception("No se subieron archivos.");

        $projects[$project_index]['media'] = array_merge($projects[$project_index]['media'], $uploaded_files);
        $projects[$project_index]['thumbnailUrl'] = $projects[$project_index]['media'][count($projects[$project_index]['media']) - 1]['url'];
    } else {
        throw new Exception("Acción no válida.");
    }

    // Guardar el archivo JSON
    if (file_put_contents($projects_file, json_encode($projects, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))) {
        echo "<h1>¡Éxito!</h1><p>El proyecto se ha actualizado correctamente.</p>";
        echo '<a href="panel.php">Volver al Panel</a>';
    } else {
        throw new Exception("No se pudo escribir en el archivo projects.json. Revisa los permisos.");
    }

} catch (Exception $e) {
    echo "<h1>Error</h1><p>" . $e->getMessage() . "</p>";
    echo '<a href="panel.php">Intentar de nuevo</a>';
}

function upload_files($target_dir, $folder_name) {
    $uploaded_media = [];
    $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
    
    foreach ($_FILES['files']['name'] as $key => $name) {
        if ($_FILES['files']['error'][$key] === UPLOAD_ERR_OK) {
            $file_tmp = $_FILES['files']['tmp_name'][$key];
            $file_ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));

            if (in_array($file_ext, $allowed_types)) {
                $new_filename = uniqid('', true) . '.' . $file_ext;
                $destination = $target_dir . '/' . $new_filename;

                if (move_uploaded_file($file_tmp, $destination)) {
                    $uploaded_media[] = [
                        'type' => 'image',
                        'url' => 'images/projects/' . $folder_name . '/' . $new_filename
                    ];
                }
            }
        }
    }
    return $uploaded_media;
}
?>