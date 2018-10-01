function requestFullscreen(elem){
    if (elem.requestFullscreen){
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen){
        elem.webkitRequestFullscreen();
    }
}

export default requestFullscreen;