import React, { useState } from 'react'

const Blog = ({ blog, handleLikes, handleRemove, userName }) => {
  const [visible, setblogVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  //console.log('userName', userName, 'blogUserName', blog.user.name)
  const loginUser = userName === blog.user.name ? true : false
  const showWhenLoginUser = { display: loginUser ? '' : 'none' }

  const toggleVisibility = () => {
    setblogVisible(!visible)
    console.log('toggleVisibility:', visible)
  }

  return (
    <div className='blog' >
      <div onClick={toggleVisibility}>
        <table>
          <tbody>
            <tr>
              <td><b>{blog.title}</b></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={showWhenVisible}>
        <table>
          <tbody>
            <tr>
              <td>{blog.author}</td>
            </tr>
            <tr>
              <td><a href={blog.url}>{blog.url}</a></td>
            </tr>
            <tr>
              <td>{blog.likes} likes <button onClick={() => handleLikes(blog.id)}>like</button></td>
            </tr>
            <tr>
              <td>added by {blog.user.name}</td>
            </tr>
            <tr style={showWhenLoginUser}>
              <td><button onClick={() => handleRemove(blog.id)}>remove</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Blog