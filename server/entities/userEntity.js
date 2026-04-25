export const toUserEntity = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    username: row.username || null,
    role: row.role,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
  };
};

export const toUserEntities = (rows = []) => rows.map(toUserEntity);
