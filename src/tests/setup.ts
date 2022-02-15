import connection from '../entities';

afterAll(async () => {
  const resolvedConnection = await (await connection());
  resolvedConnection.close();
});
