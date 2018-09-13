import { AppPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('StupidAccess page', () => {
  let page = new AppPage();

  beforeEach(() => {
    page.navigateHome();
    browser.waitForAngularEnabled(false);
  });
  it('should do a stupidaccess', () => {
    let StupudAccessInput = element(by.name("access"));
    let StupudAccessSubmit = element(by.name("submit"));

    StupudAccessInput.sendKeys('dnkzspb123');

    expect(StupudAccessInput.getAttribute('value')).toEqual('dnkzspb123');

    StupudAccessSubmit.click();
    browser.sleep(2000);
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/system/shows');






  });


  // it('should display welcome message', () => {
  //   page.navigateTo();
  //   expect(page.getParagraphText()).toEqual('Welcome to app!');
  // });
});
