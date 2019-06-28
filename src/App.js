import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import CreateBlog from './components/CreateBlog'
//import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from './services/login'
import  { useField } from './hooks'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const newBlogRef = React.createRef()

  const username = useField('text')
  const password = useField('text')


  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
        //console.log('initialBlogs:', initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      //console.log('user:', user)
    }
  }, [])

  const notificatinMessage = (message) => {
    setMessage(
      message
    )
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('login', username.value, password.value)

    try {
      const user = await loginService.login({
        username: username.value, password: password.value
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      username.reset()
      password.reset()
    } catch (exception) {
      //notificatinMessage('wrong username or password')
      notificatinMessage(exception.response.data.error)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blog = {
      title: title,
      author: author,
      url: url
    }

    try {
      const returnedBlog = await blogService.create(blog)
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog))
      notificatinMessage(`a new blog ${title}, ${author} added`)
    } catch (exception) {
      notificatinMessage(exception.response.data.error)
    }

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleLogout = () => {
    window.localStorage.removeItem(
      'loggedBlogAppUser', JSON.stringify(user)
    )
    setUser(null)
  }

  const updateBlog = async (id) => {
    const targetBlog = blogs.find(b => b.id === id)
    if (!targetBlog) {
      return
    }

    const newBlog = {
      //user: targetBlog.user.id,
      likes: targetBlog.likes + 1,
      author: targetBlog.author,
      title: targetBlog.title,
      url: targetBlog.url
    }

    //console.log('user id', targetBlog.user.id)
    //console.log('blog id', targetBlog.id)

    try {
      const returnedBlog = await blogService.replace(id, newBlog)
      returnedBlog.user = targetBlog.user
      setBlogs(blogs.map(b => b.id === targetBlog.id ? returnedBlog : b))
    } catch(exception) {
      //console.log('error', exception.response.data.error)
      notificatinMessage('error')
    }
  }

  const deleteBlog = async (id) => {
    const existingBlog = blogs.find(b => b.id === id)
    console.log('remove click1', id)
    console.log('remove click2', existingBlog)
    if (existingBlog) {
      const ookoo = window.confirm(`remove blog ${existingBlog.title}?`)

      if (ookoo) {
        try {
          await blogService.remove(id)
          setBlogs(blogs.filter(b => b.id !== id))
        } catch(exception) {
          //console.log('error', exception.response.data.error)
          notificatinMessage('error')
        }
      }
    }
  }

  console.log('blogs', blogs)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <LoginForm
          username={username}
          password={password}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  const sortedBlogs = blogs.sort(function (a,b) {
    return b.likes - a.likes
  })

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in  <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel="new blog" ref={newBlogRef}>
        <CreateBlog
          handleSubmit={addBlog}
          title={title}
          author={author}
          url={url}
          handleTitleChange={({ target }) => setTitle(target.value)}
          handleAuthorChange={({ target }) => setAuthor(target.value)}
          handleUrlChange={({ target }) => setUrl(target.value)}
        />
      </Togglable>
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLikes={updateBlog}
          handleRemove={deleteBlog}
          userName={user.name}
        />)}
    </div>
  )
}

export default App
