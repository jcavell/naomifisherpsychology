import { useEffect, useState } from "react";

export default function GenerateQuote({ quotes }) {
  const randomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];
  const [quote, setQuote] = useState<QuoteType | null>(null); // Initialize with null

  useEffect(() => {
    setQuote(randomQuote());
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="preview-quote-wrapper">
      <div className="preview-quote quote">
        {quote ? ( // Conditionally render quote details to avoid errors if quote is initially null
          <>
            <p>{quote.text}</p>
            <span>{quote.author}</span>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

interface QuoteType {
  text: string;
  author: string;
}
