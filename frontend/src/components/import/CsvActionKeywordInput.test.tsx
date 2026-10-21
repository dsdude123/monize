import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/test/render';
import { CsvActionKeywordInput, parseActionKeywords } from './CsvActionKeywordInput';

// A parent that feeds the parsed list back in, as the column mapping step
// does; a plain mock callback never re-renders and hides the defect.
function Harness({ initial = [] as string[] }) {
  const [keywords, setKeywords] = useState<string[]>(initial);
  return (
    <>
      <CsvActionKeywordInput keywords={keywords} onKeywordsChange={setKeywords} placeholder="buy" />
      <button type="button" onClick={() => setKeywords(['loaded', 'mapping'])}>load</button>
      <output data-testid="parsed">{JSON.stringify(keywords)}</output>
    </>
  );
}

describe('parseActionKeywords', () => {
  it('splits on commas, trims and drops empties', () => {
    expect(parseActionKeywords(' buy to open, ,bought ,')).toEqual(['buy to open', 'bought']);
  });
});

describe('CsvActionKeywordInput', () => {
  it('accepts a space and a comma typed into a controlled field', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByPlaceholderText('buy') as HTMLInputElement;

    await user.type(input, 'buy to open, you bought');

    expect(input.value).toBe('buy to open, you bought');
    expect(screen.getByTestId('parsed').textContent).toBe('["buy to open","you bought"]');
  });

  it('shows the current list on mount', () => {
    render(<Harness initial={['acquisto', 'compra']} />);

    expect((screen.getByPlaceholderText('buy') as HTMLInputElement).value).toBe('acquisto, compra');
  });

  it('takes a list replaced from outside, such as a loaded saved mapping', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByPlaceholderText('buy') as HTMLInputElement;
    await user.type(input, 'typed,');

    await user.click(screen.getByText('load'));

    expect(input.value).toBe('loaded, mapping');
  });
});
