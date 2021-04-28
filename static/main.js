// helper
async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncForEach(arr, cb) {
  for (let i = 0; i < arr.length; i++)
    await cb(arr[i], i, arr);
}

async function asyncClassAdd(el, toAdd, ms) {
  return new Promise(async (resolve) => {
    el.classList.add(toAdd);
    await sleep(ms);
    resolve();
  });
}

async function asyncClassRemove(el, toRemove, ms) {
  return new Promise(async (resolve) => {
    el.classList.remove(toRemove);
    await sleep(ms);
    resolve();
  });
}

// global defaults
let navMobileEnabled = false;
let profileEnabled = false;
let portfolioEnabled = false;
let contactEnabled = false;
let currentlyEnabled = '';
let readyState = false;

// search based page view
let params = new URLSearchParams(window.location.search.substring(1));
let page = params.get('page');
if (page) {
  switch (page) {
    case 'portfolio':
      currentlyEnabled = page;
      portfolioEnabled = true;
      break;
    case 'profile':
      currentlyEnabled = page;
      profileEnabled = true;
      break;
  }
} else {
  portfolioEnabled = true;
  currentlyEnabled = 'portfolio';
}

window.addEventListener('load', async () => {

  // consts
  const home = document.getElementById('home');
  const slide = document.getElementById('slide');
  const burgers = document.getElementById('burgers');
  const navMobile = document.getElementById('nav-mobile');
  const portfolio = document.getElementById('portfolio');
  const profile = document.getElementById('profile');
  const contact = document.getElementById('contact');

  const contactButtons = [
    document.getElementById('contact-button'),
    document.getElementById('contact-button-mobile')
  ];

  const portfolioButtons = [
    document.getElementById('portfolio-button'),
    document.getElementById('portfolio-button-mobile')
  ];

  const profileButtons = [
    document.getElementById('profile-button'),
    document.getElementById('profile-button-mobile')
  ];

  const nameArray = [
    document.querySelector('.name-s1'),
    document.querySelector('.name-e'),
    document.querySelector('.name-r'),
    document.querySelector('.name-a'),
    document.querySelector('.name-p'),
    document.querySelector('.name-h1'),
    document.querySelector('.name-i'),
    document.querySelector('.name-n1'),
    document.querySelector('.name-u'),
    document.querySelector('.name-s2'),
    document.querySelector('.name-h2'),
    document.querySelector('.name-o'),
    document.querySelector('.name-n2'),
    document.querySelector('.name-g')
  ];

  const navMobileLinks = [
    document.getElementById('profile-button-mobile'),
    document.getElementById('portfolio-button-mobile'),
    document.getElementById('contact-button-mobile'),
    document.getElementById('resume-button-mobile')
  ];

  // helper
  const toggleSection = (el, page) => {
    return new Promise(async (resolve) => {

      if (currentlyEnabled) {
        switch (currentlyEnabled) {
          case 'portfolio':
            await disableSection(portfolio);
            portfolioEnabled = false;
            break;
          case 'profile':
            await disableSection(profile);
            profileEnabled = false;
            break;
        }
      }

      currentlyEnabled = page;
      await enableSection(el);
      resolve();
    });
  }

  const enableSection = (el) => {
    return new Promise(async (resolve) => {
      if (el) {
        el.style.display = 'flex';
        await sleep(5);

        // TODO -- need check for the most optimal method ..
        if (currentlyEnabled == 'portfolio') {
          const projects = portfolio.querySelectorAll('.project');
          await asyncClassAdd(el, 'active', 0);
          asyncForEach(projects, async (el) => {
            await sleep(250);
            el.style.opacity = 1;
          });
        } else {
          await asyncClassAdd(el, 'active', 0);
        }
      }
      resolve();
    });
  }

  const disableSection = (el) => {
    return new Promise(async (resolve) => {
      if (el) {
        el.style.display = 'none';
        el.classList.remove('active');

        if (currentlyEnabled == 'portfolio') {
          const projects = portfolio.querySelectorAll('.project');
          projects.forEach(el => { el.style.opacity = 0; });
        }
        currentlyEnabled = null;
      }
      resolve();
    });
  }

  const enableNavMobileLinks = async () => {
    if (contactEnabled) return;
    burgers.classList.add('active');
    navMobile.classList.add('active');
    await asyncForEach(navMobileLinks, async (el) => {
      await sleep(120);
      el.classList.add('active');
    });
    navMobileEnabled = true;
  }

  const disableNavMobileLinks = async () => {
    if (contactEnabled) return;
    burgers.classList.remove('active');
    await asyncForEach(navMobileLinks, async (el) => {
      el.classList.remove('active');
      await sleep(120);
    });
    await sleep(180);
    navMobile.classList.remove('active');
    navMobileEnabled = false;
  }

  // home
  home.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = window.location.origin;
  });

  // mobile menu
  burgers.addEventListener('click', () => {
    if (navMobileEnabled) {
      disableNavMobileLinks();
    } else {
      enableNavMobileLinks();
    }
  });

  // portfolio
  portfolioButtons.forEach(el => {
    el.addEventListener('click', async () => {
      if (!readyState) return;
      if (contactEnabled) return;
      if (portfolioEnabled) return;
      readyState = false;

      await asyncClassAdd(slide, 'active', 1000);
      if (navMobileEnabled) {
        disableNavMobileLinks();
        await sleep(300);
      }
      await toggleSection(portfolio, 'portfolio');
      history.pushState(null, null, '?page=portfolio');
      slide.classList.remove('active');
      portfolioEnabled = true;
      readyState = true;
    });
  });


  // profile
  profileButtons.forEach(el => {
    el.addEventListener('click', async () => {
      if (!readyState) return;
      if (contactEnabled) return;
      if (profileEnabled) return;

      readyState = false;
      await asyncClassAdd(slide, 'active', 1000);

      if (navMobileEnabled) {
        disableNavMobileLinks();
        await sleep(300);
      }
      await toggleSection(profile, 'profile');
      history.pushState(null, null, '?page=profile');
      slide.classList.remove('active');
      profileEnabled = true;
      readyState = true;
    });
  });

  // contact
  contactButtons.forEach(el => {
    el.addEventListener('click', () => {
      if (navMobileEnabled) {
        disableNavMobileLinks();
        await sleep(300);
      }
      if (!contactEnabled) {
        contact.classList.add('active');
        setTimeout(() => {
          contactEnabled = true;
        }, 200);
      } else {
        contact.classList.remove('active');
        contactEnabled = false;
      }
    });
  });

  contact.addEventListener('click', (e) => {
    if (e.target.classList.contains('contact-button')) return;
    if (e.target.classList.contains('contact-button-mobile')) return;
    if (contactEnabled) {
      contact.classList.remove('active');
      contactEnabled = false;
    }
  });

  // start
  await asyncForEach(nameArray, async (el) => {
    await sleep(80);
    el.classList.toggle('active');
  });


  setTimeout(async () => {
    switch (currentlyEnabled) {
      case 'portfolio':
        await enableSection(portfolio);
        history.pushState(null, null, '?page=portfolio');
        break;
      case 'profile':
        await enableSection(profile);
        history.pushState(null, null, '?page=profile');
        break;
    }
    slide.classList.toggle('active');
    readyState = true;
  }, 2000);

});