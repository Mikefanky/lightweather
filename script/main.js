var map;
function initMap(lat,lon) {
    if(lat == undefined && lon == undefined)
        var lat = 50.449218,lon = 30.525824;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: lon},
    zoom: 8
  });
}
var days = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб",];
$(document).ready(function(){
    $(".btn").click(function(){
        $('.day').remove();
        $('.item').remove();
        var city = $("#search").val();
        if(city){
        $.ajax({
            url:'http://api.openweathermap.org/data/2.5/forecast?q=' + city +
            "&appid=e6980ce720b2ebbb8d9d1d9a24796c41",
            type:"GET",
        }).done(function(data){
            var item = $('.item_template').clone();
            item.removeClass('item_template');
            item.addClass('item');
            item.find('.time').append(data.list[0].dt_txt);
            item.find('img').attr('src','https://openweathermap.org/img/w/'+data.list[0].weather[0].icon+'.png');
            item.find('.pressure').append(Math.ceil(data.list[0].main.pressure*0.00750063755419211*100));
            item.find('.humidity').append(data.list[0].main.humidity);
            item.find('.temp').append(Math.floor(data.list[0].main.temp-273));
            $('.weather').append(item);
             var day = $('.template').clone();
            day.removeClass('template');
            day.addClass('day');
            day.html(days[parseTime(data.list[0].dt,"day")]);
            day.attr('data-id',parseTime(data.list[0].dt,"delta_time"));
            $('.days').append(day);
            var old = parseTime(data.list[0].dt,"delta_time");
            for(i in data.list){
                if(parseTime(data.list[i].dt,"delta_time") != old){
                    var day = $('.template').clone();
                    day.removeClass('template');
                    day.addClass('day');
                    day.html(days[parseTime(data.list[i].dt,"day")]);
                    day.attr('data-id',parseTime(data.list[i].dt,"delta_time"));
                    $('.days').append(day);
                    old = parseTime(data.list[i].dt,"delta_time");
                }
            }
            $('.day').click(function(){
                
                $('.item').remove();
                var id = $(this).attr('data-id');
                for(i in data.list){
                    if(id == parseTime(data.list[i].dt,"delta_time")){
                        var item = $('.template').clone();
                        item.removeClass('template');
                        item.addClass('item');
                        item.find('.time').append(data.list[i].dt_txt);
                        item.find('img').attr('src','https://openweathermap.org/img/w/'+data.list[i].weather[0].icon+'.png');
                        item.find('.pressure').append(Math.ceil(data.list[i].main.pressure*0.00750063755419211*100));
                        item.find('.humidity').append(data.list[i].main.humidity);
                        item.find('.temp').append(Math.floor(data.list[i].main.temp-273));
                        $('.weather').append(item);
                    }
                }
            })
        initMap(data.city.coord.lat, data.city.coord.lon, data.city.name);
        }).fail(function(err){
            if(err.status==404){
                alert("Ввели не правильный город");
            }
            else if(err.status==400){
                alert("bad request");
            }    
        });
    }
    else{
        alert("Незаполненные поля");
    }
    }); 
});
function parseTime(dt,status){
    switch(status){
        case "delta_time":
            var day = new Date(dt*1000).getUTCDate();
            var month = new Date(dt*1000).getMonth();
            return day + "-" + month; 
        break;

        case "day":
            return day = new Date(dt*1000).getDay();
        break;
    }
}