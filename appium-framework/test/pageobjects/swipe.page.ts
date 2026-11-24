import { BasePage } from './base.page';
import { byTestId } from '../helpers/selectors';
import { scrollToTestId } from '../helpers/gestures';

const HIDDEN_LOGO_ID = 'WebdriverIO logo';

class SwipePage extends BasePage {
  get hiddenLogo() {
    return byTestId(HIDDEN_LOGO_ID);
  }

  async revealHiddenLogo() {
    await scrollToTestId(HIDDEN_LOGO_ID);
  }
}

export default new SwipePage();
