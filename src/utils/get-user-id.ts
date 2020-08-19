type Token = { userId: string };

function getUserId(token: string | null): string {
  const userId = ((token as unknown) as Token | null)?.userId;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return userId;
}

export { getUserId };
