
import { faker } from "@faker-js/faker";
import BasicProfileDetailsPage from "@pages/applicationProcess/basicProfileDetails.page";
import CreateAccountPage from "@pages/createAccount.page";
import EssayPage from "@pages/applicationProcess/essay.page";
import ExtraCurricularActivitiesPage from "@pages/applicationProcess/extraCurricularActivities.page";
import HighSchoolInformationPage from "@pages/applicationProcess/highSchoolInformation.page";
import KaleidoscopeSignInPage from "@pages/kaleidoscopeSignIn.page";
import ReviewApplicationPage from "@pages/applicationProcess/reviewApplication.page";
import SDETScholarshipLoginPage from "@pages/sdetScholarshipLanding.page";
import test, { expect } from "@playwright/test";
import commonUtility from "helpers/commonUtility";
import path from 'path'



let sdetScholarshipLoginPage:SDETScholarshipLoginPage
let kaleidoscopeSignInPage:KaleidoscopeSignInPage
let createAccountPage:CreateAccountPage
let basicProfileDetailsPage:BasicProfileDetailsPage
let extraCurricularActivitiesPage:ExtraCurricularActivitiesPage
let highSchoolInformationPage:HighSchoolInformationPage
let essayPage:EssayPage
let reviewApplicationPage:ReviewApplicationPage
const extraCurricularActivities:string[]=['Sports','Music','Dance','Drama','Debate','Quiz','Science Club','Math Club','Art Club','Photography','Videography','Coding Club','Robotics Club','Chess Club','Scouts','NCC','NSS','Red Cross','Volunteering','Internship','Part-time Job','Freelancing','Blogging','Social Media Influencer','Entrepreneurship','Startup','NGO','Community Service','Others']
const fileName:string='My School Transcript.pdf'
test.beforeEach(async ({ page }) => {
    await page.goto('https://apply.mykaleidoscope.com/program/sdet-test-scholarship');
    sdetScholarshipLoginPage = new SDETScholarshipLoginPage(page)
    kaleidoscopeSignInPage = new KaleidoscopeSignInPage(page)
    createAccountPage = new CreateAccountPage(page)
    basicProfileDetailsPage = new BasicProfileDetailsPage(page)
    extraCurricularActivitiesPage = new ExtraCurricularActivitiesPage(page)
    highSchoolInformationPage = new HighSchoolInformationPage(page)
    essayPage = new EssayPage(page)
    reviewApplicationPage = new ReviewApplicationPage(page)
})

