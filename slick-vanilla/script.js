new Blazy({
    selector: 'img:not(.no-lazy)', // all images
    loadInvisible: true,
    offset: 1000,
    breakpoints: [{
        width: 767, // max-width
        src: 'data-src-small'
    },
    {
        width: 991, // max-width
        src: 'data-src-medium'
    }
    ],
    error: function (ele, msg) {
        console.log('lazy load image error: ', ele.src, ': ', msg)
    },
    success: function (ele) {
        console.log('success: ', ele);
    }
});
// new Slick(document.querySelector('.slider .w_inner'), {infinite: false});
