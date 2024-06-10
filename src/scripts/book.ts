export const yyyymmddToddmmyyyy = function (input: string): string {
  var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
  if (!input || !input.match(pattern)) {
    return "";
  }
  return input.replace(pattern, "$3/$2/$1");
};