test('SDET Scholarship Application Test', async ({ page }) => {
    await sdetScholarshipLoginPage.loginToApply.click();
    const emailAddress:string=faker.internet.email();
    await kaleidoscopeSignInPage.emailInputField.fill(emailAddress)
    await kaleidoscopeSignInPage.nextButton.click()
    const fistName:string=faker.person.firstName()
    const lastName:string=faker.person.lastName()
    const mobileNo:string=faker.number.int({min:900000000,max:999999999}).toString()
    const password:string=commonUtility.generatePassword()    
    await createAccountPage.fillTheForm(fistName,lastName,mobileNo,password)
    await createAccountPage.ageConfirmationCheckbox.click()
    await createAccountPage.submitButton.click()

    const streetAddress:string=faker.location.streetAddress()
  
    const city:string=faker.location.city()
    const zipCode:string=faker.location.zipCode('#####')
    const {state,country}=await basicProfileDetailsPage.fillBasicProfileDetails(streetAddress,city,zipCode)
    await basicProfileDetailsPage.nextPageButton.click()

    await expect(extraCurricularActivitiesPage.pageTitle).toHaveText('Extracurricular Activities')
    await extraCurricularActivitiesPage.addEntryButton.click()
    await extraCurricularActivitiesPage.addEntryTextOnPopup.waitFor({state:'visible'})
    const extraCurricularActivity:string=commonUtility.getRandomElementFromArray(extraCurricularActivities)
    await extraCurricularActivitiesPage.extraCurricularActivityNameField.fill(extraCurricularActivity)
    const noOfYears:string=faker.number.int({min:1,max:10}).toString()
    await extraCurricularActivitiesPage.totalNumberOfYearsField.fill(noOfYears)
    const randomRecoginition:string=faker.lorem.sentence()
    await extraCurricularActivitiesPage.listAnyLeadershipField.fill(randomRecoginition)
    const randomDescription:string=faker.lorem.paragraph()
    await extraCurricularActivitiesPage.descriptionOfInvolvementField.fill(randomDescription)
    await extraCurricularActivitiesPage.addButton.click()
    await extraCurricularActivitiesPage.nextPageButton.click()
    await expect(extraCurricularActivitiesPage.minimumEntryError).toBeVisible()
    await extraCurricularActivitiesPage.addEntryButton.click()
    await extraCurricularActivitiesPage.addEntryTextOnPopup.waitFor({state:'visible'})
    const newActivity:string=commonUtility.getRandomElementFromArray(extraCurricularActivities)
    await extraCurricularActivitiesPage.extraCurricularActivityNameField.fill(newActivity)
    const newNoOfYears:string=faker.number.int({min:1,max:10}).toString()
    await extraCurricularActivitiesPage.totalNumberOfYearsField.fill(newNoOfYears)
    const newRandomRecoginition:string=faker.lorem.sentence()
    await extraCurricularActivitiesPage.listAnyLeadershipField.fill(newRandomRecoginition)
    const newRandomDescription:string=faker.lorem.paragraph()
    await extraCurricularActivitiesPage.descriptionOfInvolvementField.fill(newRandomDescription)
    await extraCurricularActivitiesPage.addButton.click()
    await expect(await extraCurricularActivitiesPage.getAllAddedEntry()).toHaveLength(2)
    await extraCurricularActivitiesPage.clickOnNextPageButton()
    
    await expect(highSchoolInformationPage.highSchoolInformationTitle).toHaveText('High School Information')
    const highSchoolName:string=faker.company.name()
    await highSchoolInformationPage.highSchoolNameField.fill(highSchoolName)
    const highSchoolStreetAddress:string=faker.location.streetAddress()
    await highSchoolInformationPage.highSchoolStreetAddressField.fill(highSchoolStreetAddress)
    const highSchoolCity:string=faker.location.city()
    await highSchoolInformationPage.highSchoolCityField.fill(highSchoolCity)
    const stateName:string='California'
    await highSchoolInformationPage.selectHighSchoolState(stateName)
    const zipCodeForHighSchool:string=faker.location.zipCode('#####')
    await highSchoolInformationPage.highSchoolZipCodeField.fill(zipCodeForHighSchool)
    const gpa:string=faker.number.float({min:1,max:9,multipleOf:0.25}).toString()
    await highSchoolInformationPage.gpaField.fill(gpa)
    const yearOfHightSchoolGraduation:string=await highSchoolInformationPage.firstRandomAvailableDate()
    await highSchoolInformationPage.inputFile.setInputFiles(path.join(__dirname,`../docsToBeUploaded/${fileName}`))
    await highSchoolInformationPage.uploadedFileLink(fileName).waitFor({state:'visible'})
    await highSchoolInformationPage.clickOnNextPageButton()

    await expect(essayPage.essayPageTitle).toHaveText('Essay')
    await essayPage.carsCheckBox.click()
    await expect(essayPage.essayAboutCarsText).toBeVisible()
    await expect(essayPage.essayCarsInputField).toBeVisible()
    await essayPage.carsCheckBox.click()
    await essayPage.animalsCheckBox.click()
    await essayPage.essayAnimalsInputField.click()
    await expect(essayPage.essayAboutAnimalsText).toBeVisible()
    await expect(essayPage.essayAnimalsInputField).toBeVisible()
    await essayPage.animalsCheckBox.click()
    await essayPage.schoolCheckBox.click()
    let essayType:string="School"
    await expect(essayPage.essayAboutSchoolText).toBeVisible()
    await expect(essayPage.essaySchoolInputField).toBeVisible()
    await essayPage.otherCheckBox.click()
    await expect(essayPage.essayAboutOtherText).toBeVisible()
    await expect(essayPage.essayOtherInputField).toBeVisible()
    await essayPage.otherCheckBox.click()
    await expect(essayPage.essayAboutOtherText).not.toBeInViewport()
    await essayPage.animalsCheckBox.click()
    essayType=essayType+", "+"Animals"
    
    const essayAboutAnimals:string=faker.lorem.paragraph()
    await essayPage.essayAnimalsInputField.fill(essayAboutAnimals)
    const essayAboutSchool:string=faker.lorem.paragraph()
    await essayPage.essaySchoolInputField.fill(essayAboutSchool)
    await essayPage.nextPageButton.click()
    await expect(reviewApplicationPage.reviewYourApplicationText).toBeVisible()

    await expect(reviewApplicationPage.sdetScholarShipText).toBeVisible()
    await expect(reviewApplicationPage.continueApplicationLink).toBeVisible()
    await expect(reviewApplicationPage.submitButton).toBeVisible()
    await expect(reviewApplicationPage.printApplicationButton).toBeVisible()
    await expect(reviewApplicationPage.editButtonForLetsGetToKnow).toBeVisible()
    await expect(reviewApplicationPage.editButtonForExtraCurricularActivities).toBeVisible()
    await expect(reviewApplicationPage.editButtonForHighSchoolInformation).toBeVisible()
    await expect(reviewApplicationPage.editButtonForEssay).toBeVisible()

    await reviewApplicationPage.letsGetToKnowText.click()
    await expect(reviewApplicationPage.firstNameValue).toHaveText(fistName)
    await expect(reviewApplicationPage.lastNameValue).toHaveText(lastName)
    await expect(reviewApplicationPage.emailAddressValue).toHaveText(emailAddress.toLowerCase())
    await expect(reviewApplicationPage.streetAddressValue).toHaveText(streetAddress)
    await expect(reviewApplicationPage.additionalStreetAddressValue).not.toBeVisible()
    await expect(reviewApplicationPage.stateValue).toHaveText(state)
    await expect(reviewApplicationPage.cityValue).toHaveText(city)
    await expect(reviewApplicationPage.zipCodeValue).toHaveText(zipCode)
    await expect(reviewApplicationPage.countryValue).toHaveText(country)

    await reviewApplicationPage.extraCurricularActivitiesText.click()
    await expect(reviewApplicationPage.getActivityElement(extraCurricularActivity)).toBeVisible()
    await reviewApplicationPage.getActivityElement(extraCurricularActivity).click()
    await expect(reviewApplicationPage.getExtraCurricularActivityNameElement(extraCurricularActivity)).toBeVisible()
    await expect(reviewApplicationPage.getTotalNoOfYearsElement(noOfYears)).toBeVisible()
    await expect(reviewApplicationPage.getListAnyLeadershipRoleElement(randomRecoginition)).toBeVisible()
    await expect(reviewApplicationPage.getDescriptionOfInvolvementElement(randomDescription)).toBeVisible()

    await expect(reviewApplicationPage.getActivityElement(newActivity)).toBeVisible()
    await reviewApplicationPage.getActivityElement(newActivity).click()
    await expect(reviewApplicationPage.getExtraCurricularActivityNameElement(newActivity)).toBeVisible()
    await expect(reviewApplicationPage.getTotalNoOfYearsElement(newNoOfYears)).toBeVisible()
    await expect(reviewApplicationPage.getListAnyLeadershipRoleElement(newRandomRecoginition)).toBeVisible()
    await expect(reviewApplicationPage.getDescriptionOfInvolvementElement(newRandomDescription)).toBeVisible()

    await reviewApplicationPage.highSchoolInformationText.click()
    await expect(reviewApplicationPage.highSchoolNameValue).toHaveText(highSchoolName)
    await expect(reviewApplicationPage.highSchoolStreetAddressValue).toHaveText(highSchoolStreetAddress)
    await expect(reviewApplicationPage.additionalHighSchoolStreetAddressValue).not.toBeVisible()
    await expect(reviewApplicationPage.highSchoolCityValue).toHaveText(highSchoolCity)
    await expect(reviewApplicationPage.highSchoolStateValue).toHaveText(stateName)
    await expect(reviewApplicationPage.highSchoolZipCodeValue).toHaveText(zipCodeForHighSchool)
    await expect(reviewApplicationPage.gpaValue).toHaveText(parseInt(gpa).toString())
    await expect(reviewApplicationPage.yearOfHighSchoolValue).toHaveText(commonUtility.getFormattedDate(yearOfHightSchoolGraduation))
    await expect(reviewApplicationPage.getUploadedTranscriptValue(fileName)).toBeVisible()

    await reviewApplicationPage.essayText.click()
    await expect(reviewApplicationPage.selectedEssayTypeValue).toHaveText(essayType)
    await expect(reviewApplicationPage.essayAboutAnimalsValue).toHaveText(essayAboutAnimals)
    await expect(reviewApplicationPage.essayAboutSchoolValue).toHaveText(essayAboutSchool)
    const url:string= page.url()
    await reviewApplicationPage.submitButton.click()
    await expect(reviewApplicationPage.applicationSubmittedText).toBeVisible()
    await page.goto(url)
    await expect(reviewApplicationPage.reviewYourApplicationText).toBeVisible()
    await expect(reviewApplicationPage.editButtonForLetsGetToKnow).not.toBeVisible()
    await expect(reviewApplicationPage.editButtonForExtraCurricularActivities).not.toBeVisible()
    await expect(reviewApplicationPage.editButtonForHighSchoolInformation).not.toBeVisible()
    await expect(reviewApplicationPage.editButtonForEssay).not.toBeVisible()
    
})