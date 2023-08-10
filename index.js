var moveable = false;
var resizeable = false;
var visibility = false;
var isMouseDown = false;
var resizeHandles = [];
var selectedPopUp = null;
var themeOptionDiv = null;

const themeOption = [
  'Original',
  'darkmode',
  'bright',
  'colorblind',
  'funcky',
  'starwars',
  'anime',
  'car',
  'rocket'
];

let users = [
  {
    username: 'test',
    password: 'test',
    theme: 'Original'
  },
  {
    username: 'redgy',
    password: 'password',
    theme: 'darkmode'
  }
];

localStorage.setItem('users', JSON.stringify(users));
let users_serialized = localStorage.getItem('users');
let users_deserialized = JSON.parse(users_serialized);

console.log(users_deserialized);



function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

function loadPanel() {
  const header = document.createElement('div');
  header.classList.add('header');
  document.body.appendChild(header);
  const headerBtn = [
    {
      name: 'PopUp',
      func: createPopUp
    },
    {
      name: 'Move',
      func: addMovement
    },
    {
      name: 'Resize',
      func: allowResize
    }
  ];

  headerBtn.forEach(subBtn => {
    const btnDiv = document.createElement('div');
    let buttonClass = document.createElement('button');
    buttonClass.classList.add(subBtn.name);
    buttonClass.id = subBtn.name;
    buttonClass.innerText = subBtn.name;
    btnDiv.appendChild(buttonClass);

    if (isTouchDevice()) {
      buttonClass.addEventListener('touchstart', subBtn.func);
    } else {
      buttonClass.addEventListener('click', subBtn.func);
    }

    header.appendChild(btnDiv);
  });

  const themeBtn = document.createElement('button');
  themeBtn.classList.add('theme-icon-btn');
  themeBtn.innerHTML = '<img src="images/colorpalette.png" />';
  document.body.appendChild(themeBtn);

  if (isTouchDevice()) {
    themeBtn.addEventListener('touchstart', addThemeList);
  } else {
    themeBtn.addEventListener('click', addThemeList);
  }
}

function createPopUp() {
  const popUpDiv = document.createElement('div');
  popUpDiv.classList.add('pop-up-div');

  const popUpHeader = document.createElement('div');
  popUpHeader.classList.add('pop-up-header');
  const popUpBody = document.createElement('div');
  popUpBody.classList.add('pop-up-body', 'touch-scrollable');

  const popUpBtnArray = [
    {
      button: '□',
      func: enlargePopUp
    },
    {
      button: 'x',
      func: closepopUp
    }
  ];

  popUpBtnArray.forEach(popBtn => {
    const popUpBtn = document.createElement('button');
    popUpBtn.innerText = popBtn.button;
    popUpBtn.classList.add('pop-btn')
    popUpHeader.appendChild(popUpBtn);

    if (isTouchDevice()) {
      popUpBtn.addEventListener('touchstart', popBtn.func);
    } else {
      popUpBtn.addEventListener('click', popBtn.func);
    }
  });

  popUpDiv.appendChild(popUpHeader);
  popUpDiv.appendChild(popUpBody);

  document.body.appendChild(popUpDiv);

  if (isTouchDevice()) {
    popUpHeader.addEventListener('touchstart', onTouchStart.bind(popUpDiv));
    popUpHeader.addEventListener('touchmove', onTouchMove.bind(popUpDiv));
    popUpHeader.addEventListener('touchend', onTouchEnd.bind(popUpDiv));
  } else {
    popUpHeader.onmousedown = onMouseDown.bind(popUpDiv);
  }

  moveable = false;
  resizeable = false;
  addMovement();
  allowResize();
  popUpWelcomeScreen(popUpBody);
}

function enlargePopUp() {
  const popDiv = this.parentNode.parentNode.getElementsByClassName('pop-up-body')[0];
  let newWindow = window.open('', '', "width=500, height=200");
  newWindow.document.write(popDiv.innerHTML);
}

function closepopUp() {
  const popDiv = this.parentNode.parentNode;
  if (popDiv) {
    document.body.removeChild(popDiv);
  }
}

