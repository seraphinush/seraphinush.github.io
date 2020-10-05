let prevScrollOffset = window.pageYOffset;
let timeout = null;

window.onscroll = function () {
  let currScrollOffset = window.pageYOffset;
  clearTimeout(timeout);

  // if scrolling down, hide #nav
  if (currScrollOffset > prevScrollOffset) {
    document.getElementById('nav').style.opacity = 0;
    if (window.innerWidth < 1280)
      timeout = setTimeout(() => {
        document.getElementById('nav').style.display = 'none';
      }, 300)
  }
  // if scrolling up, show #nav
  else {
    document.getElementById('nav').style.display = '';
    document.getElementById('nav').style.opacity = 1;
  }
  prevScrollOffset = window.pageYOffset;

  // if scroll reaches bottom of page, show #nav
  if ((window.innerHeight + window.scrollY) == document.body.offsetHeight) {
    document.getElementById('nav').style.display = '';
    document.getElementById('nav').style.opacity = 1;
  }

  // #more
  if (window.scrollY > (window.innerHeight * 0.25))
    document.getElementById('more').style.opacity = 0;
  else
    document.getElementById('more').style.opacity = 1;
}

window.onmousemove = function (e) {
  if (e.offsetY <= (window.innerHeight * 0.08)) {
    document.getElementById('more').style.display = '';
    document.getElementById('nav').style.opacity = 1;
  }
}