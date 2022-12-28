//Seleccion de inputs del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefotoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//seleccion formulario
const formulario = document.querySelector('#nueva-cita');

//seleccion div para las citas
const contenedorCitas = document.querySelector('#citas');

let editando;


//Vamos a crear 2 clases, una se encargará de las crear, borrar y actualizar las citas y la otra se encargara de mostrar todo eso en la interfaz
class Citas {
    constructor() {
        this.citas = [];
    }

    //para agregar una cita, le pasamos la cita y le decimos que todas las citas van a ser todas las citas mas la cita
    agregarCita(cita) {
        this.citas = [...this.citas, cita]
        console.log(this.citas)
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }

}

class UI {
    imprimirAlerta(mensaje, tipo) {
        //crear div para la alerta
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clase en base al tipo de error
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success')
        }

        //mensaje de error
        divMensaje.textContent = mensaje;

        //agregar al dom
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //quitar la alerta
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

    imprimirCitas({ citas }) {

        this.limpiarHTML();

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            //scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">hora: </span> ${hora}`;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">sintomas: </span> ${sintomas}`;

            //Boton para eliminar las citas
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

            //Boton para editar las citas;
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info', 'mr-2');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>`;


            btnEliminar.onclick = () => eliminarCita(id);
            btnEditar.onclick = () => cargarEdicion(cita);

            //Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    //este es el metodo que esta casi siempre por que al añadir con append child se duplicarían los registros
    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

//las vamos intanciar de forma global por que se va usar en diferentes lugares
const ui = new UI();
const administrarCitas = new Citas();

//Event Listeners
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefotoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

//Vamos a crear un objeto para ir almacenando todos los datos de las citas
const citaObj = {
    mascota: '',
    propiertario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

//Agrega datos al objeto de citaObj
function datosCita(e) {
    //esto no funcionaria sin los corchetes
    citaObj[e.target.name] = e.target.value;
    console.log(citaObj)
}

//validar y agregar nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();

    //extraer la informacion del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    //validad cada uno de los campos
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if (editando) {
        ui.imprimirAlerta('cita editada con éxito');

        //pasar el objeto de la cita a edicion
        administrarCitas.editarCita({...citaObj})

        //Restablecer el texto del botón
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        //quitar modo de edicion
        editando = false;

    } else {
        //generar un id para que se puedan editar o eliminar
        citaObj.id = Date.now();

        //creando una nueva cita
        //aqui surgio un problema por que se estaba pasando citaObj del objeto global, entonces hacia que todas las citas fueran iguales, para arreglarlo hay que mandar una copia de los datos del objeto con {...citaobj}
        administrarCitas.agregarCita({ ...citaObj });

        //Mensaje de agregado correctamente
        ui.imprimirAlerta('Cita añadida con éxito');
    }


    //Reiniciar el objeto para la validación
    reiniciarObjeto();

    //resetear el formulario
    formulario.reset();

    //mostar el html de las citas
    ui.imprimirCitas(administrarCitas);
}

//Con solo reiniciar el formulario no es suficiente, por que el objeto que se esta creando a tiempo real con los datos seguiria lleno, entonces asignamos a cada propiedad un string vacio
function reiniciarObjeto() {
    citaObj.mascota = '',
        citaObj.propiertario = '',
        citaObj.telefono = '',
        citaObj.fecha = '',
        citaObj.hora = '',
        citaObj.sintomas = ''

}

function eliminarCita(id) {
    //Eliminar cita
    administrarCitas.eliminarCita(id);

    //mostar mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');

    //actualizar citas
    ui.imprimirCitas(administrarCitas);
}

//carga los datos y el modo edicion
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //llenar los inputs con estos datos
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefotoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propiertario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // CAmbiar el texto del boton de crear a actualizar
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;

}