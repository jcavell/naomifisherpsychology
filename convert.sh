find . -name "*.astro" -type f | while read file; do
  iconv -f MACROMAN -t UTF-8 "$file" -o "${file}.tmp" && mv "${file}.tmp" "$file"
done

