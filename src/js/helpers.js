export default {

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
                let options = { month: 'short', day: 'numeric' };
                let format = new Date(keys[this.value]);
                let date = format.toLocaleDateString('es-ES', options);
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
        let options = { month: 'short', day: 'numeric' };
        let format = new Date(keys[count-1])
        let date = format.toLocaleDateString('es-ES', options);
        $('#daily-cases-value').html(`${date}`);
    }

};








