var media_list = [];
var iframe, title, description, player; //initialize variables for global access

// wait for document to be ready then initialize variables
$(document).on('ready', function(){
    iframe = $('iframe')[0];
    title = $('#title');
    description = $('#description');
    player = new playerjs.Player(iframe);
});

//play the previous track by index
function previous(){
    var previous_id_location = iframe.dataset.previous;
    changeVideo(previous_id_location);
}

//play the next track by index
function next(){
    var next_id_location = iframe.dataset.next;
    changeVideo(next_id_location);
}

//change the video to the clicked one
function changeVideo(id){
    //make sure that the id is and integer
    var id_index = parseInt(id);
    // check if the source of the new media is the same as the current
    if (iframe.src != 'https://riipen.mediacore.tv/media/id:'+ media_list[id_index][0] + '/embed_player'){
        //check the index of the video, if it's the first make sure the previous button goes to the last video
        if (id_index > 0){
            iframe.dataset.previous = id_index - 1;
        }
        else{
            iframe.dataset.previous = media_list.length - 1;
        }
        //check the index of the video, if it's the last make sure the next button goes to the first video
        if (id_index < media_list.length-1){
            iframe.dataset.next = id_index + 1;
        }
        else{
            iframe.dataset.next = 0;
        }
        //update the source video to the new media
        iframe.src = 'https://riipen.mediacore.tv/media/id:'+ media_list[id_index][0] + '/embed_player';
        var player = new playerjs.Player(iframe);
        //make sure the player is ready and start playing
        player.on('ready', function(){
            player.play();
        });
        //make sure when the video ends, it will start the next video
        player.on('ended', function(){
            next();
        });
        //set the title and the description of the new media
        title.html('<h4>' + media_list[id_index][1] + '</h4>');
        description.html(media_list[id_index][2]);
    }
}
//call out to api to grab media and build a playlist
$.ajax({
       type: 'GET',
       dataType: "json",
       url: 'https://riipen.mediacore.tv/api2/media',
       data: {},
       crossDomain: true,
       beforeSend: function (xhr) {
       xhr.setRequestHeader ("Authorization", "Basic " + btoa('riipenchallenge@mediacore.com' + ":" + 'riipenchallenge'));
       },
       success: function(results) {
            $.each(results.items, function(key, value){
                //stored the id, title, and description in a 2D array to easily access the data later
                media_list.push([value.id, value.title, value.description_plain]);
            });
       },
       complete: function(data) {
            //when the data is retrieved from the request, start the first video
            changeVideo(0);
       }
});
