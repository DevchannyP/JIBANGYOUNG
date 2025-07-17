export const fetchPolicies = async () => {
  const response = await fetch('http://localhost:8080/api/policies', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};