function popUpWelcomeScreen(popUpBody) {
  const welcomePageDiv = document.createElement('div');
  welcomePageDiv.classList.add('welcome-page');

  const welcome = document.createElement('h3');
  welcome.textContent = 'Welcome to the Popup center';

  const newUserDiv = document.createElement('div');
  newUserDiv.classList.add('new-user');

  const newUserParagraph = document.createElement('p');
  newUserParagraph.textContent = 'New to the website?';

  const newUserButton = document.createElement('button');
  newUserButton.classList.add('new-user-btn');
  newUserButton.textContent = 'Create User';

  newUserDiv.appendChild(newUserParagraph);
  newUserDiv.appendChild(newUserButton);

  const existingUserDiv = document.createElement('div');
  existingUserDiv.classList.add('existing-user');

  const existingUserParagraph = document.createElement('p');
  existingUserParagraph.textContent = 'If you are an existing user';

  const existingUserButton = document.createElement('button');
  existingUserButton.classList.add('existing-user-btn');
  existingUserButton.textContent = 'Log in';


  existingUserDiv.appendChild(existingUserParagraph);
  existingUserDiv.appendChild(existingUserButton);

  welcomePageDiv.appendChild(welcome);
  welcomePageDiv.appendChild(newUserDiv);
  welcomePageDiv.appendChild(existingUserDiv);


  popUpBody.appendChild(welcomePageDiv);
  existingUserButton.addEventListener('click', () => {
    popUpLogin(popUpBody, welcomePageDiv);
  })

  newUserButton.addEventListener('click', () => {
    popUpRegister(popUpBody, welcomePageDiv);
  })

}

function popUpRegister(popUpBody, welcomePageDiv) {
  const form = document.createElement('form');

  const usernameLabel = document.createElement('label');
  usernameLabel.textContent = 'Username: ';
  usernameLabel.setAttribute('for', 'username');

  const usernameInput = document.createElement('input');
  usernameInput.setAttribute('type', 'text');
  usernameInput.classList.add('username');
  usernameInput.setAttribute('name', 'username');
  usernameInput.setAttribute('placeholder', 'Enter username here...');

  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password: ';
  passwordLabel.setAttribute('for', 'password');

  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.classList.add('password');
  passwordInput.setAttribute('name', 'password');
  passwordInput.setAttribute('placeholder', 'Enter Password here...');

  const themeLable = document.createElement('label');
  themeLable.textContent = 'Select your theme';
  themeLable.setAttribute('for', 'themeSelect');
  themeLable.classList.add('theme-lable');
  
  const ThemeSelect = document.createElement('select');
  ThemeSelect.setAttribute('id', 'themeSelect');
  ThemeSelect.classList.add('theme-select')

  themeOption.forEach(theme => {
    const themeOption = document.createElement('option');
    themeOption.setAttribute('value', theme);
    themeOption.textContent = theme;
    ThemeSelect.appendChild(themeOption)
  })

  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.classList.add('signup-btn');
  submitButton.textContent = 'Sign up';

  const message = document.createElement('p');
  message.classList.add('form-message');
  message.innerText = '';

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    let newUser = {
      username: usernameInput.value,
      password: passwordInput.value,
      theme: ThemeSelect.value
    }

    let users_serialized = localStorage.getItem('users');
    let users_deserialized = JSON.parse(users_serialized);

    if (usernameInput.value.length ===  0){
      message.innerText = `invalid Username`
    } else if (passwordInput.value.length ===  0){
      message.innerText = `invalid Password`
    }else {
      users_deserialized.push(newUser);
      localStorage.setItem('users', JSON.stringify(users_deserialized));
  
      form.remove();
      popUpLogin(popUpBody, welcomePageDiv);
    }
  });

  form.appendChild(usernameLabel);
  form.appendChild(usernameInput);
  form.appendChild(passwordLabel);
  form.appendChild(passwordInput);
  form.appendChild(themeLable);
  form.appendChild(ThemeSelect);
  form.appendChild(message);
  form.appendChild(submitButton);

  popUpBody.appendChild(form);
  welcomePageDiv.remove();

}


