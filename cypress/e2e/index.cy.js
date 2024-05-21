it('titles are correct', () => {
  const page = cy.visit('/');

  page.get('title').should('have.text', 'Dr Naomi Fisher - Home')
  page.get('h1').should('have.text', 'Home');
});