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
                let date = format.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
                date += '<br>';
                date += format.toLocaleDateString('es-ES', { day: 'numeric' });
                $(this).next(value).html(`${date}`);

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
        let date = format.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
        date += '<br>';
        date += format.toLocaleDateString('es-ES', { day: 'numeric' });
        $('#daily-cases-value').html(`${date}`);
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
                            ${item.active}
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

    populateWoldList(countries) {
        countries.forEach(item => {
            let ul = document.getElementById("countries");
            let el = document.createElement('li');
            let name = `${item.name}`;
            let string = [];
            if (item.recovered) { string.push(`${item.recovered} Recuperados`) }
            if (item.deaths) { string.push(`${item.deaths} Fallecidos`) }
            el.innerHTML = `<a href="#">${name}</a>
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

    }

};








