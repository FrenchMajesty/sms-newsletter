import React from 'react';
import MaskedInput from 'react-text-mask';
import { PhoneOutlined } from '@ant-design/icons';
import { Input } from 'antd';

const PhoneNumberInput = ({ props }) => {
    return (
        <MaskedInput
            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            guide={false}
            showMask
            render={(ref, props) => <Input ref={(input) => ref(input && input.input)} prefix={<PhoneOutlined />} {...props} />}
            {...props}
        />
    );
}

export default PhoneNumberInput;
