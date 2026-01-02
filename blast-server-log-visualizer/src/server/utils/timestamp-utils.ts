/**
 * Helper method to convert the server log timestamp format to an appropriate date object.
 * @param timestamp 
 * @returns 
 */
export const convertServerLogTimeStampToDate = (timestamp: string) => {
  const [datePart, timePart] = timestamp.split(" - ");
  
  const [month, day, year] = datePart!.split("/").map(Number);
  const [hours, minutes, seconds] = timePart!.split(":").map(Number);

  const date = new Date(year!, month! - 1, day, hours, minutes, seconds);

  return date
}