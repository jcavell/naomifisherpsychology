import { useState } from 'preact/hooks';

export default function GenerateQuote({quotes}) {
  
  const randomQuote = () => quotes[(Math.floor(Math.random() * quotes.length))];
  const [quote, setQuote] = useState(quotes[0]);

  setQuote(randomQuote());

  return (
   <div class="preview-quote-wrapper">
		<div class="preview-quote quote">
			{quote.text}
			<span>{quote.author}</span>
		</div>
	</div>
  );
}