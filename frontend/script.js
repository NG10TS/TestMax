const API_URL = "http://localhost:8000/api/users.php"; // Ruta de la API PHP

// Obtener y mostrar los usuarios en la página
async function obtenerUsuarios() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener usuarios");

    const data = await response.json();
    const lista = document.getElementById("usuarios-lista");
    lista.innerHTML = "";

    data.forEach((user) => {
      const li = document.createElement("li");
      li.innerHTML = `${user.titulo} - ${user.descripcion} - ${user.valor} - ${user.email} - ${user.url_referencia} - ${user.fecha_creacion} - ${user.usuario_creador}
        <button onclick="editarUsuario(${user.id}, '${user.titulo}', '${user.descripcion}', '${user.valor}', '${user.email}', '${user.url_referencia}', '${user.fecha_creacion}', '${user.usuario_creador}')">✏️</button>
        <button onclick="eliminarUsuario(${user.id})">🗑️</button>`;
      lista.appendChild(li);
    });
  } catch (error) {
    alert(error.message);
  }
}
// Obtener usuarion por id
async function obtenerUsuarioPorId(id) {
  try {
    const response = await fetch(`${API_URL}?id=${id}`);
    if (!response.ok) throw new Error("Usuario no encontrado");

    const usuario = await response.json();
    console.log("Usuario encontrado:", usuario);

    // Aquí puedes mostrar los datos en el HTML o usarlos como necesites
  } catch (error) {
    console.error(error.message);
  }
}

// Agregar un nuevo usuario (POST)
async function agregarUsuario() {
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const valor = document.getElementById("valor").value.trim();
  const email = document.getElementById("email").value.trim();
  const url_referencia = document.getElementById("url_referencia").value.trim();
  const fecha_creacion = document.getElementById("fecha_creacion").value;
  const usuario_creador = document.getElementById("usuario_creador").value;

  if (
    !titulo ||
    !descripcion ||
    !valor ||
    !email ||
    !url_referencia ||
    !fecha_creacion ||
    !usuario_creador
  ) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
    alert("El email no es válido.");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        descripcion,
        valor,
        email,
        url_referencia,
        fecha_creacion,
        usuario_creador,
      }),
    });

    if (!response.ok) throw new Error("Error al agregar usuario");

    alert("Usuario agregado correctamente");
    obtenerUsuarios();
  } catch (error) {
    alert(error.message);
  }
}

// Editar un usuario (preparar formulario para actualizar)
function editarUsuario(
  id,
  titulo,
  descripcion,
  valor,
  email,
  url_referencia,
  fecha_creacion,
  usuario_creador
) {
  document.getElementById("titulo").value = titulo;
  document.getElementById("descripcion").value = descripcion;
  document.getElementById("valor").value = valor;
  document.getElementById("email").value = email;
  document.getElementById("url_referencia").value = url_referencia;
  document.getElementById("fecha_creacion").value = fecha_creacion;
  document.getElementById("usuario_creador").value = usuario_creador;

  document
    .getElementById("guardar")
    .setAttribute("onclick", `actualizarUsuario(${id})`);
}

// Actualizar usuario (PUT)
async function actualizarUsuario(id) {
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const valor = document.getElementById("valor").value;
  const email = document.getElementById("email").value;
  const url_referencia = document.getElementById("url_referencia").value;
  const fecha_creacion = document.getElementById("fecha_creacion").value;
  const usuario_creador = document.getElementById("usuario_creador").value;

  if (
    !titulo ||
    !descripcion ||
    !valor ||
    !email ||
    !url_referencia ||
    !fecha_creacion ||
    !usuario_creador
  ) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        titulo,
        descripcion,
        valor,
        email,
        url_referencia,
        fecha_creacion,
        usuario_creador,
      }),
    });

    if (!response.ok) throw new Error("Error al actualizar usuario");

    alert("Usuario actualizado correctamente");
    obtenerUsuarios();
  } catch (error) {
    alert(error.message);
  }
}

// Eliminar usuario (DELETE)
async function eliminarUsuario(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) throw new Error("Error al eliminar usuario");

    alert("Usuario eliminado correctamente");
    obtenerUsuarios();
  } catch (error) {
    alert(error.message);
  }
}
