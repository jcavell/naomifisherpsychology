export const yyyymmddToddmmyyyy = function (input: string): string {
  var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
  if (!input || !input.match(pattern)) {
    return "";
  }
  return input.replace(pattern, "$3/$2/$1");
};


export function getFormats(book): string[]{
  let formats = ["Paperback"];

  if (book.kindleUrl) {
    formats.push("E-Book");
  }

  if (book.audiobookLength) {
    formats.push("Audiobook");
  }
  return formats;
}
