import connection from '../entities';

afterAll(async () => {
  const resolvedConnection = await connection();
  if (resolvedConnection.isConnected) await resolvedConnection.close();
});
