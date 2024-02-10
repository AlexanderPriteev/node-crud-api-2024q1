export default function isUser(str: string): boolean {
  try {
    const result = JSON.parse(str);
    const isName = typeof result.username === 'string';
    const isAge = typeof result.age === 'number' && result.age > 0;
    const isHobbies =
      Array.isArray(result.hobbies) &&
      result.hobbies.length > 0 &&
      result.hobbies.every((hob: unknown) => typeof hob === 'string');
    const length = Object.keys(result).length === 3;
    return isName && isHobbies && isAge && length;
  } catch {
    return false;
  }
}
