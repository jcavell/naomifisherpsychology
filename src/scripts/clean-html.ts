export function cleanHtml(input: string): string {
  let output = input;

  // 1. Remove empty paragraphs like <p><br></p> or <p> </p>
  output = output.replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "");

  // 2. Remove duplicated tags like <strong><strong>...</strong></strong>
  output = output.replace(
    /<(strong|em)>\s*<\1>(.*?)<\/\1>\s*<\/\1>/gi,
    "<$1>$2</$1>"
  );

  // 3. Repeat until fully flattened (handles triple nesting)
  let prev: string;
  do {
    prev = output;
    output = output.replace(
      /<(strong|em)>\s*<\1>(.*?)<\/\1>\s*<\/\1>/gi,
      "<$1>$2</$1>"
    );
  } while (output !== prev);

  return output;
}