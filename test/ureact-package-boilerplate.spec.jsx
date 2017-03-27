import {shallow} from 'enzyme';
import UreactPackageBoilerplate from 'ureact-package-boilerplate';

describe('ureact-package-boilerplate', () => {
  it('renders a div', () => {
    var component = shallow(<UreactPackageBoilerplate/>);

    expect(component.find('div').length).toBe(1);
  });
});