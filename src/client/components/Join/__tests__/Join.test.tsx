import * as React from 'react';
import {
  render,
  fireEvent,
  wait,
  getByText,
  getByPlaceholderText,
  cleanup
} from 'react-testing-library';
import { Join } from '../Join';

describe('Join Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render', () => {
    const addUserHandler = jest.fn();

    const { container } = render(<Join addUser={addUserHandler} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should not call addUser if no user is entered', async () => {
    const addUserHandler = jest.fn();

    const { container } = render(<Join addUser={addUserHandler} />);

    const button = getByText(container, 'Join');
    fireEvent.click(button);

    await wait(() => {
      expect(addUserHandler).not.toHaveBeenCalled();
    });
  });

  it('should call addUser if user is entered', async () => {
    const addUserHandler = jest.fn();

    const { container } = render(<Join addUser={addUserHandler} />);

    const input = getByPlaceholderText(container, 'Enter your name');
    fireEvent.change(input, {
      target: { value: 'dave' }
    });

    const button = getByText(container, 'Join');
    fireEvent.click(button);

    await wait(() => {
      expect(addUserHandler).toHaveBeenCalledWith('dave');
    });
  });
});
