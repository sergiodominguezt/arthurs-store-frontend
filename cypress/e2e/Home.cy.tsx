describe('login', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  })

  it('input name an click on button', () => {
    cy.get('input').type('testing');
    cy.get('button').click();
    cy.contains('p', 'click on');
  })
})