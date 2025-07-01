export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
// This whole thing was grok's idea to fix a bug i had. Im not sure i fully understood where the problem was, but making all the dates on the same format fixed it.
