const BASE_URL = "http://localhost:8000/api/v1";

export const checkDatabaseExists = async (databaseName: string) => {
  const response = await fetch(`${BASE_URL}/ledgers/${databaseName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.status === 403 ? "Access denied" : response.status === 404 ? "Database not found" : "Error checking database");
  }

  return response.json();
};

export const registerDatabase = async (databaseName: string) => {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    },
    body: JSON.stringify({
      ledgerUUID: databaseName,
      payload: {
        database_link: databaseName,
        owner_id: "john",
        registered_date: "2025-03-28",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};
