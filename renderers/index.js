const {
  ipcRenderer
} = require('electron')

const btnAdd = document.getElementById('btnAdd')

function renderPosts(posts) {
  posts.forEach(post => {
    const postEl = document.createElement('div')
    postEl.classList.add('post')
    const postDetails = document.createElement('div')
    postDetails.classList.add('post-details')
    const postTitle = document.createElement('h4')
    postTitle.classList.add('post-title')
    postTitle.textContent = post.title
    const postBody = document.createElement('p')
    postBody.classList.add('post-body')
    postBody.innerText = post.body

    const postDeleteBtn = document.createElement('button');
    // postDeleteBtn.attributes['type'] = 'button'
    postDeleteBtn.classList.add('btn', 'btn-danger')
    postDeleteBtn.innerText = 'Delete'
    // postDeleteBtn.innerHTML = `<i class="fas fa-camera"></i>`

    postDeleteBtn.addEventListener('click', (event) => {
      event.preventDefault();
      ipcRenderer.send('delete-post', post)
    })

    postDetails.appendChild(postTitle)
    postDetails.appendChild(postBody)
    postEl.appendChild(postDetails)
    postEl.appendChild(postDeleteBtn)

    postsList.appendChild(postEl);
  })
}

ipcRenderer.on('posts', (event, posts) => {
  const postsList = document.getElementById('postsList')
  console.log(posts);
  postsList.innerHTML = '';
  if (posts.length > 0) {
    renderPosts(posts)
  } else {
    postsList.append(document.createElement('p').innerText = 'No posts found...')
  }
})

btnAdd.addEventListener('click', (event) => {
  ipcRenderer.send('open-post-form-modal');
})