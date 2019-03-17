import * as React from 'react';
import {
  render,
  fireEvent,
  wait,
  getByText,
  getByPlaceholderText,
  cleanup
} from 'react-testing-library';
import { AddMessage } from '../AddMessage';

describe('Add Message Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render', () => {
    const addMessageHandler = jest.fn();

    const { container } = render(<AddMessage addMessage={addMessageHandler} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should not call addUser if no user is entered', async () => {
    const addMessageHandler = jest.fn();

    const { container } = render(<AddMessage addMessage={addMessageHandler} />);

    const button = getByText(container, 'Post');
    fireEvent.click(button);

    await wait(() => {
      expect(addMessageHandler).not.toHaveBeenCalled();
    });
  });

  it('should call addUser if user is entered', async () => {
    const addMessageHandler = jest.fn();

    const { container } = render(<AddMessage addMessage={addMessageHandler} />);

    const input = getByPlaceholderText(container, 'Enter your message');
    fireEvent.change(input, {
      target: { value: 'hello' }
    });

    const button = getByText(container, 'Post');
    fireEvent.click(button);

    await wait(() => {
      expect(addMessageHandler).toHaveBeenCalledWith('hello');
    });
  });
});
