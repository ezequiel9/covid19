# Covid19-Argentina

[![N|Solid](https://ezequielfernandez.com/covid-19logo.png)](https://ezequielfernandez.com/covid-19logo.png)

Covid19 Argentina es es un website en el cual se muestra un mapa con los casos de coronavirus y algunos otros graficos mas.

  - Mapa Argentina por provincias
  - Mapa Mundial con informacion actualizada
  - Graficos

Puedes tambien:
  - Colaborar ya sea con codigo para una nueva funcionalidad
  - Colaborar con Datos mas precisos.
  - Ver listado historico por provincias
  - Usar La api creada para este fin
  

> La colaboración intelectual entre dos individuos puede producir una fusión entre ambas esferas de conciencia de un grado tan increíble que lleguen incluso a fundirse dando una unidad empírica

### API

Algunos endpoints creados

**Info Argentina y Resto del mundo**
```
https://api.covid19argentina.com/api/argentina/daily
```
**Informacion diaria del mundo**
```
https://api.covid19argentina.com/api/countries
```
**Informacion diaria historica de casos en Argentina** 
```
https://api.covid19argentina.com/api/argentina/daily
```
**Google Docs to get data :)**
```
https://docs.google.com/spreadsheets/d/1zkAkSkvgA3xKR1Ry99PssfqMO2XtbkyZKXJ3A7X6iPQ/edit#gid=0
```

### Instalar Proyecto

Covid19 Argentina requires [Node.js](https://nodejs.org/) +JS y PHP para funcionar. No es necesario DB

Install the dependencies and devDependencies and start the server.

```
Set /public as public...
Clone repository.
```

```sh
$ npm install
$ npm run watch
```

To push...

```sh
$ npm run prod
```

```
Commit and push
```

### Plugins

Covid19 usa Leaftlet como mapa base y mosaicos opensource de otros colaboradores.

| Plugin | README |
| ------ | ------ |
| Sass | Used to compile css |
| jQuery | https://jquery.com/ |
| Javascript | Si bien el sistema usa PHP, es solo para incluir partials, El sitio usa JS. |
| Leaftlet Maps | https://leafletjs.com/ |
| Gsap | https://greensock.com/gsap/
| Goggle Drive | To get data from Google docs api to covid api |
| Google Analytics | For tracking data


### Development

Queres contribuir? Genial!

Covid19 usa Webpack (Laravel mix) para compilar el js. 
No tengo npm en el servidor, razon por la cual he puesto los archivos compilados en git.


### Todos

 - Agregar localidades...

License
----

MIT



