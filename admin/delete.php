<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: index.php');
    exit;
}

$projects_file = '../projects.json';

function display_message($title, $message, $is_error = false) {
    echo '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>' . htmlspecialchars($title) . '</title><link rel="stylesheet" href="style.css"></head><body>';
    echo '<div class="admin-panel">';
    echo '<h1>' . htmlspecialchars($title) . '</h1>';
    echo '<p class="' . ($is_error ? 'error' : '') . '">' . htmlspecialchars($message) . '</p>';
    echo '<a href="panel.php" class="button">Volver al Panel</a>';
    echo '</div></body></html>';
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido.");
    }

    $projects = json_decode(file_get_contents($projects_file), true);
    if ($projects === null) {
        throw new Exception("Error al leer el archivo projects.json.");
    }
    
    $project_id = (int)($_POST['project_id'] ?? 0);
    $delete_type = $_POST['delete_type'] ?? '';

    if ($project_id <= 0) {
        throw new Exception("ID de proyecto no válido.");
    }

    $project_index = array_search($project_id, array_column($projects, 'id'));
    if ($project_index === false) {
        throw new Exception("Proyecto no encontrado.");
    }

    if ($delete_type === 'project') {
        // --- ELIMINAR PROYECTO COMPLETO ---
        $project_to_delete = $projects[$project_index];
        foreach ($project_to_delete['media'] as $media_item) {
            $file_path = '../' . $media_item['url'];
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }
        
        // Eliminar la carpeta del proyecto si está vacía
        $folder_path = dirname('../' . $project_to_delete['media'][0]['url']);
        if (is_dir($folder_path) && count(scandir($folder_path)) == 2) {
             rmdir($folder_path);
        }

        array_splice($projects, $project_index, 1);
        $message = "El proyecto completo ha sido eliminado.";

    } elseif ($delete_type === 'images') {
        // --- ELIMINAR IMÁGENES SELECCIONADAS ---
        $images_to_delete = $_POST['images_to_delete'] ?? [];
        if (empty($images_to_delete)) {
            throw new Exception("No se seleccionaron imágenes para eliminar.");
        }

        $media = $projects[$project_index]['media'];
        $new_media = [];
        
        foreach ($media as $media_item) {
            if (in_array($media_item['url'], $images_to_delete)) {
                $file_path = '../' . $media_item['url'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
            } else {
                $new_media[] = $media_item;
            }
        }
        
        $projects[$project_index]['media'] = $new_media;
        
        // Actualizar thumbnail si ya no quedan imágenes o si se eliminó el thumbnail
        if (empty($new_media)) {
            $projects[$project_index]['thumbnailUrl'] = '';
        } else {
             $projects[$project_index]['thumbnailUrl'] = end($new_media)['url'];
        }

        $message = "Las imágenes seleccionadas han sido eliminadas.";

    } else {
        throw new Exception("Tipo de eliminación no válida.");
    }

    if (file_put_contents($projects_file, json_encode($projects, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))) {
        display_message('¡Éxito!', $message);
    } else {
        throw new Exception("No se pudo escribir en el archivo projects.json.");
    }

} catch (Exception $e) {
    display_message('Error', $e->getMessage(), true);
}
?>