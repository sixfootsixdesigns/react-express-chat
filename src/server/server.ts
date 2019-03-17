import { appServer } from './app';

const port = Number(process.env.PORT || 4001);

appServer.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
