import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'


test('renders title, author and likes', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Testikäyttäjä',
    likes: 22
  }

  const component = render(
    <SimpleBlog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library',
  )

  expect(component.container).toHaveTextContent(
    'Testikäyttäjä'
  )

  const div = component.container.querySelector('.likes')
  expect(div).toHaveTextContent(
    '22'
  )
})

test('clicking the like button', async () => {
  const blog = {
    title: 'clicking the button calls event handler twice',
    author: 'Testikäyttäjä',
    likes: 0
  }

  const mockHandler = jest.fn()

  const { getByText } = render(
    <SimpleBlog blog={blog} onClick={mockHandler} />
  )

  const button = getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})
