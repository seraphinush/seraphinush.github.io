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

// global
let navMobileEnabled = false;
let profileEnabled = false;
let portfolioEnabled = true;
let contactEnabled = false;
let currentlyEnabled = 'portfolio';

if (window.location.pathname.length > 1) {
  currentlyEnabled = window.location.pathname.slice(1);

  console.log(currentlyEnabled);
  switch (currentlyEnabled) {
    case 'portfolio':
      portfolioEnabled = false;
      break;
    case 'profile':
      profileEnabled = false;
      break;
  }
}

history.replaceState({ url: 'index.html' }, null, window.location.origin + '');

window.addEventListener('load', async () => {

  // consts
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
  const enableSection = (el) => {
    return new Promise(async (resolve) => {
      if (currentlyEnabled) {
        switch (currentlyEnabled) {
          case 'portfolio':
            disableSection(portfolio);
            portfolioEnabled = false;
            break;
          case 'profile':
            disableSection(profile);
            profileEnabled = false;
            break;
        }
      }
      await sleep(1050);
      if (el) {
        el.style.display = 'flex';
        await sleep(1);
        el.classList.add('active');
      }
      resolve();
    });
  }

  const disableSection = (el) => {
    return new Promise(async (resolve) => {
      await sleep(1050);
      if (el) {
        el.style.display = 'none';
        el.classList.remove('active');
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
      if (contactEnabled) return;
      if (portfolioEnabled) return;
      await asyncClassAdd(slide, 'active', 200);
      if (navMobileEnabled) {
        disableNavMobileLinks();
      }
      if (!portfolioEnabled) {
        await enableSection(portfolio);
        history.replaceState({ url: 'portfolio.html' }, null, window.location.origin + '/portfolio')
        slide.classList.remove('active');
        currentlyEnabled = 'portfolio';
        portfolioEnabled = true;
      } else {
        await disableSection(portfolio);
        slide.classList.remove('active');
        portfolioEnabled = false;
      }
    });
  });


  // profile
  profileButtons.forEach(el => {
    el.addEventListener('click', async () => {
      if (contactEnabled) return;
      if (profileEnabled) return;
      await asyncClassAdd(slide, 'active', 200);
      if (navMobileEnabled) {
        disableNavMobileLinks();
      }
      if (!profileEnabled) {
        await enableSection(profile);
        history.replaceState({ url: 'profile.html' }, null, window.location.origin + '/profile')
        slide.classList.remove('active');
        currentlyEnabled = 'profile';
        profileEnabled = true;
      } else {
        slide.classList.remove('active');
        await disableSection(profile);
        profileEnabled = false;
      }
    });
  });

  // contact
  contactButtons.forEach(el => {
    el.addEventListener('click', () => {
      if (navMobileEnabled) {
        disableNavMobileLinks();
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

  setTimeout(() => {
    if (currentlyEnabled == 'portfolio') {
      history.replaceState({ url: 'portfolio.html' }, null, window.location.origin + '/portfolio');
    }
    slide.classList.toggle('active');
  }, 2000);

});


window.w