import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import { Messages } from '../Messages';
import { IMessage } from '../../../../server/store';

describe('Messages Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render with messages', () => {
    const messages: IMessage[] = [
      {
        author: {
          name: 'bob',
          id: 'abc'
        },
        message: 'hi',
        id: '1a'
      },
      {
        author: {
          name: 'dave',
          id: '34ax'
        },
        message: 'hello',
        id: 'zz3'
      }
    ];

    const { container } = render(<Messages messages={messages} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render without messages', () => {
    const messages: IMessage[] = [];

    const { container } = render(<Messages messages={messages} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render loading state', () => {
    const messages: IMessage[] = [];

    const { container } = render(
      <Messages loading={true} messages={messages} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
