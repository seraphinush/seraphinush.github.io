// helper
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncForEach(arr, cb) {
  for (let i = 0; i < arr.length; i++)
    await cb(arr[i], i, arr);
}

window.addEventListener('load', async () => {

  const slide = document.getElementById('slide');
  const name = document.getElementById('name');
  const portfolio = document.getElementById('portfolio');
  const profile = document.getElementById('profile');
  const contact = document.getElementById('contact');

  const contactButtons = [
    document.getElementById('contact-button'),
    //document.getElementById('contact-button-mobile')
  ];

  const portfolioButtons = [
    document.getElementById('portfolio-button'),
    //document.getElementById('portfolio-button-mobile')
  ];

  const profileButtons = [
    document.getElementById('profile-button'),
    //document.getElementById('profile-button-mobile')
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

  let profileEnabled = false;
  let portfolioEnabled = true;
  let contactEnabled = false;
  let currentlyEnabled = 'portfolio';

  const disableElement = (el) => {
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

  const enableElement = (el) => {
    return new Promise(async (resolve) => {
      if (currentlyEnabled) {
        switch (currentlyEnabled) {
          case 'portfolio':
            disableElement(portfolio);
            portfolioEnabled = false;
            break;
          case 'profile':
            disableElement(profile);
            profileEnabled = false;
            break;
        }
      }
      await sleep(1050);
      if (el) {
        el.style.display = 'flex';
        setTimeout(() => {
          el.classList.add('active');
        }, 1);
      }
      resolve();
    });

  }

  // portfolio
  portfolioButtons.forEach(el => {
    el.addEventListener('click', async () => {
      if (contactEnabled) return;
      if (portfolioEnabled) return;
      slide.classList.add('active');
      if (!portfolioEnabled) {
        await enableElement(portfolio);
        slide.classList.remove('active');
        currentlyEnabled = 'portfolio';
        portfolioEnabled = true;
      } else {
        await disableElement(portfolio);
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
      slide.classList.add('active');
      if (!profileEnabled) {
        await enableElement(profile);
        slide.classList.remove('active');
        currentlyEnabled = 'profile';
        profileEnabled = true;
      } else {
        await disableElement(profile);
        slide.classList.remove('active');
        profileEnabled = false;
      }
    });
  });

  // contact
  contactButtons.forEach(el => {
    el.addEventListener('click', () => {
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
    //if (e.target.classList.contains('contact-button-mobile')) return;
    if (contactEnabled) {
      contact.classList.remove('active');
      contactEnabled = false;
    }
  })



  // start
  await asyncForEach(nameArray, async (el) => {
    await sleep(80);
    el.classList.toggle('active');
  });

  setTimeout(() => {
    slide.classList.toggle('active');
    name.classList.toggle('dim');
  }, 2000);

});