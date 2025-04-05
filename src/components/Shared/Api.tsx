const BASE_URL = "http://localhost:8000/api/v1";
const LAMBDA_API__BASE_URI = import.meta.env.VITE_LAMBDA_API_BASE_URI
const LAMBDA_APP_DATABASE_NAME = import.meta.env.VITE_LAMBDA_APP_DATABASE_NAME

  // Fetch data from API
  export const fetchData = async () => {
    const initialData = await fetchApiData(`${LAMBDA_API__BASE_URI}${LAMBDA_APP_DATABASE_NAME}/`);
    const enrichmentData = await fetchApiData(`${LAMBDA_API__BASE_URI}tests/`);
    return [initialData, enrichmentData];
  };

  // Helper function to fetch data
  export const fetchApiData = async (url: string) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `,
      },
    });
    return response.json();
  };


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