function popUpLogin(popUpBody, welcomePageDiv) {
  const form = document.createElement('form');

  const usernameLabel = document.createElement('label');
  usernameLabel.textContent = 'Username: ';
  usernameLabel.setAttribute('for', 'username');

  const usernameInput = document.createElement('input');
  usernameInput.setAttribute('type', 'text');
  usernameInput.classList.add('username');
  usernameInput.setAttribute('name', 'username');
  usernameInput.setAttribute('placeholder', 'Enter username here...');

  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password: ';
  passwordLabel.setAttribute('for', 'password');

  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.classList.add('password');
  passwordInput.setAttribute('name', 'password');
  passwordInput.setAttribute('placeholder', 'Enter Password here...');

  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.classList.add('sumbit-btn');
  submitButton.textContent = 'Log In';

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    users.forEach(user => {
      if (user.username === usernameInput.value && user.password === passwordInput.value) {
        changeTheme(user.theme);
        mainPage(usernameInput.value, popUpBody);
      }
    });
  });


  form.appendChild(usernameLabel);
  form.appendChild(usernameInput);
  form.appendChild(passwordLabel);
  form.appendChild(passwordInput);
  form.appendChild(submitButton);

  popUpBody.appendChild(form);
  welcomePageDiv.remove();

}
function mainPage(username, popUpBody) {
  popUpBody.innerHTML = `<h1>Hello ${username} </h1>`
}
// move pop up
function addMovement() {
  const moveBtn = document.getElementById('Move');

  if (moveable) {
    moveable = false;
    moveBtn.innerText = 'Move: Off';
    document.body.style.cursor = 'default';
    document.querySelector('.pop-up-div').style.cursor = 'default';

    if (isTouchDevice()) {
      document.removeEventListener('touchmove', onTouchMove, { passive: false });
      document.removeEventListener('touchend', onTouchEnd);
    }
  } else {
    moveable = true;
    moveBtn.innerText = 'Move: On';
    document.body.style.cursor = 'move';
    document.querySelector('.pop-up-div').style.cursor = 'move';

    if (isTouchDevice()) {
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    }
  }
}

function onTouchStart(event) {
  event.preventDefault();
  selectedPopUp = this;
  const touch = event.touches[0];
  const popDivPos = this.getBoundingClientRect();
  this.coordinates = {
    x: touch.clientX - popDivPos.left,
    y: touch.clientY - popDivPos.top
  };
}

function onTouchMove(event) {
  event.preventDefault();
  if (selectedPopUp === this && moveable) {
    const touch = event.touches[0];
    const newLeft = touch.clientX - this.coordinates.x;
    const newTop = touch.clientY - this.coordinates.y;

    this.style.left = `${newLeft}px`;
    this.style.top = `${newTop}px`;
  }
}

function onTouchEnd(event) {
  selectedPopUp = null;
}

function onMouseDown(event) {
  // event.preventDefault();
  if (moveable) {
    selectedPopUp = this;
    isMouseDown = true;
    const popUpDiv = this;
    const popDivPos = popUpDiv.getBoundingClientRect();

    const popUpDivs = Array.from(document.getElementsByClassName('pop-up-div'));
    popUpDivs.forEach(element => {
      element.classList.remove('selected');
    });
    this.classList.add('selected');

    this.coordinates = {
      x: event.clientX - popDivPos.left,
      y: event.clientY - popDivPos.top
    };
    document.addEventListener('mousemove', onMouseMove.bind(this));
    document.addEventListener('mouseup', onMouseUp.bind(this));
  }
}

function onMouseUp(event) {
  isMouseDown = false;
  selectedPopUp = null;
  const popUpDiv = this;

  popUpDiv.removeEventListener('mousemove', onMouseMove);
}

function onMouseMove(event) {
  event.preventDefault();
  if (isMouseDown && selectedPopUp === this) {
    const popUpDiv = this;
    const popDivPos = popUpDiv.getBoundingClientRect();

    const newLeft = event.clientX - this.coordinates.x;
    const newTop = event.clientY - this.coordinates.y;

    popUpDiv.style.left = `${newLeft}px`;
    popUpDiv.style.top = `${newTop}px`;
  }
}

