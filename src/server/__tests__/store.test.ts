import { storeAPI, IMessage, IUser } from '../store';

describe('Store', () => {
  const makeMessages = (count = 1) => {
    const user = storeAPI.addUser('dave');
    const messages: IMessage[] = [];
    for (let i = 0; i < count; i++) {
      messages.push(storeAPI.addMessage(user, `message ${i}`));
    }
    return messages;
  };

  afterEach(() => {
    storeAPI.reset();
  });

  describe('addUser', () => {
    it('adds a user', () => {
      const user = storeAPI.addUser('dave');

      expect(user.name).toEqual('dave');
      expect(user.id).toBeDefined();
    });
  });

  describe('addMessage', () => {
    it('it adds message', () => {
      const user = storeAPI.addUser('dave');
      const message = storeAPI.addMessage(user, 'hi');

      expect(message.message).toEqual('hi');
      expect(message.author).toEqual(user);
      expect(message.id).toBeDefined();
    });
  });

  describe('getMessages', () => {
    it('it gets messages', () => {
      const messages = makeMessages(2);
      const results = storeAPI.getMessages();

      expect(results).toEqual(messages);
    });

    it('it only returns last 50 messages', () => {
      let messages = makeMessages(60);
      messages = messages.slice(storeAPI.MAX_MESSAGES * -1);

      const results = storeAPI.getMessages();
      expect(results).toEqual(messages);
    });
  });

  describe('getUsers', () => {
    let users: IUser[];
    beforeEach(() => {
      users = [storeAPI.addUser('dave'), storeAPI.addUser('tim')];
    });

    it('it gets users', () => {
      const results = storeAPI.getUsers();
      expect(results).toEqual(users);
    });
  });

  describe('reset', () => {
    const user = storeAPI.addUser('dave');
    storeAPI.addMessage(user, 'hi');

    storeAPI.reset();

    expect(storeAPI.getUsers()).toEqual([]);
    expect(storeAPI.getMessages()).toEqual([]);
  });

  describe('dropUser', () => {
    const userA = storeAPI.addUser('dave');
    const userB = storeAPI.addUser('dave');

    storeAPI.dropUser(userA);

    expect(storeAPI.getUsers()).toEqual([userB]);
  });
});
