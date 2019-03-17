import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import { ActiveUsers } from '../ActiveUsers';
import { IUser } from '../../../../server/store';

describe('Active Users Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render with users and highlight current user', () => {
    const users: IUser[] = [
      {
        name: 'bob',
        id: 'abc'
      },
      {
        name: 'dave',
        id: 'aslfj'
      }
    ];
    const currUser = users[1];

    const { container } = render(
      <ActiveUsers currentUser={currUser} users={users} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render without users', () => {
    const users: IUser[] = [];

    const { container } = render(<ActiveUsers users={users} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should show loading state', () => {
    const users: IUser[] = [];

    const { container } = render(<ActiveUsers loading={true} users={users} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