// resize pop up
function allowResize() {
  const resizeBtn = document.getElementById('Resize');
  const popUpDivs = Array.from(document.getElementsByClassName('pop-up-div'));

  if (resizeable && resizeBtn) {
    resizeable = false;
    resizeBtn.innerText = 'Resize: Off';

    popUpDivs.forEach(popUpDiv => {
      const popUpBody = popUpDiv.getElementsByClassName('pop-up-body')[0];
      popUpBody.style.overflowY = 'auto';
      popUpBody.style.overflowX = 'hidden';
      disableResize(popUpDiv);
    });
  } else if (resizeBtn) {
    resizeable = true;
    resizeBtn.innerText = 'Resize: On';

    popUpDivs.forEach(popUpDiv => {
      const popUpBody = popUpDiv.getElementsByClassName('pop-up-body')[0];
      popUpBody.style.resize = 'none';
      popUpBody.style.overflow = 'auto';
      popUpBody.style.maxWidth = 'none';
      popUpBody.style.maxHeight = 'none';
      popUpBody.style.height = `calc(100% - ${popUpDiv.getElementsByClassName('pop-up-header')[0].offsetHeight}px)`;
      popUpBody.style.overflowY = 'scroll';
      popUpBody.style.overflowX = 'hidden';
      enableResize(popUpDiv);
    });
  }
}

function enableResize(popUpDiv) {
  createResizeHandle('top-left', 'nwse-resize', 'top', 'left', popUpDiv);
  createResizeHandle('top-right', 'nesw-resize', 'top', 'right', popUpDiv);
  createResizeHandle('bottom-left', 'nesw-resize', 'bottom', 'left', popUpDiv);
  createResizeHandle('bottom-right', 'nwse-resize', 'bottom', 'right', popUpDiv);
  createResizeHandle('top', 'ns-resize', 'top', 'none', popUpDiv);
  createResizeHandle('right', 'ew-resize', 'none', 'right', popUpDiv);
  createResizeHandle('left', 'ew-resize', 'none', 'left', popUpDiv);
  createResizeHandle('bottom', 'ns-resize', 'bottom', 'none', popUpDiv);
}

function createResizeHandle(className, cursor, vertical, horizontal, parent) {
  const handle = document.createElement('div');
  handle.className = 'resize-handle ' + className;
  handle.style.cursor = cursor;
  parent.appendChild(handle);
  resizeHandles.push({ element: handle, vertical: vertical, horizontal: horizontal });

  handle.style.position = 'absolute';

  if (isTouchDevice()) {
    handle.addEventListener('touchstart', startResizeTouch);
  } else {
    handle.addEventListener('mousedown', startResize);
  }
}

function startResizeTouch(event) {
  event.preventDefault();
  let isResizing = false;
  const popUpDiv = this.parentNode;
  const initialWidth = popUpDiv.offsetWidth;
  const initialHeight = popUpDiv.offsetHeight;
  const initialLeft = popUpDiv.offsetLeft;
  const initialTop = popUpDiv.offsetTop;
  const touch = event.touches[0];
  const startX = touch.clientX;
  const startY = touch.clientY;
  const handle = getHandleByElement(event.target);

  document.addEventListener('touchmove', handleResizeTouch, { passive: false });
  document.addEventListener('touchend', stopResizeTouch);

  function handleResizeTouch(event) {
    event.preventDefault();
    let width = initialWidth;
    let height = initialHeight;
    let deltaX = event.touches[0].clientX - startX;
    let deltaY = event.touches[0].clientY - startY;

    if (handle.horizontal === 'right') {
      width += deltaX;
    } else if (handle.horizontal === 'left') {
      width -= deltaX;
      popUpDiv.style.left = initialLeft + deltaX + 'px';
    }

    if (handle.vertical === 'bottom') {
      height += deltaY;
    } else if (handle.vertical === 'top') {
      height -= deltaY;
      popUpDiv.style.top = initialTop + deltaY + 'px';
    }

    popUpDiv.style.width = width + 'px';
    popUpDiv.style.height = height + 'px';
  }

  function stopResizeTouch() {
    isResizing = false;
    document.removeEventListener('touchmove', handleResizeTouch, { passive: false });
    document.removeEventListener('touchend', stopResizeTouch);
  }
}


function disableResize(popUpDiv) {
  const handles = Array.from(popUpDiv.getElementsByClassName('resize-handle'));
  handles.forEach(handle => {
    handle.removeEventListener('mousedown', startResize);
    handle.parentNode.removeChild(handle);
  });
}

