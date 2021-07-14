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
let projectEnabled = false;
let contactEnabled = false;
let currentEnabled = '';
let currentProjectEnabled = null;
let readyState = false;

// search-based page view
let params = new URLSearchParams(window.location.search.substring(1));
let page = params.get('page');
if (page) {
  switch (page) {
    case 'portfolio':
      currentEnabled = page;
      portfolioEnabled = true;
      break;
    case 'profile':
      currentEnabled = page;
      profileEnabled = true;
      break;
    case 'project':
      currentEnabled = page;
      projectEnabled = true;
      currentProjectEnabled = params.get('name');
      break;
  }
} else {
  portfolioEnabled = true;
  currentEnabled = 'portfolio';
}

window.addEventListener('load', async () => {

  // consts
  const home = document.getElementById('home');
  const slide = document.getElementById('slide');
  const burgers = document.getElementById('burgers');
  const navMobile = document.getElementById('nav-mobile');
  const portfolio = document.getElementById('portfolio');
  const portfolioEntries = portfolio.querySelectorAll('.entry');
  const project = document.getElementById('project');
  const projectEntries = project.querySelectorAll('.project');
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

      if (currentEnabled) {
        switch (currentEnabled) {
          case 'profile':
            await disableSection(profile);
            profileEnabled = false;
            break;
          case 'portfolio':
            await disableSection(portfolio);
            portfolioEnabled = false;
            break;
          case 'project':
            await disableSection(project);
            projectEnabled = false;
            break;
        }
      }

      currentEnabled = page;
      await enableSection(el);
      resolve();
    });
  }

  const enableSection = (el) => {
    return new Promise(async (resolve) => {
      if (el) {
        el.style.display = 'flex';
        await sleep(5);

        // TODO
        if (currentEnabled == 'portfolio') {
          await asyncClassAdd(el, 'active', 0);
          asyncForEach(portfolioEntries, async (el) => {
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

        // TODO
        if (currentEnabled == 'portfolio') {
          portfolioEntries.forEach(el => { el.style.opacity = 0; });
        }

        // TODO
        if (currentEnabled == 'project') {
          project.style.top = '';
          currentProjectEnabled = null;
        }
        currentEnabled = null;
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

  // projects
  portfolioEntries.forEach(el => {
    el.addEventListener('click', async () => {
      if (!readyState) return;
      if (contactEnabled) return;
      if (!portfolioEnabled) return;

      let projectName = el.dataset.name;
      await asyncForEach(projectEntries, (el) => {
        if (!el.dataset) return;
        if (el.dataset.name === projectName) {
          el.style.display = 'flex';
          currentProjectEnabled = projectName;
        }
        else {
          el.style.display = 'none';
        }
      });

      readyState = false;
      await asyncClassAdd(project, 'notransition', 0);
      project.style.top = (window.scrollY + window.innerHeight) + 'px';
      await asyncClassRemove(project, 'notransition', 0);
      await enableSection(project);
      history.pushState(null, null, '?page=project&name=' + projectName);
      project.style.top = (window.scrollY + 70) + 'px';
      await sleep(700);
      asyncClassAdd(project, 'notransition', 0);
      asyncClassAdd(portfolio, 'notransition', 0);
      await sleep(100);
      project.style.top = 70 + 'px';
      disableSection(portfolio);
      portfolioEnabled = false;
      currentEnabled = 'project';
      await sleep(100);
      asyncClassRemove(project, 'notransition', 0);
      asyncClassRemove(portfolio, 'notransition', 0);
      projectEnabled = true;
      readyState = true;
    });
  });

  document.body.addEventListener('scroll', () => {
    if (!projectEnabled) return;
    if (!currentProjectEnabled) return;
    if (window.innerWidth < 800) return;

    let project;
    projectEntries.forEach(el => el.dataset.name === currentProjectEnabled ? project = el : null);
    if (!project) return;

    let info = project.querySelector('.proj-desc');
    if (!info) return;

    info.style.top = document.body.scrollTop + 'px';
  });

  // contact
  contactButtons.forEach(el => {
    el.addEventListener('click', async () => {
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

  contact.addEventListener('click', () => {
    if (contactEnabled) {
      contact.classList.remove('active');
      contactEnabled = false;
    }
  });

  // start
  await asyncForEach(projectEntries, (el) => {
    el.style.display = 'none';
  });

  await asyncForEach(nameArray, async (el) => {
    await sleep(80);
    el.classList.toggle('active');
  });

  setTimeout(async () => {
    switch (currentEnabled) {
      case 'profile':
        await enableSection(profile);
        history.pushState(null, null, '?page=profile');
        break;
      case 'portfolio':
        await enableSection(portfolio);
        history.pushState(null, null, '?page=portfolio');
        break;
      case 'project':
        await asyncForEach(projectEntries, (el) => {
          if (!el.dataset) return;
          if (el.dataset.name === currentProjectEnabled) {
            el.style.display = 'flex';
          }
        });
        project.style.top = '70px';
        await enableSection(project);
        history.pushState(null, null, '?page=project&name=' + currentProjectEnabled);
        break;
    }
    slide.classList.toggle('active');
    readyState = true;
  }, 2000);

});