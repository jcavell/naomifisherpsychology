#!/bin/bash

# Check if a file is provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <file or directory>"
  exit 1
fi

# Store input parameter
input=$1

# Function to process a single file
process_file() {
  local file=$1

  # Make a backup of the original file
  cp "$file" "$file.bak"

  # Use sed to remove attributes: class, data-spec, aria- attributes, and any data-* attributes
  sed -i '' -E 's/ class="[^"]*"//g; s/ data-spec="[^"]*"//g; s/ aria-[a-zA-Z-]+="[^"]*"//g; s/ data-[a-zA-Z0-9_-]+="[^"]*"//g' "$file"

  echo "Processed $file. Backup saved as $file.bak."
}

# If a single file is passed
if [ -f "$input" ]; then
  process_file "$input"

# If a directory is passed, process all files
elif [ -d "$input" ]; then
  for file in "$input"/*.html; do
    [ -f "$file" ] && process_file "$file"
  done
else
  echo "Invalid input. Please provide a valid file or directory."
  exit 1
fi