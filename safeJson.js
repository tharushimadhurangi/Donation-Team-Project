export async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
