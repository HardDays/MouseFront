import { browser, by, element } from 'protractor';

export class AppPage {

  //Navigation
  navigateHome() {
    return browser.get('/');
  }
  navigateReg(){
    return browser.get('/register');
  }


  //Registration page 1

  regbackbutton(){
    return element(by.css(".abs-arr-left-reg"));
  }

  selectCountry(){
    
    return element(by.cssContainingText('option', 'Algeria (‫الجزائر‬‎) (+213)')).click();
  }

  inputNumber(){
    return element(by.name('phone'));
  }  

  buttonSend(){
    return element(by.css('.butt-style-1'));
  }

  domElementP(){
    return element(by.css('.qqq'));
  }

  inputValidCode(){
    return element(by.css('inp-code-wrapp'));
  }

}

