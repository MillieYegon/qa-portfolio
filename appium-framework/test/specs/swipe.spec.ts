import SwipePage from '../pageobjects/swipe.page';

describe('Swipe', () => {
  beforeEach(async () => {
    await SwipePage.openTab('Swipe');
  });

  it('Verify that swiping up on the swipe screen reveals the hidden WebdriverIO logo @TS-421', async () => {
    await SwipePage.revealHiddenLogo();

    await expect(SwipePage.hiddenLogo).toBeDisplayed();
  });
});
