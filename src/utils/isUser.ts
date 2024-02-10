export default function isUser(str: string): boolean {
  try {
    const result = JSON.parse(str);
    const isName = typeof result.username === 'string';
    const isAge = typeof result.age === 'number';
    const isHob = isHobbies(result.hobbies);
    const length = Object.keys(result).length === 3;
    return isName && isHob && isAge && length;
  } catch {
    return false;
  }
}

export function isHobbies(elem: unknown): boolean {
  try {
    return (
      Array.isArray(elem) &&
      elem.every((hob: unknown) => typeof hob === 'string')
    );
  } catch {
    return false;
  }
}
