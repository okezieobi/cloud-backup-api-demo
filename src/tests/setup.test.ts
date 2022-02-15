import connection from '../entities';

afterAll(async () => {
  const resolvedConnection = await (await connection());
  await resolvedConnection.close();
});
