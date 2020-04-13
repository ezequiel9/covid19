export default{
    animateValue(id, start, end, duration) {
        // assumes integer values for start and end

        let obj = document.getElementById(id);
        let range = end - start;
        // no timer shorter than 50ms (not really visible any way)
        let minTimer = 50;
        // calc step time to show all interediate values
        let stepTime = Math.abs(Math.floor(duration / range));

        // never go below minTimer
        stepTime = Math.max(stepTime, minTimer);

        // get current time and calculate desired end time
        let startTime = new Date().getTime();
        let endTime = startTime + duration;
        let timer;

        function run() {
            let now = new Date().getTime();
            let remaining = Math.max((endTime - now) / duration, 0);
            let value = Math.round(end - (remaining * range));
            obj.innerHTML = value;
            if (value == end) {
                clearInterval(timer);
            }
        }

        timer = setInterval(run, stepTime);
        run();
    },

    rangeSlider(timeLine){

        let keys = Object.keys(timeLine);
        let count = keys.length;
        let slider = $('.range-slider'),
            range = $('.range-slider__range'),
            value = $('.range-slider__value');

        slider.each(function(){

            value.each(function(){
                let value = $(this).prev().attr('value');
                $(this).html(value);
            });

            range.on('input', function(){
                let format = new Date(keys[this.value]);
                let date = '<span class="date">'+format.toLocaleDateString('es-ES', { day: 'numeric' })+'</span>';
                date += '<span class="month">'+format.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()+'</span>';
                $(this).next(value).html(date);

                // Update markers
                Object.values(timeLine[keys[this.value]]).forEach((item) => {
                    let provinceMarker = `.province-marker#${item.province.slug}`;
                    if ($(provinceMarker)) {
                        if (parseInt(item.cases) > 0) {
                            $(provinceMarker).fadeIn();
                        } else {
                            $(provinceMarker).fadeOut();
                        }
                        $(provinceMarker).find('text').html(item.cases);
                    }
                })

            });
        });


        $('#daily-cases').prop('max', count-1).val(count-1);
        let format = new Date(keys[count-1]);
        let date = '<span class="date">'+format.toLocaleDateString('es-ES', { day: 'numeric' })+'</span>';
        date += '<span class="month">'+format.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()+'</span>';
        $('#daily-cases-value').html(date);
    },

    populateProvinceList(provinces) {
        provinces.forEach(item => {
            let ul = document.getElementById("provinces");
            let el = document.createElement('li');
            let name = item.province.name;

            let extra = '';
            if  (item.province.name === 'Sin Asignar') {
                extra = `<span class="recovered" title="Total recuperados | ${name}">
                            <img src="./images/users-recovered.svg" alt="Total recuperados | ${name}">
                            ${item.recovered}
                        </span> /`;
            }

            el.innerHTML = `<a href="#">${name}</a>
                    <div class="results">
                        <span class="confirmed" title="Casos confirmados | ${name}">
                            <img src="./images/users-confirmed.svg" alt="Casos confirmados | ${name}">
                            ${item.cases}
                        </span> / 
                        ${extra}
                        <span class="deaths" title="Total Fallecidos | ${name}">
                            <img src="./images/users-deaths.svg" alt="Total Fallecidos | ${name}">
                            ${item.death}
                        </span>
                    </div>
                `;
            ul.appendChild(el);
        })
    },

    populateWoldList(countries, map) {
        countries.forEach(item => {
            let ul = document.getElementById("countries");
            let el = document.createElement('li');
            let name = `${item.name}`;
            let string = [];
            if (item.recovered) { string.push(`${item.recovered} Recuperados`) }
            if (item.deaths) { string.push(`${item.deaths} Fallecidos`) }
            el.innerHTML = `<a href="#" data-lat="${item.lat}" data-lng="${item.lng}">${name}</a>
                    <div class="results">
                        <span class="confirmed" title="Casos confirmados | ${name}">
                            <img src="./images/users-confirmed.svg" alt="Casos confirmados | ${name}">
                            ${item.confirmed}
                        </span>  / 
                        <span class="recovered" title="Total recuperados | ${name}">
                            <img src="./images/users-recovered.svg" alt="Total recuperados | ${name}">
                            ${item.recovered}
                        </span> / 
                        <span class="deaths" title="Total Fallecidos | ${name}">
                            <img src="./images/users-deaths.svg" alt="Total Fallecidos | ${name}">
                            ${item.deaths}
                        </span>
                    </div>
                `;
            ul.appendChild(el);
        })

        this.filterSearchCountry();


        $(document).on('click', '#countries li', function (e) {
            e.preventDefault();
            let lat = $(this).find('a').attr('data-lat');
            let lng = $(this).find('a').attr('data-lng');
            map.panTo(new L.LatLng(lat, lng));
        })
    },


    filterSearchCountry () {
        $(document).on('keyup', 'input[type="search"]', function (e) {
            let input, filter, ul, li, a, i, txtValue;
            input = $(this);
            filter = input.val().toUpperCase();
            ul = $(this).siblings('ul');
            li = ul.find('li');
            for (i = 0; i < li.length; i++) {
                a = li[i].getElementsByTagName("a")[0];
                console.log('LOG', a);
                txtValue = a.textContent || a.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        });

    },


    populateCards (data) {
        this.animateValue("confirmed", 0, data.total_cases, 2500);
        this.animateValue("recovered", 0, data.total_recovered, 2500);
        this.animateValue("deaths", 0, data.total_death, 2500);
        this.animateValue("fatality", 0, ((data.total_death / data.total_cases) * 100).toFixed(2), 2500);
        this.animateValue("recovered-p", 0, ((data.total_recovered / data.total_cases) * 100).toFixed(2), 2500);

        let today = data.world_history[0];
        let yesterday = data.world_history[1];
        if (today.is_in_progress) {
            today = data.world_history[1];
            yesterday = data.world_history[2];
        }

        if (today.new_confirmed > yesterday.new_confirmed) {
            $('#world-cases').closest('.card').addClass('up yellow')
        } else {
            $('#world-cases').closest('.card').addClass('down green')
        }
        this.animateValue("world-cases", 0, data.world_total_cases, 2500);

        if (today.new_recovered > yesterday.new_recovered) {
            $('#world-recovered').closest('.card').addClass('up green')
        } else {
            $('#world-recovered').closest('.card').addClass('down yellow')
        }
        this.animateValue("world-recovered", 0, data.world_total_recovered, 2500);

        if (today.new_deaths > yesterday.new_deaths) {
            $('#world-deaths').closest('.card').addClass('up red')
        } else {
            $('#world-deaths').closest('.card').addClass('down green')
        }
        this.animateValue("world-deaths", 0, data.world_total_death, 2500);

        this.animateValue("world-fatalities", 0, ((data.world_total_death / data.world_total_cases) * 100).toFixed(2), 2500);
        this.animateValue("world-recovered-p", 0, ((data.world_total_recovered / data.world_total_cases) * 100).toFixed(2), 2500);

        /**
         * Build chart
         */
        let maxConfirmed = Math.max.apply(Math, data.world_history.map(function(o) {
            return o.confirmed;
        }));
        let valueRepresentative;
        let chartTemplate = '';

        data.world_history.reverse().forEach( (day) => {
            if (day.confirmed) {
                valueRepresentative = (day.confirmed * 100) / maxConfirmed;
                chartTemplate += `<span style="height: ${valueRepresentative}%;" title="Confirmados Global" class="bars"></span>`;
            }
        });
        $('.statics').append(`<div class="growth-cases">${chartTemplate}</div>`);

        chartTemplate = '';
        data.world_history.forEach( (day) => {
            if (day.recovered) {
                valueRepresentative = (day.recovered * 100) / maxConfirmed;
                chartTemplate += `<span style="height: ${valueRepresentative}%;" title="Recuperados Global" class="bars"></span>`;
            }
        });
        $('.statics').append(`<div class="growth-recovered">${chartTemplate}</div>`);

    }

};








