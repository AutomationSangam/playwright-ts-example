import { Page,Locator } from '@playwright/test';
export default class BasicProfileDetailsPage {
    constructor(private page: Page) {}
    pageTitle:Locator=this.page.getByTestId('page-title')
    pleaseFillOutFormText:Locator=this.page.getByText('Please fill out')
    firstNameField:Locator=this.page.locator('[name="contact.firstName"]')
    lastNameField:Locator=this.page.locator('[name="contact.lastName"]')
    emailField:Locator=this.page.locator('[name="contact.email"]')
    streetAddressField:Locator=this.page.getByPlaceholder('Enter your street address')
    additionalStreetAddressField:Locator=this.page.getByPlaceholder('Enter additional street address (e.g. Apt Number)')
    stateField:Locator=this.page.getByPlaceholder('Enter your state')
    cityField:Locator=this.page.getByPlaceholder('Enter your city')
    zipCodeField:Locator=this.page.getByPlaceholder('Enter your zip code')
    countryField:Locator=this.page.getByPlaceholder('Enter your country')
    nextPageButton:Locator=this.page.getByRole('button',{name:'Next Page'})

    async selectState(){
        await this.stateField.click()
        await this.page.getByRole('option',{name:'California'}).click()
        return 'California'
    }

    async selectCountry(){
        await this.countryField.click()
        await this.page.getByRole('option',{name:'United States of America'}).click()
        return 'United States of America'
    }
    async fillBasicProfileDetails(streetAddress:string,city:string,zipCode:string){
        await this.streetAddressField.fill(streetAddress)
        const state:string=await this.selectState()
        await this.cityField.fill(city)
        await this.zipCodeField.fill(zipCode)
        const country:string=await this.selectCountry()
        return {state,country}
    }   
}
