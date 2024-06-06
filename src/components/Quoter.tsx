import { useState } from 'preact/hooks';

export type Quote = {
  text:string,
  author:string
}

export default function GenerateQuote({quotes: quoties}) {

  const randomQuote = () => quoties[(Math.floor(Math.random() * quoties.length))];
  const [quote, setQuote] = useState(quoties[0]);

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