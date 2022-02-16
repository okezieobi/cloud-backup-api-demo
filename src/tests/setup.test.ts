import connection from '../entities';

afterAll(async () => {
  if (process.env.NODE_ENV === 'testing-in-ci') jest.useRealTimers();
  const resolvedConnection = await (await connection());
  if (resolvedConnection.isConnected) await resolvedConnection.close();
});
