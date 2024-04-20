//Crear  una  ruta  que  reciba  el  nombre  y  precio  de  un  nuevo  deporte,  lo  persista  en  un archivo JSON. Validar  en  el  backend  que  se  reciben  los  parámetros  necesarios  o  requeridos  y  en  el tipo  adecuado,  debe validarse  que  no  se  repitan  los  nombres  de  los  deportes.  Manejar  esta  ruta con queryStrings.

const express = require("express");
const fs = require("fs");
const app = express();
const _ = require("lodash");
const PORT = 3000;

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

//Middleware
app.use(express.json());
app.use(express.static("index.html"));

// Ruta raiz para html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Ruta /agregar nuevo deporte
app.get("/agregar", (req, res) => {
  // Se extraen parámetros de la URL
  const { nombre, precio } = req.query;
  // Manejo de error si falta alguno de los parámetros
  if (!nombre || !precio || isNaN(parseFloat(precio))) {
    return res.status(500).json({
      error:
        "Ups! debes agregar todos los campos: nombre y/o precio. Ten en cuenta que precio debe ser sólo números",
    });
  }

  // Verificar si el archivo JSON de deportes existe
  if (!fs.existsSync("deportes.json")) {
    // Si no existe, inicializar el archivo con un arreglo vacío
    fs.writeFileSync("deportes.json", "[]", "utf8");
  }

  // Leer el archivo JSON de deportes
  let deportes = [];
  try {
    deportes = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
  } catch (error) {
    console.error("Error al leer el archivo de deportes JSON: ", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }

  // Validar que no se repita el nombre del deporte
  if (deportes.find((deporte) => deporte.nombre === nombre)) {
    return res.status(400).json({
      error: "Ya existe un deporte con ese nombre",
    });
  }

  // Agregar el nuevo deporte al arreglo
  deportes.push({ nombre, precio: parseFloat(precio) });

  // Escribir el arreglo actualizado en el archivo JSON
  fs.writeFile("deportes.json", JSON.stringify(deportes), (err) => {
    if (err) {
      console.error("Error al escribir en el archivo de deportes JSON:", err);
      return res.status(500).json({
        error: "Error interno del servidor",
      });
    }
    console.log("Deporte agregado con éxito");
    // Devolver un mensaje de éxito
    res.send("Deporte agregado con éxito");
  });
});

// Ruta que al consultarse devuelva en formato JSON todos los deportes registrados
app.get("/deportes", (req, res) => {
  // Verificar si el archivo JSON de deportes existe
  if (!fs.existsSync("deportes.json")) {
    // Si no existe, inicializar el archivo con un arreglo vacío
    fs.writeFileSync("deportes.json", "[]", "utf8");
  }

  // Leer el archivo JSON de deportes
  let deportes = [];
  try {
    deportes = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
  } catch (error) {
    console.error("Error al leer el archivo de deportes JSON: ", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
  //usar lodash para ordenar el archivo json por la consola
  deportes = _.orderBy(deportes, ["nombre"], ["asc"]);

  
  // Enviar la lista de deportes en formato JSON como respuesta
  console.log(deportes);
  res.send({ deportes });
});

// Ruta  que  edite  el  precio  de  un  deporte  registrado,  utilizando  los  parámetros  de la consulta y persista este cambio. Recuerde que para modificar se debe consultar, por tanto,  hay  que  validar  2  cosas  primero  que  se  reciba  el  parámetro  y  después  que  exista  el  deporte coincidente con el parámetro. Manejar esta ruta con queryStrings.

// Ruta /editar para editar el precio de un deporte
app.get("/modificar", (req, res) => {
  const { nombre, precio } = req.query;

  // Verificar el nombre y precio
  if (!nombre || !precio) {
    return res.send(
      "Ingrese nombre del deporte para editar su valor, o todos los parámetros correspondientes"
    );
  }

  // Verificar si el precio es un número
  if (isNaN(parseFloat(precio))) {
    return res.send("El precio debe ser un número válido");
  }

  // Leer el archivo de deportes.json
  fs.readFile("deportes.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error interno del servidor");
    }
    let deportes = JSON.parse(data);

    // Busca el deporte y actualiza el valor
    const index = deportes.findIndex((deporte) => deporte.nombre === nombre);
    if (index === -1) {
      return res.send("No existe ningún deporte con ese nombre");
    }
    deportes[index].precio = parseFloat(precio); // Convertir el precio a número
    fs.writeFile("deportes.json", JSON.stringify(deportes), (err) => {
      //guarda el valor
      if (err) {
        console.error(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.send(`El precio del deporte ${nombre} se actualizó a ${precio}.`);
    });
  });
});

//Crear una ruta que elimine un deporte solicitado desde el cliente y persista este cambio. En el  Backend  Validar  que  se  recibe  el  parámetro  requerido,  también  validar  después  si  existe  el  deporte solicitado y solo si existe  se podrá eliminar. Manejar esta ruta utilizando parámetros no queryStrings, ojo, que esto requiere un pequeño cambio en el Front.
//Para probar en el thunder client: DELETE
// Crear una ruta para eliminar un deporte
// Ruta para eliminar un deporte (utilizando GET)
app.get("/eliminar/:nombreDeporte", (req, res) => {
    const nombreDeporte = req.params.nombreDeporte;
  
    // Validar si se recibió el parámetro requerido
    if (!nombreDeporte) {
      return res.status(400).json({
        error: "Debe proporcionar el nombre del deporte a eliminar",
      });
    }
  
    // Leer el archivo JSON de deportes
    fs.readFile("deportes.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Error interno del servidor al leer el archivo de deportes",
        });
      }
  
      let deportes = JSON.parse(data);
  
      // Buscar el deporte en la lista
      const buscarDeporte = deportes.findIndex(
        (deporte) => deporte.nombre === nombreDeporte
      );
  
      // Verificar si se encontró el deporte
      if (buscarDeporte === -1) {
        return res.status(404).json({
          error: `El deporte '${nombreDeporte}' no se encontró en la lista`,
        });
      }
  
      // Eliminar el deporte de la lista
      deportes.splice(buscarDeporte, 1);
  
      // Escribir el arreglo actualizado en el archivo JSON
      fs.writeFile("deportes.json", JSON.stringify(deportes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            error: "Error interno del servidor al escribir en el archivo de deportes",
          });
        }
  
        // Devolver un mensaje de éxito
        res.send(`El deporte '${nombreDeporte}' se eliminó correctamente`);
      });
    });
  });
  

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).send("Ruta no encontrada");
});
