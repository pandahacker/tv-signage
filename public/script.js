fetch('/images')
.then(response => response.json())
.then(data => addImages(data));

function addImages(data){
    console.log(data);

    data.slides.sort(function(a, b){
        a = a.slice(0, -5);
        b = b.slice(0, -5);
        return a-b
    });

    for(var i=0;i<data.slides.length;i++){
        var img = document.createElement('img');
        img.src = 'slides/'+data.slides[i];
        img.className = 'slideshow';
        img.id = 'slide'+(i+1);

        console.log(img);
        document.getElementById('slide').appendChild(img);
    }

    w3.slideshow('.slideshow', 5000);
}
