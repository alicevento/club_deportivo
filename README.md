# Club Deportivo Discipline Spa

El Club Deportivo Discipline Spa está haciendo negocios con una empresa de software para
la construcción de su aplicación para control interno que se conecte con la misma base de
datos de su sitio web. Su requerimiento principal es poder registrar, ver, editar y eliminar los
deportes que ofrecen en sus sucursales

## Instalación

Para instalar las dependencias necesarias, ejecuta el siguiente comando: 

npm install

## Uso

El proyecto proporciona las siguientes funcionalidades:

# Agregar un nuevo deporte
Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON y valide en el backend que se reciben los parámetros necesarios o requeridos, y en el tipo adecuado. Además, debe validarse que no se repitan los nombres de los deportes. Esta ruta se maneja con queryStrings.

// Ejemplo de cómo utilizar la ruta de agregar un nuevo deporte
axios.get(`/agregar?nombre=${nombre}&precio=${precio}`).then((data) => {
  alert(data.data);
  getData();
});

# Consultar todos los deportes registrados
Crear una ruta que al consultarse devuelva en formato JSON todos los deportes registrados.

// Ejemplo de cómo consultar todos los deportes registrados
axios.get('/deportes').then((data) => {
  let deportes = data.data.deportes;
  // Manejo de la respuesta
});

# Editar el precio de un deporte
Crear una ruta que edite el precio de un deporte registrado, utilizando los parámetros de la consulta y persista este cambio. Se debe validar que se reciba el parámetro y que exista el deporte coincidente con el parámetro. Esta ruta se maneja con queryStrings.

// Ejemplo de cómo utilizar la ruta de editar el precio de un deporte
axios.get(`/editar?nombre=${nombre}&precio=${precio}`).then((data) => {
  alert(data.data);
  getData();
});

# Eliminar un deporte
Crear una ruta que elimine un deporte solicitado desde el cliente y persista este cambio. Se debe validar que se recibe el parámetro requerido y que existe el deporte solicitado. Esta ruta se maneja utilizando parámetros no queryStrings.

// Ejemplo de cómo eliminar un deporte
axios.delete(`/eliminar/${nombre}`).then((data) => {
  alert(data.data);
  getData();
});


