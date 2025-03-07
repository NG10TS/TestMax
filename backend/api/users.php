<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

include "../db.php";

$method = $_SERVER["REQUEST_METHOD"];

try {
    if ($method === "GET") { // Obtener todos los usuarios
        $stmt = $pdo->query("SELECT * FROM users");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if ($method === "POST") { // Crear un nuevo usuario
        if (empty($data["titulo"]) || empty($data["descripcion"]) || empty($data["valor"]) || 
            empty($data["email"]) || empty($data["url_referencia"]) || empty($data["fecha_creacion"]) || 
            empty($data["usuario_creador"])) {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            http_response_code(400);
            exit();
        }

        $stmt = $pdo->prepare("INSERT INTO users (titulo, descripcion, valor, email, url_referencia, fecha_creacion, usuario_creador) 
                               VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data["titulo"], $data["descripcion"], $data["valor"], 
            $data["email"], $data["url_referencia"], $data["fecha_creacion"], 
            $data["usuario_creador"]
        ]);

        echo json_encode(["message" => "Usuario creado"]);
        http_response_code(201);
        exit();
    }
    if ($method === "GET") { 
        if (isset($_GET["id"])) { // Obtener un usuario por ID
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$_GET["id"]]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($usuario) {
                echo json_encode($usuario);
            } else {
                echo json_encode(["error" => "Usuario no encontrado"]);
                http_response_code(404);
            }
        } else { // Obtener todos los usuarios
            $stmt = $pdo->query("SELECT * FROM users");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        exit();
    }
    
    if ($method === "PUT" || $method === "PATCH") { // Actualizar usuario
        if (empty($data["id"]) || empty($data["titulo"]) || empty($data["descripcion"]) || empty($data["valor"]) || 
            empty($data["email"]) || empty($data["url_referencia"]) || empty($data["fecha_creacion"]) || 
            empty($data["usuario_creador"])) {
            echo json_encode(["error" => "Datos requeridos"]);
            http_response_code(400);
            exit();
        }

        $stmt = $pdo->prepare("UPDATE users SET titulo=?, descripcion=?, valor=?, email=?, url_referencia=?, fecha_creacion=?, usuario_creador=? WHERE id=?");
        $stmt->execute([
            $data["titulo"], $data["descripcion"], $data["valor"], 
            $data["email"], $data["url_referencia"], $data["fecha_creacion"], 
            $data["usuario_creador"], $data["id"]
        ]);

        echo json_encode(["message" => "Usuario actualizado"]);
        exit();
    }

    if ($method === "DELETE") { // Eliminar usuario
        if (empty($data["id"])) {
            echo json_encode(["error" => "ID requerido"]);
            http_response_code(400);
            exit();
        }

        $stmt = $pdo->prepare("DELETE FROM users WHERE id=?");
        $stmt->execute([$data["id"]]);

        echo json_encode(["message" => "Usuario eliminado"]);
        exit();
    }

    echo json_encode(["error" => "Método no permitido"]);
    http_response_code(405);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la base de datos: " . $e->getMessage()]);
    http_response_code(500);
}
?>
