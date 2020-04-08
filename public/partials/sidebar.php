<div id="topbar">
    <div class="title">
        COVID19 - AR
    </div>
    <div class="menu-opener">
        <svg class="lnr lnr-menu">
            <use xlink:href="#lnr-menu"></use>
        </svg>
        Menu
    </div>
</div>

<div class="sidebar">
    <div class="controls">
        <div class="item active" id="home">
            <img src="/images/home.svg" alt="">
            Home
        </div>
        <div class="item" id="argentina">
            <img src="/images/argentina.svg" alt="">
            Argentina
        </div>
        <div class="item" id="world">
            <img src="/images/world.svg" alt="">
            World
        </div>
    </div>
    <div class="sidebar-inner">
        <div class="content home active">
            <div class="header">
                <h1>COVID19 - AR</h1>
            </div>
            <div class="sub-header">
                <div class="cases"><img src="./images/users-confirmed.svg" alt="Total Fallecidos | Argentina"> <span id="total-cases">0</span> /</div>
                <div class="death"><img src="./images/users-deaths.svg" alt="Total Fallecidos | Argentina"> <span id="total-death">0</span> /</div>
                <div class="recovered"><img src="./images/users-recovered.svg" alt="Total Fallecidos | Argentina"> <span id="total-recovered">0</span></div>
            </div>
            <div class="extra-information">
                <div class="fuente">
                    Ultima actualización a las <strong><span id="updated-at"></span></strong>
                </div>
                <br>
                <div class="fuente">
                    Datos obtenidos desde el <a href="https://www.argentina.gob.ar/salud/coronavirus-COVID-19" target="_blank">
                        Ministerio de Salud de la República Argentina
                    </a> entre otras fuentes periodísticas debido a que la información no es totalmente clara.
                </div>
                <br>
                <strong>Sitio no oficial.</strong>
                <br>
                Si crees que podes ayudarme con código o con datos mas precisos, no dudes ne contactarme! :)

            </div>
            <div class="phones-container">
                <div class="phone">
                    <a href="tel:08002221002">0800-222-1002</a>
                    0800 Salud Responde, opción 1. Teléfono gratuito para llamados desde todo el país.
                </div>
                <div class="phone">
                    <a href="tel:134">134</a>
                    Para denunciar a quienes violen la cuarentena, comunicate con el Ministerio de Seguridad al número
                    gratuito 134.
                </div>
            </div>

            <div class="contributors">
                Creado por: <br>
                <a href="https://ezequielfernandez.com">www.ezequielfernandez.com</a> <br>
                <a href="https://www.linkedin.com/in/ezequiel9/">Linkedin</a> <br><br>
                Contribuyen con información: <br>
                <a href="https://www.linkedin.com/company/sistemas-mapache/">Sistemas Mapache</a> <br><br>
            </div>

        </div>
        <div class="content argentina">
            <div class="header">
                <h1>Por Provincias</h1>
            </div>
            <div class="list-container">
                <ul id="provinces">
                </ul>
            </div>
        </div>
        <div class="content world">
            <div class="header">
                <h1>Resto del Mundo</h1>
            </div>
            <div class="list-container">
                <input type="search" placeholder="Filtrar por...">
                <ul id="countries">
                </ul>
            </div>
        </div>

    </div>
</div>
