import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import { Link } from './Link';
jest.mock('../../history');

describe('<Link/>', () => {
    const ChildStub = () => <div>inner child</div>;
    describe('render methods', () => {
        it('should return an element with an onClick method attached', () => {
            const wrapper = shallow(
                <Link to="/">
                    <ChildStub/>
                </Link>
            );
            expect(wrapper.find(ChildStub).length).toBe(1);
            expect(wrapper.props().onClick).toBeDefined();
        });
        it('should render correctly', () => {
            const component = renderer.create(
                <Link to="/">
                    <ChildStub/>
                </Link>
            );
            const tree = component.toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
});
