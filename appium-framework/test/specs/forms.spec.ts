import FormsPage from '../pageobjects/forms.page';
import { DROPDOWN_OPTIONS, MESSAGES } from '../data/test-data';
import { tap } from '../helpers/gestures';

describe('Form components', () => {
  beforeEach(async () => {
    await FormsPage.openTab('Forms');
  });

  it('Verify that text typed into the input field is echoed back in the result label underneath @smoke @TS-411', async () => {
    await FormsPage.fillTextInput('Hello from Lagos');

    await expect(FormsPage.textInputResult).toHaveText('Hello from Lagos');
  });

  it('Verify that tapping the switch turns it on and changes its label to offer turning it off @TS-412', async () => {
    const before = await FormsPage.switchToggle.getAttribute('checked');
    await tap(FormsPage.switchToggle);

    await expect(FormsPage.switchToggle).toHaveAttribute('checked', before === 'true' ? 'false' : 'true');
    await expect(FormsPage.switchLabel).toHaveText(before === 'true' ? 'Click to turn the switch ON' : 'Click to turn the switch OFF');
  });

  it('Verify that choosing an item from the dropdown shows that item as the selected value @TS-413', async () => {
    await FormsPage.chooseDropdownOption(DROPDOWN_OPTIONS.appium);

    await expect(FormsPage.dropdownOption(DROPDOWN_OPTIONS.appium)).toBeDisplayed();
  });

  it('Verify that tapping the Active button opens a dialog saying the button is active @TS-414', async () => {
    await tap(FormsPage.activeButton);

    await expect(FormsPage.dialogMessage).toHaveText(MESSAGES.activeButton);
    await FormsPage.dismissDialog();
  });
});