function startResize(event) {
  let isResizing = false;
  const popUpDiv = this.parentNode;
  const initialWidth = popUpDiv.offsetWidth;
  const initialHeight = popUpDiv.offsetHeight;
  const initialLeft = popUpDiv.offsetLeft;
  const initialTop = popUpDiv.offsetTop;
  const startX = event.clientX;
  const startY = event.clientY;
  const handle = getHandleByElement(event.target);

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);

  function handleResize(event) {
    let width = initialWidth;
    let height = initialHeight;
    let deltaX = event.clientX - startX;
    let deltaY = event.clientY - startY;

    if (handle.horizontal === 'right') {
      width += deltaX;
    } else if (handle.horizontal === 'left') {
      width -= deltaX;
      popUpDiv.style.left = initialLeft + deltaX + 'px';
    }

    if (handle.vertical === 'bottom') {
      height += deltaY;
    } else if (handle.vertical === 'top') {
      height -= deltaY;
      popUpDiv.style.top = initialTop + deltaY + 'px';
    }

    popUpDiv.style.width = width + 'px';
    popUpDiv.style.height = height + 'px';
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  }
}

function getHandleByElement(element) {
  for (let i = 0; i < resizeHandles.length; i++) {
    if (resizeHandles[i].element === element) {
      return resizeHandles[i];
    }
  }
  return null;
}

// Change themes
function addThemeList() {
  if (themeOptionDiv) {
    document.body.removeChild(themeOptionDiv);
    themeOptionDiv = null;
    themePopUp = false;
  } else {
    const themeBtn = document.getElementsByClassName('theme-icon-btn')[0];
    const themeBtnPos = themeBtn.getBoundingClientRect()


    themeOptionDiv = document.createElement('div');
    themeOptionDiv.classList.add('theme-list-div');

    themeOption.forEach(theme => {
      const themeOptionList = document.createElement('li');
      themeOptionList.classList.add('theme-list');
      let themeListBtn = document.createElement('button');
      themeListBtn.classList.add('theme-list-btn');
      themeListBtn.innerText = theme;
      themeListBtn.addEventListener('click', e => {
        changeTheme(e.target.innerText);
      });
      themeOptionDiv.appendChild(themeOptionList);
      themeOptionList.appendChild(themeListBtn);
    });
    themeOptionDiv.style.top = (themeBtnPos.y + themeBtnPos.height) + 'px';
    themeOptionDiv.style.left = themeBtnPos.x + 'px';
    document.body.appendChild(themeOptionDiv);

    themePopUp = true;
  }
}

function changeTheme(theme) {
  const themeDiv = document.getElementsByClassName('theme-list-div')[0];
  const popUpDivs = document.getElementsByClassName('pop-up-div');
  const header = document.getElementsByClassName('header')[0];
  const headerButtons = document.querySelectorAll('.header button');
  let flyBtn = document.querySelector('.fly-btn');

  if (!flyBtn) {
    flyBtn = document.createElement('button');
    flyBtn.innerText = 'Fly';
    flyBtn.classList.add('fly-btn');
    flyBtn.addEventListener('click', function () {
      for (let i = 0; i < popUpDivs.length; i++) {
        const popUpDiv = popUpDivs[i];
        popUpDiv.classList.remove('move-to-top', 'move-down');
        void popUpDiv.offsetWidth;
        popUpDiv.classList.add('move-to-top');
        popUpDiv.addEventListener('animationend', function () {
          popUpDiv.classList.remove('move-to-top');
          popUpDiv.classList.add('move-down');
        }, { once: true });
      }
    });
  }

  if (themeDiv && popUpDivs && header && headerButtons) {
    document.body.className = theme;
    header.className = 'header ' + theme;
    headerButtons.forEach(button => {
      button.className = theme;
    });

    for (let i = 0; i < popUpDivs.length; i++) {
      const popUpDiv = popUpDivs[i];
      popUpDiv.className = 'pop-up-div ' + theme;
    }
  }

  if (theme === 'rocket') {
    if (!flyBtn.parentElement) {
      header.appendChild(flyBtn);
    }

  } else {
    if (flyBtn.parentElement) {
      flyBtn.remove();
    }

    for (let i = 0; i < popUpDivs.length; i++) {
      const popUpDiv = popUpDivs[i];
      popUpDiv.classList.remove('move-to-top', 'move-down');
      popUpDiv.style.pointerEvents = 'auto';
    }

    flyBtn.innerText = 'Fly';
  }

  if (themeOptionDiv) {
    document.body.removeChild(themeOptionDiv);
    themeOptionDiv = null;
  }
}

loadPanel();
