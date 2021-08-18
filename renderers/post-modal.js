const {
  ipcRenderer
} = require('electron')
const postForm = document.getElementById('postForm')

postForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = event.target[0].value
  const body = event.target[1].value

  if (title !== '' && body !== '') {
    ipcRenderer.send('add-new-post', {
      title,
      body,
      id: Math.floor(Math.random() * 1000)
    })
  }

  postForm.reset();
})
