let prevScrollOffset = window.pageYOffset;
let timeout = null;

window.onscroll = function () {
  let currScrollOffset = window.pageYOffset;
  clearTimeout(timeout);

  // desktop
  if (window.innerWidth >= 1280)
    return;

  // continue display for first page
  if (window.scrollY > (window.innerHeight * 0.75)) {
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

    // if scroll reaches bottom of page, show #nav
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      clearTimeout(timeout);
      document.getElementById('nav').style.display = '';
      document.getElementById('nav').style.opacity = 1;
    }
    prevScrollOffset = window.pageYOffset;
  }

  // #more
  if (window.scrollY > (window.innerHeight * 0.25))
    document.getElementById('more').style.opacity = 0;
  else
    document.getElementById('more').style.opacity = 1;
}

function go_to_top() {
  window.scroll({ top: 0, left: 0 });
}