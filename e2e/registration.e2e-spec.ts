import { browser, element, by } from "protractor";
import { AppPage } from "./app.po";

describe('Test Registration', () => {
    let page = new AppPage();
  
    beforeEach(() => { 
        page.navigateReg();
        browser.waitForAngularEnabled(false);

    });
    it('should do click on back button and redirect to main page', () => {

        page.regbackbutton().click();
        browser.sleep(2000);
        expect(browser.getCurrentUrl()).toBe('http://localhost:4200/system/shows');
  
    });

    it('should click on button LOG IN and redirect to login', () => {
        
        element(by.css('.link-link-to-login')).click();
        browser.sleep(2000);
        expect(browser.getCurrentUrl()).toBe('http://localhost:4200/login');
        
        
  
    });

    it('when dont input any data and click on button - Send Text', () => {
        
        page.buttonSend().click();
        browser.sleep(200);
        expect(page.domElementP().getText()).toEqual('Tel. number is required');
  
    });

    it('when you select country and write telephone number', () => {

        page.selectCountry()
        page.inputNumber().sendKeys('000000000');
        expect(page.inputNumber().getAttribute('value')).toEqual('+213-00-000-0000');
        
        page.buttonSend().click();
        browser.sleep(200);
        expect(page.inputValidCode().isPresent());
  
    });
  
  

  });
  