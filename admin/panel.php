<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: index.php');
    exit;
}

$projects_file = '../projects.json';
$projects = [];
if (file_exists($projects_file)) {
    $projects_data = json_decode(file_get_contents($projects_file), true);
    if (is_array($projects_data)) {
        usort($projects_data, function($a, $b) {
            return ($b['id'] ?? 0) <=> ($a['id'] ?? 0);
        });
        $projects = $projects_data;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - GBS Renovations</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="admin-container">
        <header class="admin-header">
            <h1>Panel de Administración</h1>
            <p>GBS Renovations LLC</p>
        </header>

        <main class="admin-main">
            <div class="card">
                <form action="upload.php" method="post" enctype="multipart/form-data">
                    <h2 class="card-title">Crear o Actualizar Proyectos</h2>
                    
                    <div class="tabs">
                        <input type="radio" id="tab_new" name="action_tab" value="new" checked>
                        <label for="tab_new" class="tab-button">Nuevo Proyecto</label>
                        
                        <input type="radio" id="tab_existing" name="action_tab" value="existing">
                        <label for="tab_existing" class="tab-button">Añadir a Existente</label>
                    </div>

                    <div class="tab-content" id="new_project_content">
                        <div class="form-group">
                            <label for="title">Título del Proyecto:</label>
                            <input type="text" id="title" name="title" placeholder="Ej: Remodelación de Cocina Moderna">
                        </div>
                        <div class="form-group">
                            <label for="category">Categoría:</label>
                            <select id="category" name="category">
                                <option value="Deck, Siding & Windows">Deck, Siding & Windows</option>
                                <option value="Kitchen & Bathroom">Kitchen & Bathroom</option>
                                <option value="Repairs & Installation">Repairs & Installation</option>
                                <option value="Painting & Finishing">Painting & Finishing</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="description">Descripción:</label>
                            <textarea id="description" name="description" rows="4" placeholder="Describe el proyecto..."></textarea>
                        </div>
                    </div>

                    <div class="tab-content" id="existing_project_content" style="display:none;">
                        <div class="form-group">
                            <label for="project_id">Selecciona un Proyecto:</label>
                            <select id="project_id" name="project_id">
                                <?php foreach ($projects as $project): ?>
                                    <option value="<?php echo htmlspecialchars($project['id']); ?>"><?php echo htmlspecialchars($project['title']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group file-upload-area">
                        <label for="files">Añadir Imágenes</label>
                        <input type="file" id="files" name="files[]" multiple required>
                        <small>Puedes seleccionar varios archivos a la vez.</small>
                    </div>

                    <button type="submit" class="button-primary">Guardar Cambios</button>
                </form>
            </div>

            <div class="card">
                <form action="delete.php" method="post" onsubmit="return confirmAction();">
                    <h2 class="card-title">Eliminar Contenido</h2>
                    <div class="form-group">
                        <label for="delete_project_id">Selecciona un Proyecto:</label>
                        <select id="delete_project_id" name="project_id">
                            <option value="">-- Elige un proyecto --</option>
                            <?php foreach ($projects as $project): ?>
                                <option value="<?php echo htmlspecialchars($project['id']); ?>"><?php echo htmlspecialchars($project['title']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div id="delete_options_container" style="display:none;">
                        <div id="images_list_container">
                            <label>Imágenes a Eliminar:</label>
                            <div id="images_list"></div>
                            <button type="submit" name="delete_type" value="images" class="button-secondary">Eliminar Imágenes Seleccionadas</button>
                        </div>
                        <div class="danger-zone">
                            <label>Zona de Peligro</label>
                            <button type="submit" name="delete_type" value="project" class="button-danger">Eliminar Proyecto Completo</button>
                            <small>Esta acción es permanente y no se puede deshacer.</small>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <script>
        const allProjectsData = <?php echo json_encode($projects); ?>;

        // Lógica de Pestañas (Tabs)
        const newTab = document.getElementById('tab_new');
        const existingTab = document.getElementById('tab_existing');
        const newContent = document.getElementById('new_project_content');
        const existingContent = document.getElementById('existing_project_content');

        newTab.addEventListener('change', () => {
            if (newTab.checked) {
                newContent.style.display = 'block';
                existingContent.style.display = 'none';
                document.querySelector('form[action="upload.php"]').dataset.action = 'new';
            }
        });

        existingTab.addEventListener('change', () => {
            if (existingTab.checked) {
                newContent.style.display = 'none';
                existingContent.style.display = 'block';
                document.querySelector('form[action="upload.php"]').dataset.action = 'existing';
            }
        });
        
        // Lógica para mostrar imágenes del proyecto a eliminar
        document.getElementById('delete_project_id').addEventListener('change', function() {
            const projectId = parseInt(this.value);
            const deleteOptions = document.getElementById('delete_options_container');
            const imagesList = document.getElementById('images_list');
            
            imagesList.innerHTML = '';
            
            if (projectId) {
                const project = allProjectsData.find(p => p.id === projectId);
                if (project && project.media.length > 0) {
                    project.media.forEach((image, index) => {
                        // Crear un ID único para el checkbox
                        const checkboxId = `img_${project.id}_${index}`;
                        imagesList.innerHTML += `
                            <div class="image-checkbox">
                                <input type="checkbox" name="images_to_delete[]" value="${image.url}" id="${checkboxId}">
                                <label for="${checkboxId}">
                                    <img src="../${image.url}" alt="Miniatura">
                                    <span>${image.url.split('/').pop()}</span>
                                </label>
                            </div>
                        `;
                    });
                } else {
                     imagesList.innerHTML = '<p class="no-images">Este proyecto no tiene imágenes.</p>';
                }
                deleteOptions.style.display = 'block';
            } else {
                deleteOptions.style.display = 'none';
            }
        });

        function confirmAction() {
            if (!document.getElementById('delete_project_id').value) {
                alert('Por favor, selecciona un proyecto.');
                return false;
            }
            return confirm('¿Estás seguro? Esta acción no se puede deshacer.');
        }
    </script>
</body>
</html>