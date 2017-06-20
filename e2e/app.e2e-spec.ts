import { IndigoPage } from './app.po';

describe('indigo App', () => {
  let page: IndigoPage;

  beforeEach(() => {
    page = new IndigoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
